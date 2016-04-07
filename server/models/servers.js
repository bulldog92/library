var mongoose = require('mongoose');
// define schema
var ServersSchema = new mongoose.Schema({
  name: { type: String, unique: true},
  root_pass: { type: String, select: true },
  user_pass: { type: String, select: true },
  ip: [String],
  path_config: String
});
// register schema
mongoose.model('Servers', ServersSchema);