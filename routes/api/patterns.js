const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

// Load Input Validation
const validatePatternInput = require("../../validation/createPattern");

// Load Pattern model
const Pattern = require("../../models/Pattern");

// Load Strategy model
const Strategy = require("../../models/Strategy");
const Tactic = require("../../models/Tactic");

// @route   GET api/patterns/test
// @desc    Tests patterns route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Patterns Works" }));

// @route   GET api/patterns/patterns
// @desc    Get all patterns
// @access  Public

router.get("/", (req, res) =>
  Pattern.aggregate([
    {
      $lookup: {
        from: "strategies",
        localField: "assignedTactics",
        foreignField: "assignedTactics._id",
        as: "assignedStrategiesWithAllTactics"
      }
    }
  ])

    .exec()
    .then(patterns => {
      patterns.forEach(function(pattern) {
        pattern.assignedTactics.forEach(function(
          assignedTactic,
          assignedTacticIndex
        ) {
          pattern.assignedTactics[
            assignedTacticIndex
          ] = assignedTactic.toString();
        });
        pattern.assignedStrategiesWithAllTactics.forEach(function(
          assignedStrategy
        ) {
          var NewAssignedTactics = [];
          assignedStrategy.assignedTactics.forEach(function(
            tactic,
            tacticIndex
          ) {
            if (pattern.assignedTactics.includes(tactic._id.toString())) {
              //console.log("true");
              //console.log(assignedStrategy.assignedTactics[tacticIndex].name);
              NewAssignedTactics.push(
                assignedStrategy.assignedTactics[tacticIndex]
              );
            } else {
              //console.log("false");
              //console.log(assignedStrategy.assignedTactics[tacticIndex].name);
              //console.log(NewAssignedTactics);
            }

            // }
          });
          assignedStrategy.assignedTactics = NewAssignedTactics;
          //console.log(assignedStrategy);

          //console.log(assignedStrategy);
        });
      });

      //console.log(patterns[].assignedStrategiesWithAllTactics[]._id);
      //console.log(patterns[].assignedTactics[]._id);
      //console.log(patterns[].assignedTactics[]._id);
      // patterns.forEach(function(pattern) {
      // pattern.assignedTactics.forEach(function(tactic) {
      //console.log(tactic._id);
      //  });
      //console.log(pattern.assignedTactics);
      //  });
      if (!patterns)
        return res.status(404).json({
          error: "Not Found",
          message: `Patterns not found`
        });
      res.status(200).json(patterns);
    })
    .catch(error =>
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message
      })
    )
);

router.get("/old", (req, res) =>
  Pattern.aggregate([
    {
      $lookup: {
        from: "strategies",
        localField: "assignedStrategies._id",
        foreignField: "assignedStrategies",
        as: "assignedStrategies2"
      }
    }
    /*{
      $lookup: {
        from: "tactics",
        localField: "assignedTactics",
        foreignField: "_id",
        as: "assignedTactics"
      }
    },*/
    /*
    {
      $lookup: {
        from: "strategies",
        localField: "assignedTactics",
        foreignField: "assignedTactics",
        as: "assignedStrategies"
      }
    }*/
    /*,
    {
      $lookup: {
        from: "patterns",
        localField: "assignedStrategies.assignedTactics",
        foreignField: "assignedTactics._id",
        as: "assignedStrategiescomplete"
      }
    }*/
  ])

    .exec()
    .then(patterns => {
      //console.log(patterns[].assignedTactics[]._id);
      // patterns.forEach(function(pattern) {
      // pattern.assignedTactics.forEach(function(tactic) {
      //console.log(tactic._id);
      //  });
      //console.log(pattern.assignedTactics);
      //  });
      if (!patterns)
        return res.status(404).json({
          error: "Not Found",
          message: `Patterns not found`
        });
      res.status(200).json(patterns);
    })
    .catch(error =>
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message
      })
    )
);

router.post("/createpattern", (req, res) => {
  //const { errors, isValid } = validatePatternInput(req.body);

  // Check Validation
  /*if (!isValid) {
    return res.status(400).json(errors);
  }*/
  console.log("newpattern");
  console.log(req.body);
  Pattern.findOne({ name: req.body.name }).then(pattern => {
    if (pattern) {
      errors.name = "Pattern already exists";
      return res.status(400).json(errors);
    } else {
      const newPattern = new Pattern({
        name: req.body.name,
        assignedTactics: req.body.assignedTactics,
        context: req.body.context,
        summary: req.body.summary,
        problem: req.body.problem,
        solution: req.body.solution,
        consequences: req.body.consequences,
        examples: req.body.examples
      });
      newPattern
        .save()
        .then(pattern => res.json(pattern))
        .catch(err => console.log(err));
    }
  });
});

router.get("/testing", (req, res) =>
  Pattern.aggregate([
    /*{
      $match: {
        _id: mongoose.Types.ObjectId("5c053cd672c1ae69c48b76d3")
      }
    },*/
    {
      $lookup: {
        from: "strategies",
        localField: "assignedTactics",
        foreignField: "assignedTactics._id",
        as: "assignedStrategiesWithAllTactics"
      }

      /*,
      $lookup: {
        from: "strategies",
        localField: "assignedTactics._id",
        foreignField: "assignedTactics",
        as: "assignedStrategies"
      }*/
    }
  ])

    .exec()
    .then(patterns => {
      patterns.forEach(function(pattern) {
        pattern.assignedTactics.forEach(function(
          assignedTactic,
          assignedTacticIndex
        ) {
          pattern.assignedTactics[
            assignedTacticIndex
          ] = assignedTactic.toString();
        });
        pattern.assignedStrategiesWithAllTactics.forEach(function(
          assignedStrategy
        ) {
          var NewAssignedTactics = [];
          assignedStrategy.assignedTactics.forEach(function(
            tactic,
            tacticIndex
          ) {
            // if (pattern.assignedTactics.includes(tactic._id)) {
            // console.log(typeof tactic._id);
            // console.log(typeof pattern.assignedTactics[0]);
            // console.log(pattern.assignedTactics[0].toString());
            // console.log(pattern.assignedTactics.includes(tactic._id));
            //tactic._id.toString();
            /* pattern.assignedTactics.forEach(function(
              assignedTactic,
              assignedTacticIndex
            ) {
              pattern.assignedTactics[
                assignedTacticIndex
              ] = assignedTactic.toString();
            });*/

            //  console.log(typeof pattern.assignedTactics[0]);
            if (pattern.assignedTactics.includes(tactic._id.toString())) {
              //console.log("true");
              //console.log(assignedStrategy.assignedTactics[tacticIndex].name);
              NewAssignedTactics.push(
                assignedStrategy.assignedTactics[tacticIndex]
              );
            } else {
              //console.log("false");
              //console.log(assignedStrategy.assignedTactics[tacticIndex].name);
              // assignedStrategy.assignedTactics.splice(tacticIndex, 1);
              // NewAssignedTactics.push(
              // assignedStrategy.assignedTactics[tacticIndex]
              //);
              //console.log(NewAssignedTactics);
            }

            // }
          });
          assignedStrategy.assignedTactics = NewAssignedTactics;
          //console.log(assignedStrategy);

          //console.log(assignedStrategy);
        });
      });

      //console.log(patterns[].assignedStrategiesWithAllTactics[]._id);
      //console.log(patterns[].assignedTactics[]._id);
      //console.log(patterns[].assignedTactics[]._id);
      // patterns.forEach(function(pattern) {
      // pattern.assignedTactics.forEach(function(tactic) {
      //console.log(tactic._id);
      //  });
      //console.log(pattern.assignedTactics);
      //  });
      if (!patterns)
        return res.status(404).json({
          error: "Not Found",
          message: `Patterns not found`
        });
      res.status(200).json(patterns);
    })
    .catch(error =>
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message
      })
    )
);

// @route   GET api/patterns/createpattern
// @desc    Create Pattern
// @access  Private
/*
router.get("/:id", (req, res) => {
  Pattern.findById(req.params.id)
    .then(pattern => {
      console.log("id");
      res.json({ pattern });
    })
    .catch(err =>
      res.status(404).json({ patternnotfound: "No pattern found" })
    );
});*/

router.get("/:id", (req, res) =>
  Pattern.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id)
      }
    },
    {
      $lookup: {
        from: "strategies",
        localField: "assignedTactics",
        foreignField: "assignedTactics._id",
        as: "assignedStrategiesWithAllTactics"
      }
    }
  ])

    .exec()
    .then(patterns => {
      //maybe first forEach not necessary
      patterns.forEach(function(pattern) {
        pattern.assignedTactics.forEach(function(
          assignedTactic,
          assignedTacticIndex
        ) {
          pattern.assignedTactics[
            assignedTacticIndex
          ] = assignedTactic.toString();
        });
        pattern.assignedStrategiesWithAllTactics.forEach(function(
          assignedStrategy
        ) {
          var NewAssignedTactics = [];
          assignedStrategy.assignedTactics.forEach(function(
            tactic,
            tacticIndex
          ) {
            if (pattern.assignedTactics.includes(tactic._id.toString())) {
              console.log("true");
              console.log(assignedStrategy.assignedTactics[tacticIndex].name);
              NewAssignedTactics.push(
                assignedStrategy.assignedTactics[tacticIndex]
              );
            } else {
              console.log("false");
              console.log(assignedStrategy.assignedTactics[tacticIndex].name);

              console.log(NewAssignedTactics);
            }

            // }
          });
          assignedStrategy.assignedTactics = NewAssignedTactics;
          //console.log(assignedStrategy);

          console.log(assignedStrategy);
        });
      });

      //console.log(patterns[].assignedStrategiesWithAllTactics[]._id);
      //console.log(patterns[].assignedTactics[]._id);
      //console.log(patterns[].assignedTactics[]._id);
      // patterns.forEach(function(pattern) {
      // pattern.assignedTactics.forEach(function(tactic) {
      //console.log(tactic._id);
      //  });
      //console.log(pattern.assignedTactics);
      //  });
      if (!patterns)
        return res.status(404).json({
          error: "Not Found",
          message: `Patterns not found`
        });
      res.status(200).json(patterns[0]);
    })
    .catch(error =>
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message
      })
    )
);

// @route   DELETE api/patterns/:id
// @desc    Delete pattern
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Pattern.findById(req.params.id)
      .then(pattern => {
        // Delete
        pattern.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ patternnotfound: "No pattern found" })
      );
  }
);

// @route   POST api/patterns
// @desc    Edit pattern
// @access  Private
router.post(
  "/editpattern",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //const { errors, isValid } = validatePatternInput(req.body);

    // Check Validation
    /*
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }*/

    // Get fields
    const patternFields = {};
    //patternFields = req.body;
    if (req.body.alsoKnownAs) patternFields.alsoKnownAs = req.body.alsoKnownAs;
    if (req.body.name) patternFields.name = req.body.name;
    if (req.body.summary) patternFields.summary = req.body.summary;
    if (req.body.context) patternFields.context = req.body.context;
    if (req.body.problem) patternFields.problem = req.body.problem;
    if (req.body.solution) patternFields.solution = req.body.solution;
    if (req.body.consequences)
      patternFields.consequences = req.body.consequences;
    if (req.body.examples) patternFields.examples = req.body.examples;
    if (req.body.knownUses) patternFields.knownUses = req.body.knownUses;
    if (req.body.relatedPatterns)
      patternFields.relatedPatterns = req.body.relatedPatterns;
    if (req.body.sources) patternFields.sources = req.body.sources;
    if (req.body.assignedTactics)
      patternFields.assignedTactics = req.body.assignedTactics;
    //console.log("patternfields");
    //console.log(patternFields);
    Pattern.findOneAndUpdate(
      { _id: req.body._id },
      { $set: patternFields },
      { new: true }
    )
      .then(pattern => {
        Pattern.aggregate([
          {
            $match: {
              _id: mongoose.Types.ObjectId(req.body._id)
            }
          },
          {
            $lookup: {
              from: "strategies",
              localField: "assignedTactics",
              foreignField: "assignedTactics._id",
              as: "assignedStrategiesWithAllTactics"
            }
          }
        ])

          .exec()
          .then(patterns => {
            //maybe first forEach not necessary
            patterns.forEach(function(pattern) {
              pattern.assignedTactics.forEach(function(
                assignedTactic,
                assignedTacticIndex
              ) {
                pattern.assignedTactics[
                  assignedTacticIndex
                ] = assignedTactic.toString();
              });
              pattern.assignedStrategiesWithAllTactics.forEach(function(
                assignedStrategy
              ) {
                var NewAssignedTactics = [];
                assignedStrategy.assignedTactics.forEach(function(
                  tactic,
                  tacticIndex
                ) {
                  if (pattern.assignedTactics.includes(tactic._id.toString())) {
                    console.log("true");
                    console.log(
                      assignedStrategy.assignedTactics[tacticIndex].name
                    );
                    NewAssignedTactics.push(
                      assignedStrategy.assignedTactics[tacticIndex]
                    );
                  } else {
                    console.log("false");
                    console.log(
                      assignedStrategy.assignedTactics[tacticIndex].name
                    );

                    console.log(NewAssignedTactics);
                  }

                  // }
                });
                assignedStrategy.assignedTactics = NewAssignedTactics;
                //console.log(assignedStrategy);

                console.log(assignedStrategy);
              });
            });

            //console.log(patterns[].assignedStrategiesWithAllTactics[]._id);
            //console.log(patterns[].assignedTactics[]._id);
            //console.log(patterns[].assignedTactics[]._id);
            // patterns.forEach(function(pattern) {
            // pattern.assignedTactics.forEach(function(tactic) {
            //console.log(tactic._id);
            //  });
            //console.log(pattern.assignedTactics);
            //  });
            if (!patterns)
              return res.status(404).json({
                error: "Not Found",
                message: `Patterns not found`
              });
            res.status(200).json(patterns[0]);
          })
          .catch(error =>
            res.status(500).json({
              error: "Internal Server Error",
              message: error.message
            })
          );
      })
      .catch(err =>
        res.status(404).json({ error: "Pattern could not be updated" })
      );
  }
);

module.exports = router;
