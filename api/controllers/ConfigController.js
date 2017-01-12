/**
 * ConfigController
 *
 * @description :: Server-side logic for managing Configs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    countStatic: function(req, res) {
        var respObj = {};
        async.parallel([
            function(callback) {
                School.count(function(err, respo) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        respObj.school = respo;
                        callback(null, respObj);
                    }
                });
            },
            function(callback) {
                Student.count(function(err, respo) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        respObj.student = respo;
                        callback(null, respObj);
                    }
                });
            },
        ], function(err, data2) {
            if (err) {
                console.log(err);
                res.json({
                    value: false,
                    data: err
                });
            } else {
                res.json({
                    value: true,
                    data: respObj
                });
            }
        });
    },
    backupDatabase: function (req, res) {
       var q = req.ip.search("127.0.0.1");
       if (q >= 0) {
           var jagz = _.map(mongoose.models, function (Model, key) {
               var name = Model.collection.collectionName;
               return {
                   key: key,
                   name: name,
               };
           });
           var isBackup = fs.existsSync("./backup");
           if (!isBackup) {
               fs.mkdirSync("./backup");
           }
           var mom = moment();
           var folderName = "./backup/" + mom.format("ddd-Do-MMM-YYYY-HH-mm-SSSSS");
           var retVal = [];
           fs.mkdirSync(folderName);
           async.eachSeries(jagz, function (obj, callback) {
               exec("mongoexport --db " + database + " --collection " + obj.name + " --out " + folderName + "/" + obj.name + ".json", function (data1, data2, data3) {
                   retVal.push(data3 + " VALUES OF " + obj.name + " MODEL NAME " + obj.key);
                   callback();
               });
           }, function () {
               res.json(retVal);
           });
       } else {
           res.callback("Access Denied for Database Backup");
       }
   },
    shortURL: function (req,res) {
      if(req.body){
        Config.shortURL(req.body,function (err,data) {
          if(err){
            res.json({
              value:false,
              data:err
            });
          }else{
            res.json({
              value : true,
              url:data
            });
          }
        });
      }else{
        res.json({
          value:false,
          data:"Input Inadequate"
        });
      }
    },
    sendMessage: function (req,res) {
      if(req.body){
        Config.sendMessage(req.body,function (err,data) {
          if(err){
            res.json({
              value:false,
              data:err
            });
          }else{
            res.json({
              value : true,
              data:data
            });
          }
        });
      }else{
        res.json({
          value:false,
          data:"Input Inadequate"
        });
      }
    },
    countForDashboard: function(req, res) {
        var respObj = {};
        if (req.body && req.body.year) {
            async.parallel([
                function(callback) {
                    StudentSport.aggregate([{
                        $match: {
                            year: req.body.year,
                            school: {
                                $exists: true
                            }
                        }
                    }, {
                        $group: {
                            _id: "$sportslist._id",
                            schoolid: {
                                $addToSet: "$school._id"
                            },
                            name: {
                                $addToSet: "$sportslist.name"
                            }
                        }
                    }, {
                        $unwind: "$name"
                    }, {
                        $project: {
                            _id: 0,
                            count: { $size: "$schoolid" },
                            name: 1
                        }
                    }]).exec(function(err, respo) {
                        // console.log(respo);
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (respo && respo.length > 0) {
                            respObj.schoolSport = respo;
                            callback(null, respObj);
                        } else {
                            respObj.schoolSport = [];
                            callback(null, respObj);
                        }
                    });
                },
                function(callback) {
                    StudentSport.aggregate([{
                        $match: {
                            year: req.body.year,
                            student: {
                                $exists: true
                            }
                        }
                    }, {
                        $group: {
                            _id: "$sportslist._id",
                            student: {
                                $addToSet: "$student"
                            },
                            name: {
                                $addToSet: "$sportslist.name"
                            }
                        }
                    }, {
                        $unwind: "$name"
                    }, {
                        $project: {
                            _id: 0,
                            count: { $size: "$student" },
                            name: 1
                        }
                    }]).exec(function(err, respo) {
                        // console.log(respo);
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else if (respo && respo.length > 0) {
                            respObj.studentSport = respo;
                            callback(null, respObj);
                        } else {
                            respObj.studentSport = [];
                            callback(null, respObj);
                        }
                    });
                }
            ], function(err, data2) {
                if (err) {
                    console.log(err);
                    res.json({
                        value: false,
                        data: err
                    });
                } else {
                    res.json({
                        value: true,
                        data: respObj
                    });
                }
            });
        } else {
            res.json({
                value: false,
                data: "Please provide params"
            });
        }
    }
};
