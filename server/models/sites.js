var mongoose = require('mongoose');
// define schema
var SitesSchema = new mongoose.Schema({
    domain: { type: String, unique: true},
    date: String,
    ip: String,
    server: String
});
// register schema
SitesSchema.plugin(autoIncrement.plugin, { model: 'Sites', field: 'site_id' ,startAt: 1, incrementBy: 1 });
mongoose.model('Sites', SitesSchema);