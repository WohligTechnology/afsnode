/**
 * QualifyingRound.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year: String,
  matchid: Number,
  sport: {
    type: Schema.Types.ObjectId,
    ref: "Sport",
    index: true
  },
  event: {
    type: String,
    default: "Qualifying Round"
  },
  order:Number,
  participantType: {
    type: String,
    default:"player"
  },
  player:{
    type:Schema.Types.ObjectId,
    ref:'Student'
  },
  score:{
    type:String
  },
  result:{
    type:String
  },
  video:{
    type:String,
    default:""
  },
  position:{
    type:Number,
    default:0
  },
  date:{
    type: Date
  },
  round:{
    type:String
  }
});
module.exports = sails.mongoose.model('QualifyingRound', schema);
var models = {
  saveData: function(data, callback) {
    var quals = {};
    function updatePlayersAndCallback() {
      var constraints = {};
      constraints.student = quals.player;
      constraints.year = quals.year;
      constraints.sport = quals.sport;
      constraints.drawFormat = "Qualifying Round";
      constraints.qualifyinground = quals._id;
      StudentStats.saveData(constraints, function(err, response) {
        console.log(err,response);
        if (err) {
          callback(err, null);
        } else {
              callback(null, response);
        }
      });
    }
    var qualifyinground = this(data);
    if (data._id) {
      this.findOneAndUpdate({
        _id: data._id
      }, data, function(err, data2) {
        if (err) {
          callback(err, null);
        } else {
          quals = data2;
          updatePlayersAndCallback();
        }
      });
    } else {
      QualifyingRound.getLastQualifyingRound({}, function(err, response) {
        if (err) {
          callback(null, err);
        } else {
          qualifyinground.matchid = parseInt(response) + 1;
          qualifyinground.save(function(err, data3) {
            if (err) {
              callback(err, null);
            } else {
              quals = data3;
              updatePlayersAndCallback();
            }
          });
        }
      });
    }
  },
  getAll: function(data, callback) {
    QualifyingRound.find().populate('player').exec(function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  deleteData: function(data, callback) {
    QualifyingRound.findOneAndRemove({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        StudentStats.remove({
          drawFormat:"Qualifying Round",
          qualifyinground:data._id
        }, function(err, deleted) {
          if (err) {
            callback(err, null);
          } else {
            callback(null,deleted);

          }
        });
      }
    });
  },
  getLastQualifyingRound: function(data, callback) {
    QualifyingRound.find({}, {
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
        // console.log(data2);
        callback(null, data2[0].matchid);
      }
    });
  },
  getOne: function(data, callback) {
    QualifyingRound.findOne({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    }).populate('player').populate('sport');
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
    QualifyingRound.find({
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
        if (data.qualifyinground.length !== 0) {
          var nedata;
          nedata = _.remove(found, function(n) {
            var flag = false;
            _.each(data.qualifyinground, function(n1) {
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
