function date_format(){
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	return day + "." + month + "." + year;
}
module.exports = date_format;