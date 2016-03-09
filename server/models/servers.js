var mongoose = require('mongoose');
// define schema
var ServersSchema = new mongoose.Schema({
  name: { type: String, unique: true},
  pass: { type: String, select: true },
  ip: [String]
});
// register schema
mongoose.model('Servers', ServersSchema);