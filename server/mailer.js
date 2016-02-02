var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(
	smtpTransport({
		service: 'gmail',
		auth:{
			user: 'library.sites.service@gmail.com',
			pass: 'kGflJaJdce'
		}
	})
);
var params = {
  from: 'library.sites.service@gmail.com', 
  to: 'kozynets.dmytro@gmail.com', 
  subject: 'Hi, body!',
  text: 'Let\'s read some articles on Web Creation'
};
module.exports = {
	sendMail: function(to, subject, pass){
		if(to == '' || subject == '' || pass == ''){
			console.log('errorMail');
		}else{
				var params = {
					from: 'library.sites.service@gmail.com',
					to: to,
					subject: 'Hi, '+ subject +'!',
					text: 'login: '+ to + '\n'+'pass: ' + pass 
				}
			transporter.sendMail(params, function (err, res) {
  				if (err) {
     				console.error(err);
  				}
  				console.log('done');
			})	
		} 	
	}
}