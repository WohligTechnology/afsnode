module.exports = {
  studentsport: function(req, res) {
    var sports = [];

    function saveSport(iterator) {
      sports[iterator].save(function(err, data) {
        if(err) {
          console.log(err);
        }
        if (data) {

          runThroughSport(++iterator);
        }
      });
    }
    function runThroughSport(iterator) {
      if(sports.length <= iterator){
        res.json({
          value:true,
          data:"Done"
        });
      }else{
        saveSport(iterator);
      }
    }
    StudentSport.find().exec(function(err, data) {
      if (err) {
        res.json(err);
      } else {
        sports = data;
        runThroughSport(0);
      }

    });
  },
  sport: function(req, res) {
    var sports = [];

    function saveSport(iterator) {
      sports[iterator].save(function(err, data) {
        if(err) {
          console.log(err);
        }
        if (data) {
          // console.log(iterator);

          runThroughSport(++iterator);
        }
      });
    }
    function runThroughSport(iterator) {
      if(sports.length <= iterator){
        res.json({
          value:true,
          data:"Done"
        });
      }else{
        saveSport(iterator);
      }
    }
    Sport.find().exec(function(err, data) {
      if (err) {
        res.json(err);
      } else {
        sports = data;
        runThroughSport(0);
      }

    });
  }
};
