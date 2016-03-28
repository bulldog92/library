var mongoose = require('mongoose');
// define schema
var OptionsApi = new mongoose.Schema({
	keyApi: {type: String},
	name: String
});
// register schema
mongoose.model('Options', OptionsApi);