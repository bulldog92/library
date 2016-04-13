var express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  Servers = mongoose.model('Servers'),
  rootPath = path.normalize(__dirname + '/../'),
  router = express.Router();

var validator = require('validator');


/*
 |------------------------------------------------------------------------------------------------------------------------------------------------------------
 | API SERVERS start
 |------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
/*
 |-----------------------
 | GET /api/servers
 |-----------------------
*/
router.get('/', function(req, res){
  Servers.find({}, function(err, result){
    if(err){
      res.status(500).end();
    }
    if(result){
      res.status(200);
      res.json(result);
    }
  })
});
/* GET Server*/
router.get('/:name', function(req, res){
  Servers.find({name: req.params.name}, function(err, result){
    if(err){
      res.status(500).end();
    }
    if(result){
      res.status(200);
      res.json(result);
    }
  })
});
/*
 |-----------------------
 | PUT /api/servers
 |-----------------------
*/
router.put('/', function(req, res){
  if(req.body.name != '' && req.body.ip != '' && validator.isLength(req.body.name, {min:4, max:25}) ){
    Servers.findOne({_id: req.body._id}, function(err, server){
      if(err){
        return res.status(500).end();
      }
      if(server){
        server.ip = req.body.ip;
        server.root_pass = req.body.root_pass;
        server.user_pass = req.body.user_pass;
        server.path_config = req.body.path_config;
        server.isp_link = req.body.isp_link;
        server.phpMyAdmin_link = req.body.phpMyAdmin_link;

        server.save(function(err){
          if(err){
            res.status(500);
            return res.send({message: 'db save error'});
          }
          res.status(200);
          res.json({message: 'server updated'});
        });
      }
    })
  }else{
    res.status(422);
    return res.send({message: 'Unprocessable Entity'});    
  }
});
/*
 |-----------------------
 | POST /api/servers
 |-----------------------
*/
router.post('/', function(req, res){
  if(req.body.name != '' && req.body.ip != '' && req.body.root_pass != '' && req.body.user_pass != '' && req.body.path_config != '' && validator.isLength(req.body.name, {min:4, max:25}) && validator.isLength(req.body.root_pass, {min:6, max:35}) ){
    Servers.findOne({$or: [{name: req.body.name}, {ip: {$in: req.body.ip}}]}, function(err, server){
      if(server){
        console.error('Server exists already!');
        res.status(409);
        return res.json({message:'Server exists already'});
      }
      var newServer = new Servers({
        name: req.body.name,
        ip: req.body.ip,
        root_pass: req.body.root_pass,
        user_pass: req.body.user_pass,
        path_config: req.body.path_config,
        isp_link: req.body.isp_link,
        phpMyAdmin_link: req.body.phpMyAdmin_link
      });
      newServer.save(function(err){
        if(err){
          res.status(500);
          return res.send({message: 'db save error'});
        }
        res.status(200);
        return res.json({message: 'server created'});
      });
    })
  }else{
    res.status(422);
    return res.json({message: 'Unprocessable Entity'});    
  }
});
/*
 |-----------------------
 | DELETE /api/servers
 |-----------------------
*/
router.delete('/:id', function(req, res){
  Servers.findOne({_id: req.params.id}, function(err, server){
    if(err){
     res.status(500);
     return res.send({message: 'db delete error'}); 
    }
    if(server){
      server.remove(function(err){
        if(err){
          return res.status(500);
        }
        res.status(200);
        return res.json({message: 'Server removed'});
      })
    }
  })
});
/*
 |------------------------------------------------------------------------------------------------------------------------------------------------------------
 | API SERVERS end
 |------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
module.exports = router;