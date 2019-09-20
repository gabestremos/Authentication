const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter
  .route("/")
  .all((req, res, next) => {
    res.status(200).setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all the leaders to you!<3");
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.end(
      'Will add the leader: "' +
        req.body.name +
        '" with details: "' +
        req.body.description +
        '".'
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.status(403).end("PUT operation not supported on /leader");
  })

  .delete(authenticate.verifyUser, (req, res) => {
    res.end("Deleting all the leader");
  });
leaderRouter
  .route("/:leaderId")
  .get((req, res) => {
    res.end(
      "Will send details of the leader: " + req.params.leaderId + " to you! <3"
    );
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    res
      .status(403)
      .end("POST operation not supported on /leader/" + req.params.leaderId);
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    res.write("Updating the leader: " + req.params.leaderId + "\n");
    res.end(
      "Will update the leader: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })

  .delete(authenticate.verifyUser, (req, res) => {
    res.end("Deleting leader: " + req.params.leaderId);
  });
module.exports = leaderRouter;
