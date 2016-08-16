/**
 * SportController
 *
 * @description :: Server-side logic for managing Sports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    saveData: function(req, res) {
        if (req.body) {
            Sport.saveData(req.body, function(err, respo) {
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
    getAll: function(req, res) {
        if (req.body) {
            Sport.getAll(req.body, function(err, respo) {
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
                Sport.deleteData(req.body, function(err, respo) {
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
            if (req.body._id && req.body._id != "") {
                Sport.getOne(req.body, function(err, respo) {
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
    getSportforTeam : function (req,res) {
      if (req.body) {
          Sport.getSportforTeam(req.body, function(err, respo) {
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
    getSports: function(req, res) {
        if (req.body) {
            Sport.getSports(req.body, function(err, respo) {
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
    getMinMaxForTeam: function(req, res) {
        if (req.body) {
            Sport.getMinMaxForTeam(req.body, function(err, respo) {
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
    filterCategory: function(req, res) {
        if (req.body) {
            // if (req.body._id && req.body.year) {
                Sport.filterCategory(req.body, function(err, respo) {
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
            // } else {
            //     res.json({
            //         value: false,
            //         data: "Invalid params"
            //     });
            // }
        } else {
            res.json({
                value: false,
                data: "Invalid call"
            });
        }
    },
    findForDropSingle: function(req, res) {
        if (req.body) {
            // if (req.body.student && Array.isArray(req.body.student)) {
                Sport.findForDropSingle(req.body, function(err, respo) {
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
            // } else {
            //     res.json({
            //         value: false,
            //         data: "Please provide parameters"
            //     });
            // }
        } else {
            res.json({
                value: false,
                data: "Please provide parameters"
            });
        }
    }
};
