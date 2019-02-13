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
      //the ids will be matched to the related objects
      $lookup: {
        from: "users",
        localField: "assignedDevelopers",
        foreignField: "_id",
        as: "assignedDevelopers"
      }
    },
    {
      //the ids will be matched to the related objects
      $lookup: {
        from: "strategies",
        localField: "assignedTactics",
        foreignField: "assignedTactics._id",
        as: "assignedStrategiesWithAllTactics"
      }
    },
    {
      //the ids will be matched to the related objects
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
      // creating a new attribute with assigned strategy object where only the assigned tactics are included
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

    // project will be searched if already exists return an error
    // else create the project
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

// this function deletes the project from the database
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

// this is more or less the same like the getAllProjects get function
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

// here the projects will be edited
router.post("/project/edit", (req, res) => {
  const { errors, isValid } = validateProjectInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

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

  let promiseArr = [];
  var idArrAssDev = [];
  // create a temporary array only with the ids
  if (req.body.assignedDevelopers) {
    for (var i = 0; i < req.body.assignedDevelopers.length; i++) {
      idArrAssDev.push(req.body.assignedDevelopers[i]._id);
    }

    // for all assignedDevelopers it will be checked which developer has changed or not
    for (var i = 0; i < req.body.assignedDevelopers.length; i++) {
      // if developer is not assigned push it into the array in the database
      if (
        req.body.assignedDevelopers[i].assignedProjects.indexOf(req.body.id) ===
        -1
      ) {
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
        // if developer is not assigned pull it out the array in the database
        for (var j = 0; j < req.body.allDevelopers.length; j++) {
          if (
            req.body.allDevelopers[j].assignedProjects.indexOf(req.body.id) !==
              -1 &&
            idArrAssDev.indexOf(req.body.allDevelopers[j]._id) === -1
          ) {
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
          }
        }
      }
    }
  }
  var prom = new Promise(function(resolve, reject) {
    // the project will be updated
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

  // all promises which are pushed into the promiseArr array will be executed at the same time
  Promise.all(promiseArr)
    .then(project => res.json(project))
    .catch(err => res.status(404).json({ project: "There is no project" }));
});

// here the comments will be saved in the database as array
router.post("/project/setComment", (req, res) => {
  const projectFields = {};

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
    //here is the part where an comment will be deleted

    tempArr = [];
    // again a temporary array where the ids are saved
    commentsArray = req.body.comments;
    for (var i = 0; i < req.body.comments.length; i++) {
      tempArr.push(req.body.comments[i]._id);
    }

    index = tempArr.indexOf(req.body.commentId);

    // to be deleted comment will be removed from array
    commentsArray.splice(index, 1);

    projectFields.comment = commentsArray;

    // the project will be searched and the comments array will be updated
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

// here the finished tactics will be set in the database
router.post("/project/setFinishedTactic", (req, res) => {
  const projectFields = {};

  projectFields.finishedTactics = req.body.finishedTactic;

  if (req.body.finishedTactics.indexOf(req.body.finishedTactic) === -1) {
    // when the finished tactic are not in the finished tactics array push it into it
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
    // when the finished tactic are in the finished tactics array pull it out of it
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
// @desc    Removes assigned project from developer when projects are deleted
// @access  Public

router.post("/project/deleteAssignedProject", (req, res) => {
  const userFields = {};

  if (req.body.assignedDevelopers) userFields.assignedProjects = req.body._id;

  console.log(req.body);

  let promiseArr = [];
  if (req.body.assignedDevelopers) {
    for (var i = 0; i < req.body.assignedDevelopers.length; i++) {
      // all assigned developers will be found and the assigned project which are deleted will be removed
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

  // all promises will be executed at the same time
  Promise.all(promiseArr)
    .then(project => res.json(project))
    .catch(err => res.status(404).json({ project: "There is no project" }));
});

// @route   POST api/projects/project/addAssignedProject
// @desc    Edit project by ID
// @access  Public

// this will be add the created project into the assigned projects from all assined developers
router.post("/project/addAssignedProject", (req, res) => {
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

  Promise.all(promiseArr)
    .then(project => res.json(project))
    .catch(err => res.status(404).json({ project: "There is no project" }));
});

module.exports = router;
