var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = sails.mongoose.Schema;

var schema = new Schema({
  athleteSFAID: String,
  athleteName: String,
  athleteSchool: String,
  gender: String,
  year: String,
  ageCategory: String,
  sport: String,
  event1: String,
  event2: String,
  videoLink: String
});

schema.plugin(deepPopulate, {});

module.exports = sails.mongoose.model('AthleteVideo', schema);

var model = {
  saveData: function (data, callback) {
    var video = new AthleteVideo(data);
    video.save(function (err, data2) {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, data2);
      }
    });

  },
};
module.exports = _.assign(module.exports, exports, model);
