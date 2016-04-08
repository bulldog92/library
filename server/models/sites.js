var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
// define schema
var SitesSchema = new mongoose.Schema({
    domain: { type: String, unique: true},
    date: { type: Date },
    ip: String,
    server: String,
    documentRoot: String,
    errorLog: String,
    description: String
});
// register schema
SitesSchema.plugin(autoIncrement.plugin, { model: 'Sites', field: 'site_id' ,startAt: 1, incrementBy: 1 });
mongoose.model('Sites', SitesSchema);