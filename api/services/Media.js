/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Schema = sails.mongoose.Schema;
var schema = new Schema({
    year:String,
    folder: String,
    order: {
      type:Number
    },
    imageorder:{
      type:Number
    },
    date:{
      type:Date
    },
    mediatitle:{
      type:String,
      default:""
    },
    mediatype:{
      type:String,
      default:""
    },
    medialink:{
      type:String,
      default:""
    }
});
module.exports = sails.mongoose.model('Media', schema);
var models = {
    saveData: function(data, callback) {
        var media = this(data);
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
            Media.find({
                "folder": data.name
            }).exec(function(err, data2) {
                if (err) {
                    callback(err, null);
                } else if (data2 && data2[0]) {
                    callback(null, data2);
                } else {
                    media.save(function(err, data3) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data3);
                        }
                    });
                }
            });
        }
    },
    getAll: function(data, callback) {
        Media.find({}, {}, {}, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    deleteData: function(data, callback) {
        Media.findOneAndRemove({
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
        Media.findOne({
            _id: data._id
        }, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
    getFolders : function (data,callback) {
      Media.aggregate([{
        $match:{
          "mediatype":data.mediatype
        }
      },  {
        $group:{
          _id:"$folder",
          media:{
            $addToSet:"$medialink"
          }
        }
      },{
        $project:{
          _id:1,
          media: { "$slice": ["$media", 0,1] }
        }
      },{
        $unwind:"$media"
      }
    ]).exec(function (err,data) {
        if(err){
          callback(err,null);
        }else{
          callback(null,data);
        }
      });
    },
    getLimitedMedia: function(data, callback) {
      var newreturns = {};
      newreturns.data = [];
      var constraints = {};
      // var check = new RegExp(data.search, "i");
      // var checkid = new RegExp(parseInt(data.search));
      data.pagenumber = parseInt(data.pagenumber);
        var check = new RegExp(data.folder, "i");
        constraints = {
          'folder': {
            '$regex': check
          },
          "year":data.year,
          "mediatype":data.mediatype
        };
        // console.log(constraints);
      async.parallel([
        function(callback) {
          Media.count(constraints).exec(function(err, number) {
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (number && number !== "") {
              // console.log(number);
              newreturns.total = number;
              newreturns.totalpages = Math.ceil(number / 12);
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
        },
        function(callback) {
          Media.find(constraints).sort({
            imageorder: 1
          }).skip(12 * (data.pagenumber - 1)).limit(12).exec(function(err, data2) {
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
      ], function(err, data4) {
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
    findLimited: function(data, callback) {
      var newreturns = {};
      newreturns.data = [];
      data.pagenumber = parseInt(data.pagenumber);
      var checkObj = {};

      var check = new RegExp(data.name, "i");
      checkObj = {
        folder: {
          '$regex': check
        }
      };

      async.parallel([
          function(callback) {
            Media.count(checkObj).exec(function(err, number) {
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
            Media.find(checkObj).sort({}).skip(20 * (data.pagenumber - 1)).limit(20).exec(function(err, data2) {
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
        Media.find({
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
                if (data.media.length !== 0) {
                    var nedata;
                    nedata = _.remove(found, function(n) {
                        var flag = false;
                        _.each(data.media, function(n1) {
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
    },
    deleteAll: function(data, callback) {
        Media.remove({}, function(err, deleted) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, deleted);
            }
        });
    },
};
module.exports = _.assign(module.exports, models);
