const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Input Validation
const validateTacticInput = require("../../validation/createTactic");

// Load Tactic model
const Tactic = require("../../models/Tactic");

// @route   GET api/tactics/test
// @desc    Tests tactics route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Tactics Works" }));

// @route   GET api/tactics/patterns
// @desc    Get all tactics
// @access  Public
router.get("/", (req, res) =>
  Tactic.find({}).then(tactics => {
    res.json(tactics);
  })
);

// @route   GET api/tactics/createtactic
// @desc    Create Tactic
// @access  Private
router.post("/createtactis", (req, res) => {
  const { errors, isValid } = validateTacticInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Tactic.findOne({ name: req.body.name }).then(tactic => {
    if (tactic) {
      errors.name = "Tactic already exists";
      return res.status(400).json(errors);
    } else {
      const newTactic = new Tactic({
        name: req.body.name,
        description: req.body.description
      });
      newTactic
        .save()
        .then(tactic => res.json(tactic))
        .catch(err => console.log(err));
    }
  });
});

// @route   DELETE api/patterns/:id
// @desc    Delete pattern
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Tactic.findById(req.params.id)
      .then(tactic => {
        // Delete
        tactic.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ tacticnotfound: "No tactic found" })
      );
  }
);

// @route   POST api/tactic
// @desc    Edit tactic
// @access  Private
router.post(
  "/edittactic",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateTacticInput(req.body);

    // Check Validation
    /*
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }*/

    // Get fields
    const tacticFields = {};
    tacticFields.id = req.body.id;
    if (req.body.name) tacticFields.name = req.body.name;
    if (req.body.description) tacticFields.description = req.body.description;

    Tactic.findOneAndUpdate(
      { _id: req.body.id },
      { $set: tacticFields },
      { new: true }
    ).then(tactic => {
      Tactic.find({}).then(tactics => {
        res.json(tactics);
      });
    });
  }
);

module.exports = router;
