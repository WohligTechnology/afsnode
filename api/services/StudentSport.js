/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  year: String,
  sportslist: {
    type: {
      _id: {
        type: Schema.Types.ObjectId
      },
      name: String,
      sporttype: String
    }
  },
  agegroup: {
    type: {
      _id: {
        type: Schema.Types.ObjectId
      },
      name: String
    }
  },
  firstcategory: {
    type: {
      _id: {
        type: Schema.Types.ObjectId
      },
      name: String
    }
  },
  secondcategory: {
    type: {
      _id: {
        type: Schema.Types.ObjectId
      },
      name: String
    }
  },
  thirdcategory: {
    type: {
      _id: {
        type: Schema.Types.ObjectId
      },
      name: String
    }
  },
  medals: Schema.Types.Mixed,
  school: {
    type: {
      _id: {
        type: Schema.Types.ObjectId
      },
      name: String
    }
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }
});
module.exports = sails.mongoose.model('StudentSport', schema);
var models = {
  saveData: function(data, callback) {
    var studentsport = this(data);
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
      studentsport.save(function(err, data2) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data2);
        }
      });
    }
  },
  getAll: function(data, callback) {
    StudentSport.find({}, {}, {}, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  deleteData: function(data, callback) {
    StudentSport.findOneAndRemove({
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
    StudentSport.findOne({
      _id: data._id
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  getStudentsbySport: function(data, callback) {
    //For Knockout
    // StudentSport.find({
    //     'sportslist._id': data.sport
    // },{
    //   _id:0,
    //   student:1
    // }, function(err, deleted) {
    //     if (err) {
    //         callback(err, null);
    //     } else {
    //         callback(null, deleted);
    //     }
    // }).populate("student");
    var studentconstraints = {};
    if(data.sfaid){
      studentconstraints ={
        $match :{
          'student.sfaid':data.sfaid
        }
      };
    }else{
      data.search = new RegExp(data.search, "i");
      studentconstraints = {
        $match :{
          'student.name':{
            '$regex':data.search
          }
        }
      };
    }

    StudentSport.aggregate([{
      $match: {
        'sportslist._id': data.sport,
        'year': data.year
      }
    }, {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student'
      }
    },{
      $unwind:'$student'
    },studentconstraints, {
      $project: {
        _id: 0,
        student: 1
      }
    }, {
      $limit: 10
    }]).exec(function(err, data2) {
      // console.log(data2);
      if (err) {
        console.log(err);
        callback(err, null);
      } else if (data2 && data2.length > 0) {
        // StudentSport.populate(data2,{
        //   path:"student"
        // },function (err,data) {
        //   if(err){
        //     callback(err, null);
        //   }else{
        //     data = _.map(data,function (key) {
        //       return key.student;
        //     });
        //     callback(null, data);
        //
        //   }
        // });
            data2 = _.map(data2,function (key) {
              return key.student;
            });
        callback(null, data2);
      } else {
        callback({}, null);
      }
    });
  },

  getSports: function(data, callback) {
    StudentSport.find({
      student: data.student
    }, function(err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  }
};
module.exports = _.assign(module.exports, models);
