/**
 * StudentController
 *
 * @description :: Server-side logic for managing Students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  saveData: function (req, res) {
    if (req.body) {
      Student.saveData(req.body, function (err, respo) {
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
  getAll: function (req, res) {
    if (req.body) {
      Student.getAll(req.body, function (err, respo) {
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
  forFormSearch: function (req, res) {
    if (req.body) {
      Student.forFormSearch(req.body, function (err, respo) {
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
  findStudentBySfaId: function (req, res) {
    if (req.body) {
      Student.findStudentBySfaId(req.body, function (err, respo) {
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
  sendMessageToAll: function (req, res) {
    if (req.body) {
      if (req.body.sfaid) {
        Student.sendMessageToAll(req.body, function (err, respo) {
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
          data: "invalid request"
        });
      }
    } else {
      res.json({
        value: false,
        data: "invalid request"
      });
    }

  },
  countContingentStrength: function (req, res) {
    if (req.body) {
      Student.countContingentStrength(req.body, function (err, respo) {
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
  updateProfilePicture: function (req, res) {
    if (req.body) {
      if (req.body.sfaid && req.body.profilePic) {
        Student.updateProfilePicture(req.body, function (err, respo) {
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
          data: "Input Inadequate."
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  makeEmptyPayment: function (req, res) {
    // if (req.body) {
    Student.makeEmptyPayment(req.body, function (err, respo) {
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
    // } else {
    //     res.json({
    //         value: false,
    //         data: "Invalid call"
    //     });
    // }
  },
  getStud: function (req, res) {
    if (req.body) {
      Student.getStud(req.body, function (err, respo) {
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
  hide: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        Student.hide(req.body, function (err, respo) {
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
  deleteData: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id != "") {
        Student.deleteData(req.body, function (err, respo) {
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
      // if (req.body._id && req.body._id != "") {
      Student.getOne(req.body, function (err, respo) {
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
    // } else {
    //   res.json({
    //     value: false,
    //     data: "Invalid call"
    //   });
    // }
  },
  getOneStudentByName: function (req, res) {
    if (req.body) {
      if (req.body.name && req.body.name != "") {
        Student.getOneStudentByName(req.body, function (err, respo) {
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
  editStudent: function (req, res) {
    if (req.body) {
      if (req.body._id && req.body._id !== "") {
        Student.editStudent(req.body, function (err, respo) {
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


  generatePdf: function (req, res) {
    // if (req.body) {
    Student.getCertificate(req.body, res.callback, res);


    // } else {
    //     res.json({
    //         value: false,
    //         data: "Invalid Request"
    //     });
    // }
  },
  // deleteAll: function(req, res) {
  //     if (req.body) {
  //         Student.deleteAll(req.body, function(err, respo) {
  //             if (err) {
  //                 res.json({
  //                     value: false,
  //                     data: err
  //                 });
  //             } else {
  //                 res.json({
  //                     value: true,
  //                     data: respo
  //                 });
  //             }
  //         });
  //     } else {
  //         res.json({
  //             value: false,
  //             data: "Invalid call"
  //         });
  //     }
  // },
  getLimited: function (req, res) {
    if (req.body) {
      if (req.body.pagenumber) {
        Student.findLimited(req.body, res.callback);
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
  getLastId: function (req, res) {
    if (req.body) {
      Student.getLastId(req.body, function (err, respo) {
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
  countStudent: function (req, res) {
    if (req.body) {
      Student.countStudent(req.body, function (err, respo) {
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
  searchStudent: function (req, res) {
    if (req.body) {
      if (req.body.pagesize && req.body.pagenumber) {
        Student.searchStudent(req.body, function (err, respo) {
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
          data: "Invalid params"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  findStud: function (req, res) {
    if (req.body) {
      if (req.body.school && req.body.lastname && req.body.firstname) {
        Student.findStud(req.body, function (err, respo) {
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
          data: "Invalid params"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Invalid call"
      });
    }
  },
  findForDrop: function (req, res) {
    if (req.body) {
      if (req.body.student && Array.isArray(req.body.student)) {
        Student.findForDrop(req.body, function (err, respo) {
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
          data: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Please provide parameters"
      });
    }
  },
  findForDropBySchool: function (req, res) {
    if (req.body) {
      if (req.body.student && Array.isArray(req.body.student)) {
        Student.findForDropBySchool(req.body, function (err, respo) {
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
          data: "Please provide parameters"
        });
      }
    } else {
      res.json({
        value: false,
        data: "Please provide parameters"
      });
    }
  },
  findForDropSingle: function (req, res) {
    if (req.body) {
      Student.findForDropSingle(req.body, function (err, respo) {
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
        data: "Please provide parameters"
      });
    }
  },

  getDrawFormats: function (req, res) {
    res.connection.setTimeout(20000000000);
    req.connection.setTimeout(20000000000);
    Student.getDrawFormats(req, res.callback);
  }
};
