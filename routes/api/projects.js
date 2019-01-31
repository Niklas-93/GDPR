const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

// Load Input Validation
const validateProjectInput = require("../../validation/createProject");

// Load Project model
const Project = require("../../models/Project");
// Load User model
const User = require("../../models/User");

// @route   GET api/projects/test
// @desc    Tests patterns route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Project Works" }));

// @route   GET api/projects/projects
// @desc    Get all projects
// @access  Public

router.get("/", (req, res) =>
  Project.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "assignedDevelopers",
        foreignField: "_id",
        as: "assignedDevelopers"
      }
    },
    {
      $lookup: {
        from: "strategies",
        localField: "assignedTactics",
        foreignField: "assignedTactics._id",
        as: "assignedStrategiesWithAllTactics"
      }
    },
    {
      $lookup: {
        from: "strategies",
        localField: "assignedStrategies",
        foreignField: "_id",
        as: "assignedStrategies"
      }
    }
  ])

    .exec()
    .then(projects => {
      projects.forEach(function(project) {
        project.assignedTactics.forEach(function(
          assignedTactic,
          assignedTacticIndex
        ) {
          project.assignedTactics[
            assignedTacticIndex
          ] = assignedTactic.toString();
        });
        project.assignedStrategiesWithAllTactics.forEach(function(
          assignedStrategy
        ) {
          var NewAssignedTactics = [];
          assignedStrategy.assignedTactics.forEach(function(
            tactic,
            tacticIndex
          ) {
            if (project.assignedTactics.includes(tactic._id.toString())) {
              NewAssignedTactics.push(
                assignedStrategy.assignedTactics[tacticIndex]
              );
            } else {
            }
          });
          assignedStrategy.assignedTactics = NewAssignedTactics;
        });
      });

      if (!projects)
        return res.status(404).json({
          error: "Not Found",
          message: `Projects not found`
        });
      res.status(200).json(projects);
    })
    .catch(error =>
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message
      })
    )
);

// @route   GET api/projects/createproject
// @desc    Create Projects
// @access  Private
router.post(
  "/createproject",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Project.findOne({ name: req.body.name }).then(project => {
      if (project) {
        errors.name = "Project already exists";
        return res.status(400).json(errors);
      } else {
        const newProject = new Project({
          name: req.body.name,
          assignedStrategies: req.body.assignedStrategies,
          assignedTactics: req.body.assignedTactics,
          finished: req.body.finished,
          description: req.body.description,
          assignedDevelopers: req.body.assignedDevelopers,
          creator: req.user.id,
          comment: req.body.comment
        });
        newProject
          .save()
          .then(project => res.json(project))
          .catch(err => console.log(err));
      }
    });
  }
);

// @route   DELETE api/projects/:id
// @desc    Delete project
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.params.id)
      .then(project => {
        // Delete
        project.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ projectnotfound: "No project found" })
      );
  }
);

// @route   GET api/projects/project/:project_id
// @desc    Get project by ID
// @access  Public

router.get("/project/:id", (req, res) => {
  const errors = {};

  Project.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedDevelopers",
        foreignField: "_id",
        as: "assignedDevelopers"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "comment.author",
        foreignField: "_id",
        as: "commentAttendees"
      }
    },
    {
      $lookup: {
        from: "strategies",
        localField: "assignedTactics",
        foreignField: "assignedTactics._id",
        as: "assignedStrategiesWithAllTactics"
      }
    },
    {
      $lookup: {
        from: "strategies",
        localField: "assignedStrategies",
        foreignField: "_id",
        as: "assignedStrategies"
      }
    }
  ])

    .then(projects => {
      projects.forEach(function(project) {
        project.assignedTactics.forEach(function(
          assignedTactic,
          assignedTacticIndex
        ) {
          project.assignedTactics[
            assignedTacticIndex
          ] = assignedTactic.toString();
        });
        project.assignedStrategiesWithAllTactics.forEach(function(
          assignedStrategy
        ) {
          var NewAssignedTactics = [];
          assignedStrategy.assignedTactics.forEach(function(
            tactic,
            tacticIndex
          ) {
            if (project.assignedTactics.includes(tactic._id.toString())) {
              NewAssignedTactics.push(
                assignedStrategy.assignedTactics[tacticIndex]
              );
            } else {
            }
          });
          assignedStrategy.assignedTactics = NewAssignedTactics;
        });
      });
      res.json(projects[0]);
    })
    .catch(err => res.status(404).json({ project: "There is no project" }));
});

// @route   POST api/projects/project/edit/:project_id
// @desc    Edit project by ID
// @access  Public

router.post("/project/edit", (req, res) => {
  const errors = {};

  const projectFields = {};
  const userFields = {};

  if (req.body.name) projectFields.name = req.body.name;
  if (req.body.finished) projectFields.finished = req.body.finished;
  if (req.body.progress) projectFields.progress = req.body.progress;
  if (req.body.description) projectFields.description = req.body.description;
  if (req.body.assignedStrategies)
    projectFields.assignedStrategies = req.body.assignedStrategies;
  if (req.body.assignedTactics)
    projectFields.assignedTactics = req.body.assignedTactics;
  if (req.body.assignedDevelopers)
    projectFields.assignedDevelopers = req.body.assignedDevelopers;
  if (req.body.finishedTactic)
    projectFields.finishedTactic = req.body.finishedTactic;

  if (req.body.assignedDevelopers) userFields.assignedProjects = req.body.id;

  console.log(projectFields);
  //console.log(req.body.comment);

  //console.log("123123" + req.body.id);
  /*for (var i = 0; i < req.body.assignedDevelopers.length; i++) {
    for (
      var j = 0;
      j < req.body.assignedDevelopers[i].assignedProjects.length;
      j++
    ) {
      console.log(
        "assignedProjects: " +
          req.body.assignedDevelopers[i].assignedProjects[j]
      );
    }
    console.log("assignedDevelopers: " + req.body.assignedDevelopers[i]);
  }*/

  let promiseArr = [];
  var idArrAssDev = [];
  if (req.body.assignedDevelopers) {
    for (var i = 0; i < req.body.assignedDevelopers.length; i++) {
      idArrAssDev.push(req.body.assignedDevelopers[i]._id);
    }

    //console.log(idArrAssDev);

    for (var i = 0; i < req.body.assignedDevelopers.length; i++) {
      if (
        req.body.assignedDevelopers[i].assignedProjects.indexOf(req.body.id) ===
        -1
      ) {
        console.log("Project wird hinzugefügt");

        var prom = new Promise(function(resolve, reject) {
          User.findOneAndUpdate(
            { _id: req.body.assignedDevelopers[i]._id },
            {
              $push: userFields
            },
            {
              new: true
            }
          )
            .then(project => resolve())
            .catch(err => reject(err));
        });

        promiseArr.push(prom);
      } else {
        //console.log("entfernen prüfen");

        for (var j = 0; j < req.body.allDevelopers.length; j++) {
          if (
            req.body.allDevelopers[j].assignedProjects.indexOf(req.body.id) !==
              -1 &&
            idArrAssDev.indexOf(req.body.allDevelopers[j]._id) === -1
          ) {
            //console.log("Entfernen");

            var prom = new Promise(function(resolve, reject) {
              User.findOneAndUpdate(
                { _id: req.body.allDevelopers[j]._id },
                {
                  $pull: userFields
                },
                {
                  new: true
                }
              )
                .then(project => resolve())
                .catch(err => reject(err));
            });

            promiseArr.push(prom);
          } else {
            //console.log("Bleibt");
          }
        }
      }
    }
  }
  var prom = new Promise(function(resolve, reject) {
    Project.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: projectFields
      },
      {
        new: true
      }
    )
      .then(project => resolve())
      .catch(err => reject(err));
  });

  promiseArr.push(prom);

  //console.log(promiseArr);

  Promise.all(promiseArr)
    .then(project => res.json(project))
    .catch(err => res.status(404).json({ project: "There is no project" }));
});

router.post("/project/setComment", (req, res) => {
  const errors = {};

  const projectFields = {};

  //projectFields.comment = req.body.comment;

  console.log(req.body);

  //console.log(projectFields);
  //console.log(req.body.id);

  if (req.body.delete === false) {
    projectFields.comment = req.body.comment;

    Project.findOneAndUpdate(
      { _id: req.body.id },
      {
        $push: projectFields
      },
      {
        new: true
      }
    )
      .then(comment => res.json(comment.comment))
      .catch(err => console.log(err));
  } else {
    tempArr = [];
    commentsArray = req.body.comments;
    for (var i = 0; i < req.body.comments.length; i++) {
      tempArr.push(req.body.comments[i]._id);
    }

    console.log(tempArr);
    index = tempArr.indexOf(req.body.commentId);
    console.log(index);

    commentsArray.splice(index, 1);

    projectFields.comment = commentsArray;

    Project.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: projectFields
      },
      {
        new: true
      }
    )
      .then(comment => res.json(comment.comment))
      .catch(err => console.log(err));
  }
});

router.post("/project/setFinishedTactic", (req, res) => {
  const errors = {};

  const projectFields = {};

  projectFields.finishedTactics = req.body.finishedTactic;

  //console.log(req.body);
  //console.log(req.body.id);

  if (req.body.finishedTactics.indexOf(req.body.finishedTactic) === -1) {
    //console.log(req.body.finishedTactic + "hinzugefügt");
    Project.findOneAndUpdate(
      { _id: req.body.id },
      {
        $push: projectFields
      },
      {
        new: true
      }
    )
      .then(finishedTactics => res.json(finishedTactics))
      .catch(err => console.log(err));
  } else {
    //console.log(req.body.finishedTactic + "entfernt");
    Project.findOneAndUpdate(
      { _id: req.body.id },
      {
        $pull: projectFields
      },
      {
        new: true
      }
    )
      .then(finishedTactics => res.json(finishedTactics))
      .catch(err => console.log(err));
  }
});

// @route   POST api/projects/project/deleteAssignedProject
// @desc    Edit project by ID
// @access  Public

router.post("/project/deleteAssignedProject", (req, res) => {
  const errors = {};

  const userFields = {};

  if (req.body.assignedDevelopers) userFields.assignedProjects = req.body._id;

  console.log(req.body);

  let promiseArr = [];
  if (req.body.assignedDevelopers) {
    for (var i = 0; i < req.body.assignedDevelopers.length; i++) {
      var prom = new Promise(function(resolve, reject) {
        User.findOneAndUpdate(
          { _id: req.body.assignedDevelopers[i]._id },
          {
            $pull: userFields
          },
          {
            new: true
          }
        )
          .then(project => resolve())
          .catch(err => reject(err));
      });

      promiseArr.push(prom);
    }
  }

  //console.log(promiseArr);

  Promise.all(promiseArr)
    .then(project => res.json(project))
    .catch(err => res.status(404).json({ project: "There is no project" }));
});

// @route   POST api/projects/project/addAssignedProject
// @desc    Edit project by ID
// @access  Public

router.post("/project/addAssignedProject", (req, res) => {
  const errors = {};

  const userFields = {};

  if (req.body.assignedDevelopers) userFields.assignedProjects = req.body._id;

  console.log(req.body);

  let promiseArr = [];
  if (req.body.assignedDevelopers) {
    for (var i = 0; i < req.body.assignedDevelopers.length; i++) {
      var prom = new Promise(function(resolve, reject) {
        User.findOneAndUpdate(
          { _id: req.body.assignedDevelopers[i]._id },
          {
            $push: userFields
          },
          {
            new: true
          }
        )
          .then(project => resolve())
          .catch(err => reject(err));
      });

      promiseArr.push(prom);
    }
  }

  //console.log(promiseArr);

  Promise.all(promiseArr)
    .then(project => res.json(project))
    .catch(err => res.status(404).json({ project: "There is no project" }));
});

module.exports = router;
