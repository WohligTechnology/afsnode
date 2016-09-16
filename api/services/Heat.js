/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year: String,
  matchid: Number,
  order:Number,
  sport: {
    type: Schema.Types.ObjectId,
    ref: "Sport",
    index: true
  },
  event: {
    type: String,
    default: "Heats"
  },
  participantType: {
    type: String,
    default: "player"
  },
  round: {
    type: String,
    default: "Round"
  },
  heat:{
    type:String,
    default:"Heat 1"
  },
  video:{
    type:String
  },
  heats: [{
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Student'
    },team:{
      type:Schema.Types.ObjectId,
      ref:'Team'
    },date:{
      type:Date
    },
    laneno:{
      type:Number
    },
    result:{
      type:String
    },
    timing:{
      type:String
    },
    standing:{
      type:Number
    }
}]
});
module.exports = sails.mongoose.model('Heat', schema);
var models = {
  saveData: function(data, callback) {
    // function updateParticipantsAndCallback(details) {
    //   var constraints = {};
    //   if (details.participantType == "player") {
    //     constraints.student = details[details.participantType + "1"];
    //     constraints.year = details.year;
    //     constraints.sport = details.sport;
    //     constraints.drawFormat = "Heats";
    //     constraints.heat = details._id;
    //     StudentStats.saveData(constraints, function(err, response) {
    //       if (err) {
    //         callback(err, null);
    //       } else {
    //         constraints.student = details[details.participantType + "2"];
    //         StudentStats.saveData(constraints, function(err, resp) {
    //           if (err) {
    //             callback(err, null);
    //           } else {
    //             callback(null, resp);
    //           }
    //         });
    //       }
    //     });
    //   } else {
    //     Heat.populate(details, [{
    //       path: 'team1'
    //     }, {
    //       path: 'team2'
    //     }], function(err, response) {
    //       if (err) {
    //         callback(err, null);
    //       } else {
    //         updatePlayersAndCallback(response, 0, true);
    //       }
    //     });
    //   }
    // }
    var heat = this(data);
    if (data._id) {
      this.findOneAndUpdate({
        _id: data._id
      }, {
        $set:data
      }, {
        new:true
      },function(err, data2) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data2);
        }
      });
    } else {
      Heat.getLastHeat({}, function(err, response) {
        if (err) {
          callback(null, err);
        } else {
          heat.matchid = parseInt(response) + 1;
          heat.save(function(err, data2) {
            if (err) {
              callback(err, null);
            } else {
              callback(null,data2);
            }
          });
        }
      });

    }
  },
  getAll: function(data, callback) {
    Heat.find({
      sport: data.sport
    }, {}, {}, function(err, found) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, found);
      }
    });
  },
  getLastHeat: function(data, callback) {
    Heat.find({}, {
      _id: 0,
      matchid: 1
    }).sort({
      matchid: -1
    }).limit(1).lean().exec(function(err, data2) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (_.isEmpty(data2)) {
        callback(null, 0);
      } else {
        console.log(data2);
        callback(null, data2[0].matchid);
      }
    });
  },
  deleteData: function(data, callback) {
    Heat.findOneAndRemove({
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
    Heat.findOne({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  findForDrop: function(data, callback) {
    var returns = [];
    var exit = 0;
    var exitup = 1;
    var check = new RegExp(data.search, "i");

    function callback2(exit, exitup, data) {
      if (exit == exitup) {
        callback(null, data);
      }
    }
    Heat.find({
      name: {
        '$regex': check
      }
    }).limit(10).exec(function(err, found) {
      if (err) {
        console.log(err);
        callback(err, null);
      }
      if (found && found.length > 0) {
        exit++;
        if (data.heat.length !== 0) {
          var nedata;
          nedata = _.remove(found, function(n) {
            var flag = false;
            _.each(data.heat, function(n1) {
              if (n1.name == n.name) {
                flag = true;
              }
            });
            return flag;
          });
        }
        returns = returns.concat(found);
        callback2(exit, exitup, returns);
      } else {
        callback([], null);
      }
    });
  }
};
module.exports = _.assign(module.exports, models);
