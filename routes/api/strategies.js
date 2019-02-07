const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Strategy model
const Strategy = require("../../models/Strategy");

// @route   GET api/strategies/test
// @desc    Tests strategies route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Strategy Works" }));

// @route   GET api/strategies/
// @desc    Get all projects
// @access  Public
router.get("/", (req, res) =>
  Strategy.find({}).then(strategies => {
    res.json(strategies);
  })
);

// @route   GET api/strategies/createstrategy
// @desc    Create Strategy
// @access  Private
router.post("/createstrategy", (req, res) => {
  // const { errors, isValid } = validateStrategyInput(req.body);

  // Check Validation
  /*
    if (!isValid) {
      return res.status(400).json(errors);
    }*/

  Strategy.findOne({ name: req.body.name }).then(strategy => {
    if (strategy) {
      errors.name = "Strategy already exists";
      return res.status(400).json(errors);
    } else {
      const newStrategy = new Strategy({
        name: req.body.name,
        description: req.body.description,
        assignedTactics: req.body.assignedTactics
      });
      newTactic
        .save()
        .then(strategy => res.json(strategy))
        .catch(err => console.log(err));
    }
  });
});

// @route   DELETE api/strategies/:id
// @desc    Delete strategy
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Strategy.findById(req.params.id)
      .then(strategy => {
        // Delete
        strategy.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ strategynotfound: "No strategy found" })
      );
  }
);

// @route   POST api/tactic
// @desc    Edit tactic
// @access  Private
router.post(
  "/editstrategy",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //console.log(req.body);
    // const { errors, isValid } = validateTacticInput(req.body);

    // Check Validation
    /*
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }*/

    // Get fields
    const strategyFields = {};
    strategyFields.id = req.body.id;
    //console.log("id:");
    //console.log(strategyFields);
    if (req.body.name) strategyFields.name = req.body.name;
    //console.log(strategyFields);
    if (req.body.description) strategyFields.description = req.body.description;
    //console.log(strategyFields);
    if (req.body.assignedTactics)
      strategyFields.assignedTactics = req.body.assignedTactics;
    /* strategyFields.assignedTactics.forEach(tactic => {
      if (tactic.hasOwnProperty("id")) {
        console.log(tactic);
      } else {
        console.log(tactic);
        tactic.id = ObjectId();
      }
    });*/
    //console.log("fields:");
    //console.log(strategyFields);

    Strategy.findOneAndUpdate(
      { _id: req.body.id },
      { $set: strategyFields },
      { new: true }
    ).then(strategy => {
      Strategy.find({}).then(strategies => {
        res.json(strategies);
      });
    });
  }
);

module.exports = router;
