var express = require('express'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
  Servers = mongoose.model('Servers'),
  Sites = mongoose.model('Sites'),
	rootPath = path.normalize(__dirname + '/../'),
	router = express.Router();

var utils = require('../utils');
var mailer = require('../mailer');
var date = require('../models/date');
var validator = require('validator');

/*
 |------------------------------------------------------------------------------------------------------------------------------------------------------------
 | API SITES start
 |------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
/*
 |-----------------------
 | GET /api/sites
 |-----------------------
*/
router.get('/', function(req, res){
  if(req.query.filter){
    var replaceStr = req.query.filter.replace( /[\\\)\(\[\]\\*\+\&]+/gmi, '');
    function genQuery(arr){
      var query = [];

      var regex = new RegExp(replaceStr,'gmi');
      if(!arr){
        query = [{domain: regex}, {ip: regex}, {server: regex}];
        return query;
      }
      if(Array.isArray(arr)){
        for (var i = 0; i < arr.length; i++){
          var obj = {};
          var propName = arr[i].toLowerCase();
          obj[propName] = regex;
          query.push(obj);
        }
        return query;
      }else{
        if(arr.toLowerCase() == 'date'){
          var startDate = new Date(parseInt(req.query.filter));
          startDate.setSeconds(0);
          startDate.setHours(0);
          startDate.setMinutes(0);
          var dateMidnight = new Date(startDate);
          dateMidnight.setSeconds(59);
          dateMidnight.setHours(23);
          dateMidnight.setMinutes(59);
          query = [{
              'date': {
                $gt:startDate,
                $lt:dateMidnight
              }
            }];
          return query;
        }else{
          var obj = {};
          var propName = arr.toLowerCase();
          obj[propName] = regex;
          query = [obj];
          return query;
        }
      }
    }
    var query = genQuery(req.query.selected);
    Sites.paginate({ $or:query}, {page: parseInt(req.query.page), limit: parseInt(req.query.limit)}, function(err, result){
      if(err){
        res.status(500).end();
      }
      if(result){
        res.status(200);
        res.send({count: result.total, sites: result.docs});
      }
    })
   }else{
   Sites.paginate({}, {page: parseInt(req.query.page), limit: parseInt(req.query.limit)}, function(err, result){
     if(err){
       res.status(500).end();
     }
     if(result){
       res.status(200);
       res.send({count: result.total, sites: result.docs});
     }
   }) 
  }
});
/*
 |-----------------------
 | PUT /api/sites
 |-----------------------
*/
router.put('/', function(req, res){
  if(req.body.domain != '' && req.body.description != ''){
    Sites.findOne({_id: req.body._id}, function(err, site){
      if(err){
        res.status(500).end();
      }
      if(site){
        site.description = req.body.description;
        site.save(function(err){
          if(err){
            res.status(500);
            return res.send({message: 'db save error'});
          }
          res.status(200);
          res.json({message: 'site updated'});
        });
      }
    })
  }else{
    res.status(422);
    res.send({message: 'Unprocessable Entity'});    
  }
});
/*
 |-----------------------
 | POST /api/sites
 |-----------------------
*/
router.post('/', function(req, res){
  if(req.body.domain != '' && req.body.ip != '' && req.body.server != '' && validator.isLength(req.body.domain, {min:6, max:25}) && validator.matches(req.body.ip, '^[0-9,/.]+$') && validator.isLength(req.body.server, {min:6, max:35}) ){
    Sites.findOne({domain: req.body.domain}, function(err, site){
      if(site){
        console.error('Site exists already!');
        res.status(409);
        return res.json({message:'Site exists already'});
      }
      var newSite = new Sites({
        domain: req.body.domain,
        ip: req.body.ip,
        date: date(),
        server: req.body.server
      });
      newSite.save(function(err){
        if(err){
          res.status(500);
          return res.send({message: 'db save error'});
        }
        res.status(200);
        return res.json({message: 'site created'});
      });
    })
  }else{
    res.status(422);
    res.send({message: 'Unprocessable Entity'});    
  }
});
/*
 |-----------------------
 | DELETE /api/sites
 |-----------------------
*/
router.delete('/:id', function(req, res){
  Sites.findOne({_id: req.params.id}, function(err, site){
    if(err){
     res.status(500);
     return res.send({message: 'db delete error'}); 
    }
    if(site){
      site.remove(function(err){
        if(err){
          return res.status(500);
        }
        res.status(200);
        return res.json({message: 'Site removed'});
      })
    }
  })
});
/*
 |------------------------------------------------------------------------------------------------------------------------------------------------------------
 | API SITES end
 |------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
module.exports = router;