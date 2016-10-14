module.exports = {
  sportlist: function(req,res) {
    StudentSport.find().exec(function(err,data) {
      if(err) {
        res.json(err);
      }
      else {
        console.log("Total Length "+ data.length);
        _.each(data,function(n,key) {
          n.save(function() {console.log(key+ " Done");});

        });
        res.json({done:"Done"});
      }

    });
  },
  sport: function(req,res) {
    Sport.find().exec(function(err,data) {
      if(err) {
        res.json(err);
      }
      else {
        console.log("Total Length "+ data.length);
        _.each(data,function(n,key) {
          n.save(function() {console.log(key+ " Done");});

        });
        res.json({done:"Done"});
      }

    });
  }
};
