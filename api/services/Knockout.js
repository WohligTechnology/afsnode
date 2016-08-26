/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year: String,
  matchid:Number,
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
    ref: "Sport",
    index: true
  },
  drawformat: {
    type: String,
    default: ""
  },
  event: {
    type: String,
    default: "Knockout"
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
    type: String,
    default: ""
  },
  endTime: {
    type: String,
    default: ""
  },
  totalTime: {
    type: String,
    default: ""
  },
  player1: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  player2: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  resultplayer1: {
    type: String,
      },
  resultteam1: {
    type: String,
      },
  resultplayer2: {
    type: String,
      },
  resultteam2: {
    type: String,
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
    function updateAndCallback(nextRound) {
      console.log(nextRound);
      Knockout.findOneAndUpdate({
        sport: nextRound.sport,
        gender: nextRound.gender,
        agegroup: nextRound.agegroup,
        event: nextRound.event,
        participantType: nextRound.participantType,
        roundno: nextRound.roundno,
        order: nextRound.order
      }, nextRound, {
        upsert: true,
        new: true
      }, function(err, data3) {
        if (err) {
          console.log("err");
          callback(err, null);
        } else {
          callback(null, data3);
        }
      });
    }
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
          } else if (data2.resultteam1 || data2.resultteam2 || data.resultplayer1 || data.resultplayer2) {
            var nomatch = false;
            var nextRound = data2.toObject();
            delete nextRound._id;
            delete nextRound.__v;
            delete nextRound.player1;
            delete nextRound.player2;
            delete nextRound.parent1;
            delete nextRound.parent2;
            delete nextRound.resultplayer1;
            delete nextRound.resultplayer2;
            delete nextRound.resultteam1;
            delete nextRound.resultteam2;
            var result = {};
            if ((data2['result' + data2.participantType + '1'] == "Won" || data2['result' + data2.participantType + '1'] == "Bye") && (data2['result' + data2.participantType + '2'] == "Loss" || data2['result' + data2.participantType + '2'] == "No Show")) {
              result['result' + data2.participantType] = data2[data2.participantType + '1'];
            } else if ((data2['result' + data2.participantType + '1'] == "Loss" || data2['result' + data2.participantType + '1'] == "No Show") && (data2['result' + data2.participantType + '2'] == "Won" || data2['result' + data2.participantType + '2'] == "Bye")) {
              console.log("Loss");
              result['result' + data2.participantType] = data2[data2.participantType + '2'];
            } else {
              nomatch = true;
            }
            // if (data2.order % 2 === 0) {
            //   nextRound[data2.participantType + '1'] = result['result' + data2.participantType];
            //   nextRound.parent1 = data2._id;
            // } else {
            //   nextRound[data2.participantType + '2'] = result['result' + data2.participantType];
            //   nextRound.parent2 = data2._id;
            // }
            // nextRound.order = parseInt(data2.order / 2);
            // nextRound.roundno = nextRound.roundno + 1;
            // console.log(nextRound);
            if(nomatch){
              if(data2.participantType == 'player'){
                Student.find({
                  name: "No Match "
                }).exec(function (err,response) {
                  if(err){
                    callback(err,null);
                  }else{
                    console.log(response);
                    result['result' + data2.participantType] = response[0]._id;
                    if (data2.order % 2 === 0) {
                      nextRound[data2.participantType + '1'] = result['result' + data2.participantType];
                      nextRound.parent1 = data2._id;
                    } else {
                      nextRound[data2.participantType + '2'] = result['result' + data2.participantType];
                      nextRound.parent2 = data2._id;
                    }
                    nextRound.order = parseInt(data2.order / 2);
                    nextRound.roundno = nextRound.roundno + 1;
                    updateAndCallback(nextRound);
                  }
                });
              }else{

              }
            }else{
              if (data2.order % 2 === 0) {
                nextRound[data2.participantType + '1'] = result['result' + data2.participantType];
                nextRound.parent1 = data2._id;
              } else {
                nextRound[data2.participantType + '2'] = result['result' + data2.participantType];
                nextRound.parent2 = data2._id;
              }
              nextRound.order = parseInt(data2.order / 2);
              nextRound.roundno = nextRound.roundno + 1;
              updateAndCallback(nextRound);
            }
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
      year: {
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
          Knockout.find(checkObj).sort().skip(20 * (data.pagenumber - 1)).limit(20).populate('player1', "name ").populate('player2',"name").populate('sport', "name").populate("agegroup", "name").exec(function(err, data2) {
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
  getLastOrder: function(data, callback) {
    Knockout.find({
      sport: data.sport,
      gender: data.gender,
      agegroup: data.agegroup,
      event: data.event,
      participantType: data.participantType,
      roundno: data.roundno
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
        console.log("isEmpty");
        callback("No such knockout", null);
      } else {
        callback(null, data2[0].order);
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
  getOneKnockoutTree: function(data, callback) {
    Knockout.findOne({
      _id: data._id
    }, function(err, response) {
      if (err) {
        callback(err, null);
      } else {
        var populatequery =[{
          path:'parent1',
          populate : [{
            path:'parent2',
            populate : [{
              path:'parent2'
            },{
              path :'parent1'
            }]
          },{
            path :'parent1',
            populate : [{
              path:'parent2'
            },{
              path :'parent1'
            }]
          }]
        },{
          path: 'parent2',
          populate : [{
            path:'parent2',
            populate : [{
              path:'parent2'
            },{
              path :'parent1'
            }]
          },{
            path :'parent1',
            populate : [{
              path:'parent2'
            },{
              path :'parent1'
            }]
          }]
        }];
        Knockout.populate(response,populatequery,function (err,data2) {
          if(err){
            callback(err, null);
          }else{

            callback(null, data2);

          }
        });
        // callback(null, response);
      }
    }).populate('player1', "name").populate('player2', "name").populate('resultplayer', "name");
  },
  getOne: function(data, callback) {
    Knockout.findOne({
      _id: data._id
    }, function(err, response) {
      if (err) {
        callback(err, null);
      } else {
            callback(null, response);
      }
    }).populate('player1').populate('player2').populate('sport').populate('agegroup').populate('team1').populate('team2');
  }
};
module.exports = _.assign(module.exports, models);
