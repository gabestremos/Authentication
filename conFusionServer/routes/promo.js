const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const promoRoute = express.Router();

promoRoute.use(bodyParser.json());
promoRoute
  .route("/")
  .all((req, res, next) => {
    res.status(200).setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all the promos to you!<3");
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.end(
      'Will add the promo: "' +
        req.body.name +
        '" with details: "' +
        req.body.description +
        '".'
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.status(403).end("PUT operation not supported on /promo");
  })

  .delete(authenticate.verifyUser, (req, res) => {
    res.end("Deleting all the promo");
  });
promoRoute
  .route("/:promoId")
  .get((req, res) => {
    res.end(
      "Will send details of the promo: " + req.params.promoId + " to you! <3"
    );
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    res
      .status(403)
      .end("POST operation not supported on /promo/" + req.params.promoId);
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    res.write("Updating the promo: " + req.params.promoId + "\n");
    res.end(
      "Will update the promo: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })

  .delete(authenticate.verifyUser, (req, res) => {
    res.end("Deleting promo: " + req.params.promoId);
  });
module.exports = promoRoute;
