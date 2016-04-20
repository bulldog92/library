var express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  Servers = mongoose.model('Servers'),
  Sites = mongoose.model('Sites'),
  rootPath = path.normalize(__dirname + '/../'),
  router = express.Router();


  /*
   |-----------------------
   | GET /api/statistics/ip_counter
   |-----------------------
  */
  router.get('/ip_counter', function(req, res){
    Servers.find({}, function(err, servers){
      if(err){
        res.status(500).end();
      }
      if(servers){
        /*get all ips for servers*/
        var allIpArr = [];
        for (var i = 0; i < servers.length; i++) {
          for (var j = 0; j < servers[i].ip.length; j++) {
            allIpArr.push(servers[i].ip[j]);
          }
        }
        /*get all ips for servers end*/
        Sites.find({}, function(err, sites){

          if(err) {
            res.status(500).end();
            return;
          }
          if(sites) {

            var ipObject = {};

            for (var r = 0; r < allIpArr.length; r++) {
              ipObject[allIpArr[r]] = [];
            }

            for ( var k = 0; k < sites.length; k++) {
              var index = allIpArr.indexOf(sites[k].ip);
              ipObject[allIpArr[index]].push(sites[k].domain);
            }

            var arrayCount = [];

            for (key in ipObject) {
              var object = {};
              object['ip'] = key;
              object['count'] = ipObject[key].length;
              arrayCount.push(object);
            }

            var serversCopy = [];
            for (var w = 0; w < servers.length; w++) {
              serversCopy.push({
                name: servers[w].name,
                ip: servers[w].ip,
                ipCounter: []
              })
            }

            for (var s = 0; s < serversCopy.length; s++) {
              for (var y = 0; y < serversCopy[s].ip.length; y++) {
                for (var u = 0; u < arrayCount.length; u++) {
                  if(serversCopy[s].ip[y] == arrayCount[u].ip) {
                    serversCopy[s].ipCounter.push(arrayCount[u]);
                  }else{
                    continue;
                  }
                }
              }
            }
            return res.json(serversCopy);
          }

        })
      }
    })
  });



module.exports = router;