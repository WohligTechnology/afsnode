/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year: String,
  sport: {
    type: Schema.Types.ObjectId,
    ref: 'Sport'
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  drawFormat: String,
  knockout: {
    type: Schema.Types.ObjectId,
    ref: 'Knockout'
  }
});
module.exports = sails.mongoose.model('StudentStats', schema);
var models = {
  saveData: function(data, callback) {
    var studentstats = this(data);
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
      // studentstats.save(function(err, data3) {
      //   if (err) {
      //     callback(err, null);
      //   } else {

          // callback(null, data3);
      //   }
      // });
      var isexistent = {};
      isexistent = {
        student:data.student,
        year:data.year,
        drawFormat:data.drawFormat
      };

      if(data.drawFormat == "Knockout"){
        isexistent.knockout=data.knockout;
      }
      StudentStats.findOneAndUpdate(isexistent,{
        $setOnInsert : data
      },{
        upsert:true,
        new : true
      },function (err,inserted) {
        if(err){
          callback(err,null);
        }else{
          console.log(inserted);
          StudentStats.populate(inserted, [{
            path: 'sport'
          }, {
            path: 'student',
            populate: {
              path: 'school'
            }
          }], function(err, response) {
            if (err) {
              callback(err, null);
            } else {
              var constraints = {
                year: response.year,
                "sportslist._id": response.sport.sportslist._id,
                "student": response.student._id,
                "agegroup._id": response.sport.agegroup._id
              };
              if (response.sport.firstcategory && response.sport.firstcategory._id) {
                constraints["firstcategory._id"] = response.sport.firstcategory._id;
              }
              StudentSport.findOneAndUpdate(constraints, {
                $setOnInsert: {
                  student: response.student._id,
                  year: response.year,
                  sportslist: response.sport.sportslist,
                  agegroup: response.sport.agegroup,
                  firstcategory: response.sport.firstcategory,
                  secondcategory: response.sport.secondcategory,
                  "school._id": response.student.school._id,
                  "school.name": response.student.school.name
                }
              }, {
                upsert: true,
                new: true
              }, function(err, data2) {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, data2);
                }
              });
            }
          });
        }
      });
    }
  },
  getAll: function(data, callback) {
    StudentStats.find({}, {}, {}, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    }).populate('student','name').populate('sport').populate('knockout').populate('team');
  },
  // getLimited:function (data,callback) {
  //
  // },
  deleteData: function(data, callback) {
    StudentStats.findOneAndRemove({
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
    StudentStats.findOne({
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
    StudentStats.find({
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
        if (data.studentstats.length != 0) {
          var nedata;
          nedata = _.remove(found, function(n) {
            var flag = false;
            _.each(data.studentstats, function(n1) {
              if (n1.name == n.name) {
                flag = true;
              }
            })
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
