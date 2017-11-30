var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
// var uniqueValidator = require('mongoose-unique-validator');
// var timestamps = require('mongoose-timestamp');
// var validators = require('mongoose-validators');
// var monguurl = require('monguurl');
// require('mongoose-middleware').initialize(mongoose);

// var Schema = mongoose.Schema;
var Schema = sails.mongoose.Schema;

var schema = new Schema({
  name: {
    type: String
  },
  city: String,
  institutionType: String,
  tournamentFormat: String,
  rulesAndRegulation: String,
  ageGroupContent: String,
  ageGroupTable: Schema.Types.Mixed,
  eligibilityContent: String,
  eligibilityTable: Schema.Types.Mixed,
  tournamentCommittee: String
});

schema.plugin(deepPopulate, {});
// schema.plugin(uniqueValidator);
// schema.plugin(timestamps);
module.exports = sails.mongoose.model('CityRule', schema);

// var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
  saveData: function (data, callback) {
    var CityRule = this(data);
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
      CityRule.save(function (err, data2) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data2);
        }
      });
    }
  },
  deleteData: function (data, callback) {
    CityRule.findOneAndRemove({
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
    CityRule.findOne({
      _id: data._id
    }).exec(function (err, deleted) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, deleted);
      }
    });
  },
  getOneRuleBySportsName: function (data, callback) {
    CityRule.findOne({
      name: data.sportName,
      city: data.city,
      institutionType: data.type,
    }).exec(function (err, rule) {
      console.log('rule by name data', rule);
      if (_.isEmpty(rule)) {
        console.log('rule by name empty data');
        callback(null, []);
      } else {
        console.log('rule by name with data');
        callback(null, rule);
      }
    });
  },
  getAllRules: function (data, callback) {
    var newreturns = {};
    var checkObj = {};
    newreturns.data = [];
    data.page = parseInt(data.page);
    console.log("..", data);
    if (data.city == "mumbai") {
      if (data.institutionType == "school") {
        var check = new RegExp(data.sportName, "i");
        if (data.sportName) {
          checkObj = {
            name: {
              '$regex': check
            },
            institutionType: data.institutionType,
            city: data.city
          };
        } else {
          checkObj = {
            institutionType: data.institutionType,
            city: data.city
          }
        }
        async.parallel([
            function (callback) {
              CityRule.count(checkObj).exec(function (err, number) {
                console.log('1st function', number);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (number && number !== "") {
                  newreturns.total = number;
                  newreturns.totalpages = Math.ceil(number / 10);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            },

            function (callback) {
              CityRule.find(checkObj).sort({
                createdAt: -1
              }).skip(10 * (data.page - 1)).limit(10).exec(function (err, data2) {
                console.log('2nd function', data2);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (data2 && data2.length > 0) {
                  console.log(data);
                  newreturns.data = data2;
                  console.log('inside', newreturns);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            }
          ],
          function (err, data4) {
            console.log('main', data4);
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (data4) {
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
      } else if (data.institutionType == "college") {
        var check = new RegExp(data.sportName, "i");
        if (data.sportName) {
          checkObj = {
            name: {
              '$regex': check
            },
            institutionType: data.institutionType,
            city: data.city
          };
        } else {
          checkObj = {
            institutionType: data.institutionType,
            city: data.city
          }
        }
        async.parallel([
            function (callback) {
              CityRule.count(checkObj).exec(function (err, number) {
                console.log('1st function', number);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (number && number !== "") {
                  newreturns.total = number;
                  newreturns.totalpages = Math.ceil(number / 10);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            },

            function (callback) {
              CityRule.find(checkObj).sort({
                createdAt: -1
              }).skip(10 * (data.page - 1)).limit(10).exec(function (err, data2) {
                console.log('2nd function', data2);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (data2 && data2.length > 0) {
                  console.log(data);
                  newreturns.data = data2;
                  console.log('inside', newreturns);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            }
          ],
          function (err, data4) {
            console.log('main', data4);
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (data4) {
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
      }
    } else if (data.city == "hyderabad") {
      if (data.institutionType == "school") {
        var check = new RegExp(data.sportName, "i");
        if (data.sportName) {
          checkObj = {
            name: {
              '$regex': check
            },
            institutionType: data.institutionType,
            city: data.city
          };
        } else {
          checkObj = {
            institutionType: data.institutionType,
            city: data.city
          }
        }
        async.parallel([
            function (callback) {
              CityRule.count(checkObj).exec(function (err, number) {
                console.log('1st function', number);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (number && number !== "") {
                  newreturns.total = number;
                  newreturns.totalpages = Math.ceil(number / 10);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            },

            function (callback) {
              CityRule.find(checkObj).sort({
                createdAt: -1
              }).skip(10 * (data.page - 1)).limit(10).exec(function (err, data2) {
                console.log('2nd function', data2);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (data2 && data2.length > 0) {
                  console.log(data);
                  newreturns.data = data2;
                  console.log('inside', newreturns);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            }
          ],
          function (err, data4) {
            console.log('main', data4);
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (data4) {
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
      } else if (data.institutionType == "college") {
        var check = new RegExp(data.sportName, "i");
        if (data.sportName) {
          checkObj = {
            name: {
              '$regex': check
            },
            institutionType: data.institutionType,
            city: data.city
          };
        } else {
          checkObj = {
            institutionType: data.institutionType,
            city: data.city
          }
        }
        async.parallel([
            function (callback) {
              CityRule.count(checkObj).exec(function (err, number) {
                console.log('1st function', number);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (number && number !== "") {
                  newreturns.total = number;
                  newreturns.totalpages = Math.ceil(number / 10);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            },

            function (callback) {
              CityRule.find(checkObj).sort({
                createdAt: -1
              }).skip(10 * (data.page - 1)).limit(10).exec(function (err, data2) {
                console.log('2nd function', data2);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (data2 && data2.length > 0) {
                  console.log(data);
                  newreturns.data = data2;
                  console.log('inside', newreturns);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            }
          ],
          function (err, data4) {
            console.log('main', data4);
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (data4) {
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
      }
    } else if (data.city == "ahmedabad") {
      if (data.institutionType == "school") {
        var check = new RegExp(data.sportName, "i");
        if (data.sportName) {
          checkObj = {
            name: {
              '$regex': check
            },
            institutionType: data.institutionType,
            city: data.city
          };
        } else {
          checkObj = {
            institutionType: data.institutionType,
            city: data.city
          }
        }
        async.parallel([
            function (callback) {
              CityRule.count(checkObj).exec(function (err, number) {
                console.log('1st function', number);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (number && number !== "") {
                  newreturns.total = number;
                  newreturns.totalpages = Math.ceil(number / 10);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            },

            function (callback) {
              CityRule.find(checkObj).sort({
                createdAt: -1
              }).skip(10 * (data.page - 1)).limit(10).exec(function (err, data2) {
                console.log('2nd function', data2);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (data2 && data2.length > 0) {
                  console.log(data);
                  newreturns.data = data2;
                  console.log('inside', newreturns);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            }
          ],
          function (err, data4) {
            console.log('main', data4);
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (data4) {
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
      } else if (data.institutionType == "college") {
        var check = new RegExp(data.sportName, "i");
        if (data.sportName) {
          checkObj = {
            name: {
              '$regex': check
            },
            institutionType: data.institutionType,
            city: data.city
          };
        } else {
          checkObj = {
            institutionType: data.institutionType,
            city: data.city
          }
        }
        async.parallel([
            function (callback) {
              CityRule.count(checkObj).exec(function (err, number) {
                console.log('1st function', number);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (number && number !== "") {
                  newreturns.total = number;
                  newreturns.totalpages = Math.ceil(number / 10);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            },

            function (callback) {
              CityRule.find(checkObj).sort({
                createdAt: -1
              }).skip(10 * (data.page - 1)).limit(10).exec(function (err, data2) {
                console.log('2nd function', data2);
                if (err) {
                  console.log(err);
                  callback(err, null);
                } else if (data2 && data2.length > 0) {
                  console.log(data);
                  newreturns.data = data2;
                  console.log('inside', newreturns);
                  callback(null, newreturns);
                } else {
                  callback(null, newreturns);
                }
              });
            }
          ],
          function (err, data4) {
            console.log('main', data4);
            if (err) {
              console.log(err);
              callback(err, null);
            } else if (data4) {
              callback(null, newreturns);
            } else {
              callback(null, newreturns);
            }
          });
      }
    }
  }
};
module.exports = _.assign(module.exports, exports, model);
