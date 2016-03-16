function date_format(){
	var d = new Date();
	var timeStamp = d.getTime();
	return timeStamp;
}
module.exports = date_format;