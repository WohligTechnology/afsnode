/**
 * SchoolController
 *
 * @description :: Server-side logic for managing Schools
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  saveData: function (req, res) {
    if (req.body) {
      School.saveData(req.body, function (err, respo) {
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
  getAll: function (req, res) {
    if (req.body) {
      School.getAll(req.body, function (err, respo) {
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
  getSchoolByYear: function (req, res) {
    if (req.body) {
      // if(req.body.year){
      School.getSchoolByYear(req.body, function (err, respo) {
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
      // }else{
      //   res.json({
      //       value: false,
      //       data: "Input inadequate"
      //   });
      // }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  getSchool: function (req, res) {
    if (req.body) {
      School.getSchool(req.body, function (err, respo) {
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
  getLimitedSchool: function (req, res) {
    if (req.body) {
      School.getLimitedSchool(req.body, function (err, respo) {
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
  getSchoolSport: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "") {
        School.getSchoolSport(req.body, function (err, respo) {
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
  hide: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        School.hide(req.body, function (err, respo) {
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
  deleteData: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "") {
        School.deleteData(req.body, function (err, respo) {
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
  getOne: function (req, res) {
    if (req.body) {
      //   if (req.body._id && req.body._id != "") {
      School.getOne(req.body, function (err, respo) {
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
    // } else {
    //   res.json({
    //     value: false,
    //     data: "Invalid call"
    //   });
    // }
  },

  getOnePopulated: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        School.getOnePopulated(req.body, function (err, respo) {
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
  editSchool: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "") {
        School.editSchool(req.body, function (err, respo) {
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
  // deleteAll: function(req, res) {
  //     if (req.body) {
  //         School.deleteAll(req.body, function(err, respo) {
  //             if (err) {
  //                 res.json({
  //                     value: false,
  //                     data: err
  //                 });
  //             } else {
  //                 res.json({
  //                     value: true,
  //                     data: respo
  //                 });
  //             }
  //         });
  //     } else {
  //         res.json({
  //             value: false,
  //             data: "Invalid call"
  //         });
  //     }
  // },
  getLimited: function (req, res) {
    if (req.body) {
      if (req.body.pagenumber) {
        School.findLimited(req.body, res.callback);
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
  contingentStrengthByYear: function (req, res) {
    if (req.body) {
      if (req.body.pagenumber) {
        School.contingentStrengthByYear(req.body, res.callback);
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
  schoolSearch: function (req, res) {
    if (req.body) {
      if (req.body.pagenumber) {
        School.schoolSearch(req.body, res.callback);
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
  getLastId: function (req, res) {
    if (req.body) {
      School.getLastId(req.body, function (err, respo) {
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
  getFirstList: function (req, res) {
    if (req.body) {
      School.getFirstList(req.body, function (err, respo) {
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
  getAllSchoolRank: function (req, res) {
    if (req.body) {
      School.getAllSchoolRank(req.body, function (err, respo) {
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
  getSchoolRank: function (req, res) {
    if (req.body) {
      School.getSchoolRank(req.body, function (err, respo) {
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
  searchSchool: function (req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagenumber) {
        School.searchSchool(req.body, function (err, respo) {
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
          data: "Invalid params"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  filterStud: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body.year) {
        School.filterStud(req.body, function (err, respo) {
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
          data: "Invalid params"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  excelDownload: function (req, res) {
    School.find({}, {}, {}, function (err, response) {
      if (err) {
        res.json({
          value: false,
          error: err
        });
      } else {
        var excelData = [];
        var row = {};
        _.each(response, function (key) {
          row = {};
          if (key.year) {
            row['YEAR'] = "";
            _.each(key.year, function (key) {
              row['YEAR'] = row['YEAR'] + key + ", ";
            });
          }
          row['SFAID'] = key.sfaid;
          row['NAME'] = key.name;
          row['BOARD'] = key.board;
          row['ADDRESS'] = key.address;
          row['LOCATION'] = key.location;
          row['EMAIL'] = key.email;
          row['CONTACT'] = key.contact;
          // _.each(key.sports,function (key) {
          //   if(key){
          //
          //   }
          // });
          if (key.sports) {
            newSports = sails._.chain(key.sports)
              .groupBy("year")
              .toPairs()
              .map(function (currentItem) {
                return _.zipObject(["year", "sports"], currentItem);
              })
              .value();
            var sports2016 = _.find(newSports, function (key) {
              return key.year == "2016";
            });
            if (sports2016 && sports2016.sports) {
              row['SPORTS 2016'] = "";
              _.each(sports2016.sports, function (key) {
                row['SPORTS 2016'] = row['SPORTS 2016'] + key.name + ", ";
              });
              row['SPORTS 2016 count'] = sports2016.sports.length;
            }
            var sports2015 = _.find(newSports, function (key) {
              return key.year == "2015";
            });
            if (sports2015 && sports2015.sports) {
              row['SPORTS 2015'] = "";
              _.each(sports2015.sports, function (key) {
                row['SPORTS 2015'] = row['SPORTS 2015'] + key.name + ", ";
              });
              row['SPORTS 2015 count'] = sports2015.sports.length;
            }
            // console.log(sports2016);
          }
          row['SFA REPRESENTATIVE'] = key.representative;
          row['NO. OF SPORTS'] = key.numberOfSports;
          row['PAYMENT TYPE'] = key.paymentType;
          row['PRINCIPAL'] = key.principal;
          // console.log(_.find(key.contingentLeader,function (key) {
          //   return key.year == 2015;
          // }));
          // if(){
          //   row['CONTINGENT LEADER 2016']= _.find(key.contingentLeader,function (key) {
          //     return key.year == 2016;
          //   }).student.name;
          // }
          // row['CONTINGENT LEADER 2016']= key.principal;
          row['SUPPORTER NAME'] = key.supporterName;

          excelData.push(row);

        });
        excelData = _.sortBy(excelData, function (key) {
          return key.SFAID;
        });
        Config.generateExcel("School", excelData, res);
      }
    });
  },
  excelDownloadAllSchool: function (req, res) {
    School.find({}, {}, {}, function (err, response) {
      if (err) {
        res.json({
          value: false,
          error: err
        });
      } else {
        // res.json({
        //   value:true,
        //   data:response
        // });
      }
    });
  }
};
