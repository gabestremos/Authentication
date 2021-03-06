const express = require("express");
const dishRouter = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Dishes = require("../models/dishes");
const authenticate = require("../authenticate");
dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .get((req, res, next) => {
    Dishes.find({})
      .then(
        dishes => {
          res.status(200).setHeader("Content-Type", "application/json");
          res.json(dishes);
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.create(req.body)
      .then(
        dish => {
          console.log("Dish Created", dish);
          res.status(200).setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.status(403).end("PUT operation not supported on /dishes");
  })

  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.remove({})
      .then(
        resp => {
          res.status(200).setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });

    dishRouter
      .route("/:dishId")
      .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
          .then(
            dishes => {
              res.status(200).setHeader("Content-Type", "application/json");
              res.json(dishes);
            },
            err => {
              next(err);
            }
          )
          .catch(err => {
            next(err);
          });
      })

      .post(authenticate.verifyUser, (req, res, next) => {
        res
          .status(403)
          .end("POST operation not supported on /dishes/" + req.params.dishId);
      })

      .put(authenticate.verifyUser, (req, res, next) => {
        Dishes.findByIdAndUpdate(
          req.params.dishId,
          {
            $set: req.body
          },
          { new: true }
        )
          .then(
            dish => {
              res.status(200).setHeader("Content-Type", "application/json");
              res.json(dish);
            },
            err => {
              next(err);
            }
          )
          .catch(err => {
            next(err);
          });
      })

      .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
          .then(
            resp => {
              res.status(200).setHeader("Content-Type", "application/json");
              res.json(resp);
            },
            err => {
              next(err);
            }
          )
          .catch(err => {
            next(err);
          });
      });
  });

//----------------------------------------------------------------------

dishRouter
  .route("/:dishId/comments/")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if (dish != null) {
            res.status(200).setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else {
            err = new Error("Dish " + req.params.dishId + " not found!");
            err.status(404);
            return next(err);
          }
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if (dish != null) {
            dish.comments.push(req.body);
            dish.save().then(
              (dish => {
                res.status(200).setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              err => {
                next(err);
              })
            );
          } else {
            err = new Error("Dish " + req.params.dishId + " not found!");
            err.status(404);
            return next(err);
          }
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    res.status(403);
    res.status(403).end("PUT operation not supported on /dishes");
  })

  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if (dish != null) {
            for (let i = dish.comments.length - 1; i >= 0; i--) {
              dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save().then(
              (dish => {
                res.status(200).setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              err => {
                next(err);
              })
            );
          } else {
            err = new Error("Dish " + req.params.dishId + " not found!");
            err.status(404);
            return next(err);
          }
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  });

dishRouter
  .route("/:dishId/comments/:commentId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.status(200).setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found!");
            err.status(404);
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found!");
            err.status(404);
            return next(err);
          }
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.create(req.body)
      .then(
        dish => {
          console.log("Dish Created", dish);
          res.status(200).setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
              dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
              dish.comments.id(req.params.commentId).comment = req.body.comment;
            }

            dish.save().then(
              (dish => {
                res.status(200).setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              err => {
                next(err);
              })
            );
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found!");
            err.status(404);
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found!");
            err.status(404);
            return next(err);
          }
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  })

  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save().then(
              dish => {
                res
                  .statusCode(200)
                  .setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              err => next(err)
            );
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  });
module.exports = dishRouter;
