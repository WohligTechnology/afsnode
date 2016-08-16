/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
    gender: String,
    minPlayers: Number,
    maxPlayers:Number,
    sportslist: {
        type: {
            _id: Schema.Types.ObjectId,
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
            "sportslist._id": data.sportList
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
    getSports: function(data, callback) {
        var matchobj = {
            "sportslist._id": data.sportslist,
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
    }
};
module.exports = _.assign(module.exports, models);
