/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year: String,
  roundno: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  sport: {
    type: Schema.Types.ObjectId,
    ref: "SportsList",
    index: true
  },
  gender: String,
  agegroup: {
    type: Schema.Types.ObjectId,
    ref: "Agegroup",
    index: true
  },
  drawformat: {
    type: String,
    default: ""
  },
  event: {
    type: String,
    default: ""
  },
  participantType: {
    type: String,
    default: "player"
  },
  date: {
    type: Date,
    default: Date.now
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: Date.now
  },
  totalTime: {
    type: Date,
    default: Date.now
  },
  player1: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  player2: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  resultplayer: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  resultteam: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  team1: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  team2: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  score: {
    type: String,
    default: ""
  },
  video: {
    type: String,
    default: ""
  },
  parent1: {
    type: Schema.Types.ObjectId,
    ref: 'Knockout'
  },
  parent2: {
    type: Schema.Types.ObjectId,
    ref: 'Knockout'
  }
});
module.exports = sails.mongoose.model('Knockout', schema);
var models = {
  saveData: function(data, callback) {
    var knockout = this(data);
    if (data._id) {
      this.findOneAndUpdate({
        _id: data._id
      }, data, {
        new: true
      }, function(err, data2) {
        if (err) {
          console.log("err");
          callback(err, null);
        } else {
          console.log("data.result", data2.result);
          if (data2 === null) {
            callback(null, data2);
          } else if (data2.resultteam || data.resultplayer) {
            var nextRound =  data2.toObject();
            delete nextRound._id;
            delete nextRound.__v;
            delete nextRound.player1;
            delete nextRound.player2;
            delete nextRound.parent1;
            delete nextRound.parent2;
            delete nextRound.resultplayer;
            if (data2.order % 2 === 0) {
              nextRound[data2.participantType + '1'] = data2['result' + data2.participantType];
              nextRound.parent1 = data2._id;
            } else {
              nextRound[data2.participantType + '2'] = data2['result' + data2.participantType];
              nextRound.parent2 = data2._id;
            }
            nextRound.order = parseInt(data2.order / 2);
            nextRound.roundno = nextRound.roundno + 1;
            console.log(nextRound);
            Knockout.findOneAndUpdate({
              // sport:nextRound.sport,
              roundno:nextRound.roundno,
              order:nextRound.order
            }, nextRound, {
              upsert: true,
              new:true
            }, function(err, data3) {
              if (err) {
                console.log("err");
                callback(err, null);
              } else {
                callback(null, data3);
              }
            });
          } else {
            callback(null, data2);
          }
        }
      });
    } else {
      // if(!knockout.order){
      //   console.log("not has order");
      //   Knockout.getLastOrder(knockout.toObject(),function (response) {
      //     if(data.value){
      //
      //     }
      //   });
      // }
      knockout.save(function(err, data2) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data2);
        }
      });
    }
  },
  getAll: function(data, callback) {
    Knockout.find({}, {}, {}, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    }).populate("Student");
  },
  findLimited: function(data, callback) {
    var newreturns = {};
    newreturns.data = [];
    data.pagenumber = parseInt(data.pagenumber);
    var checkObj = {};

    var check = new RegExp(data.name, "i");
    checkObj = {
      name: {
        '$regex': check
      }
    };

    async.parallel([
        function(callback) {
          Knockout.count(checkObj).exec(function(err, number) {
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
          Knockout.find(checkObj).sort().skip(20 * (data.pagenumber - 1)).limit(20).populate('players', "_id name ").populate("school", "name").populate('sport', "name").populate("agegroup", "name").populate("category", "name").exec(function(err, data2) {
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
  getLastOrder: function (data,callback) {
    Knockout.find({
      sport:data.sport,
      gender:data.gender,
      agegroup:data.agegroup,
      event:data.event,
      participantType:data.participantType,
      roundno:data.roundno
    }, {
        _id: 0,
        order: 1
    }).sort({
        order: -1
    }).limit(1).lean().exec(function(err, data2) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else if (_.isEmpty(data2)) {
            callback(null, 1);
        } else {
            callback(null, data2[0].order );
        }
    });
  },
  deleteData: function(data, callback) {
    Knockout.findOneAndRemove({
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
    Knockout.findOne({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    }).populate('parent1').populate('parent2').populate('player1',"name").populate('player2',"name").populate('resultplayer',"name");
  }
};
module.exports = _.assign(module.exports, models);
