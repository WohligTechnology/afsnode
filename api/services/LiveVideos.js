/**
 * Banner.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
  city: {
    type: String,
    default: ""
  },
  videoLink: {
    type: String
  },
  videoSrc: {
    type: String
  },
  thumbnail: {
    type: String
  },
  date: Date


});
module.exports = sails.mongoose.model('LiveVideos', schema);
var models = {
  saveData: function (data, callback) {
    var LiveVideos = this(data);

    if (data._id) {
      this.findOneAndUpdate({
        _id: data._id
      }, data, function (err, data2) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data2);
        }
      });
    } else {
      LiveVideos.save(function (err, data3) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data3);
        }
      });

    }
  },


  // getAll: function (data, callback) {
  //   LiveVideos.find({}, {}, {}, function (err, deleted) {
  //     if (err) {
  //       callback(err, null);
  //     } else {
  //       callback(null, deleted);
  //     }
  //   });
  // },
  getAll: function (data, callback) {
    LiveVideos.find({}).sort({
      date: -1
    }).exec(function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  deleteData: function (data, callback) {
    LiveVideos.findOneAndRemove({
      _id: data._id
    }, function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  getOne: function (data, callback) {
    LiveVideos.findOne({
      _id: data._id
    }, function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  findLimited: function (data, callback) {
    var newreturns = {};
    newreturns.data = [];
    data.pagenumber = parseInt(data.pagenumber);
    var checkObj = {};
    if (data.name) {
      var check = new RegExp(data.name, "i");
      checkObj = {
        name: {
          '$regex': check
        }
      };
    } else {
      checkObj = {};
    }
    async.parallel([
      function (callback) {
        LiveVideos.count(checkObj).exec(function (err, number) {
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
      function (callback) {
        LiveVideos.find(checkObj).sort({
          sfaid: -1
        }).skip(20 * (data.pagenumber - 1)).limit(20).exec(function (err, data2) {
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
      function (err, data4) {
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

};
module.exports = _.assign(module.exports, models);
