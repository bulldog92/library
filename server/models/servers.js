var mongoose = require('mongoose');
// define schema
var ServerUser = new mongoose.Schema({
	login: {type: String},
	pass: {type: String}
});
var ServersSchema = new mongoose.Schema({
  name: { type: String, unique: true},
  pass: { type: String, select: true },
  ip: [String],
  user: ServerUser,
  host: String,
  fileUrl: String
});
// register schema
mongoose.model('Servers', ServersSchema);