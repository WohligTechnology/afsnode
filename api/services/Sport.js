/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var objectid = require("mongodb").ObjectId;

var schema = new Schema({
    gender: String,
    year: String,
    minPlayers: Number,
    maxPlayers:Number,
    sportslist: {
        type: {
            _id: {
              type:Schema.Types.ObjectId,
              ref:'SportsList'
            },
            name: String,
            sporttype: String
        }
    },
    agegroup: {
        type: {
            _id: Schema.Types.ObjectId,
            name: String
        }
    },
    firstcategory: {
        type: {
            _id: Schema.Types.ObjectId,
            name: String
        }
    },
    secondcategory: {
        type: {
            _id: Schema.Types.ObjectId,
            name: String
        }
    },
    thirdcategory: {
        type: {
            _id: Schema.Types.ObjectId,
            name: String
        }
    },
    drawFormat: String
});
module.exports = sails.mongoose.model('Sport', schema);
var models = {
    saveData: function(data, callback) {
        var sport = this(data);
        if (data._id) {
            this.findOneAndUpdate({
                _id: data._id
            }, data, function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        } else {
            sport.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }
    },
    saveDataObjectId: function(data, callback) {
        var sport = this(data);
        if (data._id) {
          if(data.sportslist){
            data.sportslist._id = objectid(data.sportslist._id);
          }
          if(data.agegroup){
            data.agegroup._id = objectid(data.agegroup._id);
          }
          if(data.firstcategory){
            data.firstcategory._id = objectid(data.firstcategory._id);
          }
          if(data.secondcategory){
            data.secondcategory._id = objectid(data.secondcategory._id);
          }
          if(data.thirdcategory){
            data.thirdcategory._id = objectid(data.thirdcategory._id);
          }
            this.update({
                _id: data._id
            }, sport,{}, function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                  console.log(data2);
                    callback(null, data2);
                }
            });
        } else {
            sport.save(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data2);
                }
            });
        }
    },
    getAll: function(data, callback) {
        Sport.find().sort({
            _id: -1
        }).lean().exec(function(err, found) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        });
    },
    deleteData: function(data, callback) {
        Sport.findOneAndRemove({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    getOne: function(data, callback) {
        Sport.findOne({
            _id: data._id
        }).lean().exec(function(err, found) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        });
    },
    findLimited: function(data, callback) {
      var newreturns = {};
      newreturns.data = [];
      data.pagenumber = parseInt(data.pagenumber);
      var checkObj = {};

      var check = new RegExp(data.name, "i");
      checkObj = {
        'sportslist.name': {
          '$regex': check
        }
      };

      async.parallel([
          function(callback) {
            Sport.count(checkObj).exec(function(err, number) {
              if (err) {
                console.log(err);
                callback(err, null);
              } else if (number && number !== "") {
                newreturns.total = number;
                newreturns.totalpages = Math.ceil(number / 20);
                callback(null, newreturns);
              } else {
                callback(null, newreturns);
              }
            });
          },
          function(callback) {
            Sport.find(checkObj).sort({
              _id: -1
            }).skip(20 * (data.pagenumber - 1)).limit(20).exec(function(err, data2) {
              if (err) {
                console.log(err);
                callback(err, null);
              } else if (data2 && data2.length > 0) {
                newreturns.data = data2;
                callback(null, newreturns);
              } else {
                callback(null, newreturns);
              }
            });
          }
        ],
        function(err, data4) {
          if (err) {
            console.log(err);
            callback(err, null);
          } else if (data4) {
            callback(null, newreturns);
          } else {
            callback(null, newreturns);
          }
        });
    },
    getSportforTeam: function(data, callback) {
        Sport.findOne({
            name: data._id
        }).lean().exec(function(err, found) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        });
    },
    filterCategory: function(data, callback) {
        var matchObj = {
            "sportslist._id": objectid(data.sportList)
        };
        console.log(matchObj);
        Sport.aggregate([{
            $match: matchObj
        }, {
            $group: {
                _id: null,
                firstcategory: {
                    $addToSet: {
                      _id:'$firstcategory._id',
                    name:'$firstcategory.name'
                    }
                }
            }
        }]).exec(function(err, data2) {
          console.log(data2);
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (data2 && data2.length > 0) {
                callback(null, data2);
            } else {
                callback({}, null);
            }
        });
    },
    filterCategoryForFrontend: function(data, callback) {
        var matchObj = {
            "sportslist._id": objectid(data.sportList)
        };
        console.log(matchObj);
        Sport.aggregate([{
            $match: matchObj
        },
        {
            $group: {
                _id: null,
                firstcategory: {
                    $addToSet: {

                      _id:'$firstcategory._id',
                    name:'$firstcategory.name'
                    }
                }
            }
        },{
          $project:{
            "firstcategory": { "$setDifference": [ "$firstcategory", [{}] ]
          }
        }
      }]).exec(function(err, data2) {
        console.log("darta1",data2);
          console.log(data2);
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
               if(data2[0].firstcategory.length > 0){
                 callback(null, data2[0].firstcategory);

               }else{
                 callback([],null);
//
               }

            }
        });
    },
    getSports: function(data, callback) {
        var matchobj = {
            "sportslist._id": objectid(data.sportslist),
            gender: data.gender,
            "agegroup.name": data.agegroup,
            "firstcategory.name": data.firstcategory,
            "secondcategory.name": data.secondcategory,
            "thirdcategory.name": data.thirdcategory,
        };
        if (!data.sportslist) {
            delete matchobj["sportslist._id"];
        }
        if (!data.gender) {
            delete matchobj.gender;
        }
        if (!data.agegroup) {
            delete matchobj["agegroup.name"];
        }
        if (!data.firstcategory) {
            delete matchobj["firstcategory.name"];
        }
        if (!data.secondcategory) {
            delete matchobj["secondcategory.name"];
        }
        if (!data.thirdcategory) {
            delete matchobj["thirdcategory.name"];
        }
        console.log(matchobj);
        Sport.find(matchobj).exec(function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (data2 && data2.length > 0) {
                callback(null, data2);
            } else {
                callback([], null);
            }
        });
    },
    knockoutSports: function(data, callback) {
        Sport.find({
            "sportslist._id": data.sportlist,
            drawFormat:"Knockout"
        }).exec(function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (data2 && data2.length > 0) {
                callback(null, data2);
            } else {
                callback([], null);
            }
        });
    },
    getSportBySportlist: function(data, callback) {
      console.log({
          "sportslist._id": data.sportlist
      });
        Sport.find({
            "sportslist._id": data.sportlist
        }).exec(function(err, data2) {
          console.log(err);
          console.log(data2);
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (data2 && data2.length > 0) {
                callback(null, data2);
            } else {
                callback([], null);
            }
        });
    },
    heatSports: function(data, callback) {
        Sport.find({
            "sportslist._id": data.sportlist,
            drawFormat:"Heats"
        }).exec(function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (data2 && data2.length > 0) {
                callback(null, data2);
            } else {
                callback([], null);
            }
        });
    },
    getSportsByYear: function(data, callback) {
        Sport.find({
            "year": data.year,
            drawFormat:"Knockout"
        }).exec(function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (data2 && data2.length > 0) {
                callback(null, data2);
            } else {
                callback([], null);
            }
        });
    },
    getSportsByYearHeat: function(data, callback) {
        Sport.find({
            "year": data.year,
            drawFormat:"Heats"
        }).exec(function(err, data2) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (data2 && data2.length > 0) {
                callback(null, data2);
            } else {
                callback([], null);
            }
        });
    },
    getMinMaxForTeam :function (data,callback) {
      var matchobj = {};
      if(data.category){
        matchobj = {
          "sportslist._id":data.sport,
          "firstcategory._id":data.category,
          "agegroup._id":data.agegroup,
          "gender":data.gender

        };
      }else{
        matchobj = {
          "sportslist._id":data.sport,
          "agegroup._id":data.agegroup,
          "gender":data.gender
        };
      }
      Sport.find(matchobj).exec(function (err,data2) {
        if(err){
          callback(err,null);
        }else if(data2){
          callback(null,data2);
        }else{
          callback(null,null);
        }
      });
    },
    findForDropSingle: function(data, callback) {
        var returns = [];
        var exit = 0;
        var exitup = 1;
        var check = new RegExp(data.search, "i");

        function callback2(exit, exitup, data) {
            if (exit == exitup) {
                callback(null, data);
            }
        }
        Student.find({
            name: {
                '$regex': check
            }
        }, {
            name: 1,
            _id: 1,
            sfaid: 1
        }).limit(10).exec(function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            }
            if (found && found.length > 0) {
                exit++;

                returns = returns.concat(found);
                callback2(exit, exitup, returns);
            } else {
                callback([], null);
            }
        });
    },
    findForDropCaptainTeam: function(data, callback) {
        var returns = [];
        var exit = 0;
        var exitup = 1;
        var check = new RegExp(data.search, "i");

        function callback2(exit, exitup, data) {
            if (exit == exitup) {
                callback(null, data);
            }
        }
        Student.find({
            name: {
                '$regex': check
            }
        }, {
            name: 1,
            _id: 1,
            sfaid: 1
        }).limit(10).exec(function(err, found) {
            if (err) {
                console.log(err);
                callback(err, null);
            }
            if (found && found.length > 0) {
                exit++;

                returns = returns.concat(found);
                callback2(exit, exitup, returns);
            } else {
                callback([], null);
            }
        });
    },
    updateAllSportRef : function (data,callback) {
      Sport.find({},{},{},function (err,data) {
        if(err){

        }else{
          console.log(data.length);
          async.each(data, function(j, callback1) {

              Sport.saveDataObjectId(j, function(err, updated) {
                if (err) {
                  console.log(err);
                  callback1(err, null);
                } else {
                  callback1(null, updated);
                }
              });
            
          }, function(err) {
            if (err) {
              console.log(err);
              callback(err, null);
            } else {
              callback(null, "Done");
            }
          });
        }
      });
    }
};
module.exports = _.assign(module.exports, models);
