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
// @desc    search Patterns and Strategies/Tactics
// @access  Public
router.post("/search", (req, res) => {
  //Convert searchString to Regular Expression
  var regex = ".*" + req.body.searchString + ".*";
  var insertRegex = new RegExp(regex, "i");

  //find all Patterns that match searchString
  Pattern.find({ name: insertRegex })
    .then(searchResultsPatterns => {
      //find all Strategies that match searchString
      Strategy.find({
        name: insertRegex
      }).then(searchResultsStrategies => {
        //find all Tactics that match searchString
        Strategy.find({
          "assignedTactics.name": insertRegex
        }).then(searchResultsTactics => {
          var tacticsWithStrategies = [];
          searchResultsTactics.forEach(function(strategy) {
            strategy.assignedTactics.forEach(function(tactic) {
              if (insertRegex.test(tactic)) {
                // reorder data structure --> tactic with assigned Strategy
                tacticsWithStrategies.push({
                  name: tactic.name,
                  _id: tactic._id,
                  isTactic: true,
                  assignedStrategy: strategy
                });
              }
            });
          });
          // combine Results to one Object
          var searchResults = {
            Patterns: searchResultsPatterns,
            Strategies: searchResultsStrategies,
            Tactics: tacticsWithStrategies
          };
          res.json({ searchResults });
        });
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
