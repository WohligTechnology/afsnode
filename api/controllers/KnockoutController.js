/**
 * KnockoutController
 *
 * @description :: Server-side logic for managing Knockouts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  saveData: function(req, res) {
      if (req.body) {
          Knockout.saveData(req.body, function(err, respo) {
              if (err) {
                  res.json({
                      value: false,
                      data: err
                  });
              } else {
                  res.json({
                      value: true,
                      data: respo
                  });
              }
          });
      } else {
          res.json({
              value: false,
              data: "Invalid call"
          });
      }
  },
  getLastOrder: function(req, res) {
      if (req.body) {
          Knockout.getLastOrder(req.body, function(err, respo) {
              if (err) {
                console.log("in err");
                  res.json({
                      value: false,
                      data: err
                  });
              } else {
                  res.json({
                      value: true,
                      data: respo
                  });
              }
          });
      } else {
          res.json({
              value: false,
              data: "Invalid call"
          });
      }
  },
    getLimited: function(req, res) {
        if (req.body) {
            if (req.body.pagenumber) {
                Knockout.findLimited(req.body, res.callback);
            } else {
                res.json({
                    value: false,
                    data: "Invalid Params"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getAll: function(req, res) {
        if (req.body) {
            Knockout.getAll(req.body, function(err, respo) {
                if (err) {
                    res.json({
                        value: false,
                        data: err
                    });
                } else {
                    res.json({
                        value: true,
                        data: respo
                    });
                }
            });
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    deleteData: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id !== "") {
                Knockout.deleteData(req.body, function(err, respo) {
                    if (err) {
                        res.json({
                            value: false,
                            data: err
                        });
                    } else {
                        res.json({
                            value: true,
                            data: respo
                        });
                    }
                });
            } else {
                res.json({
                    value: false,
                    data: "Invalid Id"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    getOne: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id !== "") {
                Knockout.getOne(req.body, function(err, respo) {
                    if (err) {
                        res.json({
                            value: false,
                            data: err
                        });
                    } else {
                        res.json({
                            value: true,
                            data: respo
                        });
                    }
                });
            } else {
                res.json({
                    value: false,
                    data: "Invalid Id"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    }
};
