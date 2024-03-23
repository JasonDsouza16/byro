var mysql = require('mysql');
var connection = mysql.createConnection({
	host: process.env.dbhost,
	user: process.env.dbuser,
	password: process.env.dbpass,
	database: process.env.dbname
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;
