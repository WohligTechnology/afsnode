module.exports = {
  saveData: function (req, res) {
    if (req.body) {
      req.body.date = new Date();
      LiveAlbum.saveData(req.body, function (err, respo) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          res.json({
            value: true,
            data: respo
          });
        }
      });
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  getAllAlbums: function (req, res) {
    if (req.body) {
      LiveAlbum.getAllAlbums(req.body, function (err, respo) {
        if (err) {
          res.json({
            value: false,
            data: err
          });
        } else {
          res.json({
            value: true,
            data: respo
          });
        }
      });
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  deleteData: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "") {
        LiveAlbum.deleteData(req.body, function (err, respo) {
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            res.json({
              value: true,
              data: respo
            });
          }
        });
      } else {
        res.json({
          value: false,
          data: "Invalid Id"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  getOne: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "") {
        LiveAlbum.getOne(req.body, function (err, respo) {
          if (err) {
            res.json({
              value: false,
              data: err
            });
          } else {
            res.json({
              value: true,
              data: respo
            });
          }
        });
      } else {
        res.json({
          value: false,
          data: "Invalid Id"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },

  getLimited: function (req, res) {
    if (req.body) {
      if (req.body.pagenumber) {
        LiveAlbum.findLimited(req.body, res.callback);
      } else {
        res.json({
          value: false,
          data: "Invalid Params"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid Request"
      });
    }
  },
};
