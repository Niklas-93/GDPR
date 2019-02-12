const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

// Load Strategy and Patterns model
const Strategy = require("../../models/Strategy");
const Pattern = require("../../models/Pattern");

// @route   GET api/general/test
// @desc    Tests general route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "General Works" }));

// @route   GET api/general/search
// @desc    serach Patterns and Strategies/Tactics
// @access  Public
router.post("/search", (req, res) => {
  // var regex = "/.*" + req.body.searchString + ".*/";
  var regex = ".*" + req.body.searchString + ".*";
  var insertRegex = new RegExp(regex, "i");
  console.log(regex);

  //mongoose.createIndex
  //db.Pattern.createIndex({ name: "text" });
  /*Pattern.find({ $text: { $search: req.body.searchString } })
    .then(searchResults => {
      console.log(searchResults);
      res.json({ searchResults });
    })
    .catch(err => console.log(err));*/

  /*Pattern.find({ name: insertRegex })
    .then(searchResultsPatterns => {
      Strategy.find({
        name: insertRegex
      }).then(searchResultsStrategies => {
        var searchResults = {
          Patterns: searchResultsPatterns,
          Strategies: searchResultsStrategies
        };
        console.log(searchResults);
        res.json({ searchResults });
      });
    })
    .catch(err => console.log(err));*/

  Pattern.find({ name: insertRegex })
    .then(searchResultsPatterns => {
      Strategy.find({
        name: insertRegex
      }).then(searchResultsStrategies => {
        Strategy.find({
          "assignedTactics.name": insertRegex
        }).then(searchResultsTactics => {
          var tacticsWithStrategies = [];
          searchResultsTactics.forEach(function(strategy) {
            strategy.assignedTactics.forEach(function(tactic) {
              if (insertRegex.test(tactic)) {
                console.log(tactic);
                tacticsWithStrategies.push({
                  name: tactic.name,
                  _id: tactic._id,
                  isTactic: true,
                  assignedStrategy: strategy
                });
              }
            });
          });
          var searchResults = {
            Patterns: searchResultsPatterns,
            Strategies: searchResultsStrategies,
            Tactics: tacticsWithStrategies
          };
          // console.log(searchResults);
          res.json({ searchResults });
        });
      });
    })
    .catch(err => console.log(err));
});

router.get("/testindex", (req, res) => {
  Pattern.getIndexes()
    .then(searchResults => {
      console.log(searchResults);
      res.json({ searchResults });
    })
    .catch(err => console.log("Fehler"));
});

module.exports = router;
