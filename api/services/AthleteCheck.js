var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = sails.mongoose.Schema;

var schema = new Schema({
  name: String,
  athlete: [{
    type: Schema.Types.ObjectId,
    ref: 'Student',
    index: true
  }]
});

schema.plugin(deepPopulate, {});

module.exports = sails.mongoose.model('AthleteCheck', schema);
var model = {
  saveData: function (data, callback) {
    var video = new AthleteCheck(data);
    video.save(data, function (err, data2) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, data2);
      }
    });

  },

  updateCheck: function (data, callback) {
    var matchObj = {
      $push: {
        athlete: data.athlete
      }
    };
    this.update({
      name: data.name
    }, matchObj, function (err, data2) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data2);
      }
    });
  }

};
module.exports = _.assign(module.exports, exports, model);
