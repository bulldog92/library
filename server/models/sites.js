var mongoose = require('mongoose');
// define schema
var SitesSchema = new mongoose.Schema({
    domain: { type: String, unique: true},
    date: String,
    ip: String,
    server: String
});
// register schema
mongoose.model('Sites', SitesSchema);