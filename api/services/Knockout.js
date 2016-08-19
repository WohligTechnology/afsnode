/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year:String,
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
      type:String,
      default: ""
    },
    event: {
      type:String,
      default: ""
    },
    participantType : {
      type: String,
      default:"student"
    },
    date : {
      type:Date,
      default: Date.now
    },
    round:{
      type:Number,
      default:0
    },
    startTime: {
      type: Date,
      default:Date.now
    },
    endTime : {
      type:Date,
      default:Date.now
    },
    totalTime: {
      type:Date,
      default:Date.now
    },
    player1:{
      type:Schema.Types.ObjectId,
      ref: 'Student'
    },
    player2:{
      type:Schema.Types.ObjectId,
      ref: 'Student'
    },
    result1:{
      type:Schema.Types.ObjectId,
      ref: 'Student'
    },
    result2:{
      type:Schema.Types.ObjectId,
      ref: 'Student'
    },
    team1: {
      type:Schema.Types.ObjectId,
      ref: 'Team'
    },
    team2: {
      type:Schema.Types.ObjectId,
      ref: 'Team'
    },
    score:{
      type:String,
      default:""
    },
    video:{
      type:String,
      default:""
    }
});
module.exports = sails.mongoose.model('Knockout', schema);
var models = {
    saveData: function(data, callback) {
      var school = this(data);
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
          knockout.timestamp = new Date();
          knockout.deleteStatus = false;
          Knockout.getLastId({}, function(err, data3) {
              if (err) {
                  console.log(err);
                  callback(err, null);
              } else {
                  school.sfaid = data3;
                  school.save(function(err, data2) {
                      if (err) {
                          console.log(err);
                          callback(err, null);
                      } else {
                          callback(null, data2);
                      }
                  });
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
        });
    },
    findLimited : function (data,callback) {
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
                  Knockout.find(checkObj).sort().skip(20 * (data.pagenumber - 1)).limit(20).populate('players',"_id name ").populate("school","name").populate('sport',"name").populate("agegroup","name").populate("category","name").exec(function(err, data2) {
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
        }).populate('players',"_id name sfaid").populate('captain',"_id name sfaid").populate("school","name sfaid").populate('sport',"name").populate("agegroup","name").populate("category","name");
    }
};
module.exports = _.assign(module.exports, models);
