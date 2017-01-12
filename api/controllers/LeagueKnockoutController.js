/**
 * LeagueKnockoutController
 *
 * @description :: Server-side logic for managing LeagueKnockouts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    saveData: function(req, res) {
        if (req.body) {
            LeagueKnockout.saveData(req.body, function(err, respo) {
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
            LeagueKnockout.getAll(req.body, function(err, respo) {
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
    getLastLeagueKnockout: function(req, res) {
        if (req.body) {
            LeagueKnockout.getLastLeagueKnockout(req.body, function(err, respo) {
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
    getLimited: function(req, res) {
      if (req.body) {
        if (req.body.pagenumber) {
          LeagueKnockout.findLimited(req.body, res.callback);
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
    deleteData: function(req, res) {
        if (req.body) {
            if (req.body._id && req.body._id !== "") {
                LeagueKnockout.deleteData(req.body, function(err, respo) {
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
                LeagueKnockout.getOne(req.body, function(err, respo) {
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
    findForDrop: function(req, res) {
        if (req.body) {
            if (req.body.firstcategory && Array.isArray(req.body.firstcategory)) {
                LeagueKnockout.findForDrop(req.body, function(err, respo) {
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
                    data: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: false,
                data: "Please provide parameters"
            });
        }
    },
    getSportRoundLeagueKnockout: function(req, res) {
      if (req.body) {
        if (req.body.sport) {
          LeagueKnockout.getSportRoundLeagueKnockout(req.body, function(err, respo) {
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
            data: "Input inadequate"
          });
        }
      } else {
        res.json({
          value: false,
          data: "Invalid call"
        });
      }
    },
};
