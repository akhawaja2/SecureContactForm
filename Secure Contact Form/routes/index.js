var express = require('express');
var url = require('url');
var router = express.Router();

var allInfo = new Array;
var geocodedAddresses = new Array;

var NodeGeocoder = require('node-geocoder');
var options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: 'boop',
	formatter: null
};
var geocoder = NodeGeocoder(options);


var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/final';
var contacts;
var updateContact;
var id;


MongoClient.connect(url, function(err,db) {
	contacts = db.collection('contacts');

	contacts.find().toArray(function (err, result) {
		if (err)
		{
			console.log(err);
		}
		else if (result.length) 
		{
			//for (var i = 0; i < result.length; i++)
			//	console.log(JSON.stringify(result[i]));
		} 
		else
		{
			console.log("Nothing found");
		}
		
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mailer = function(req, res, next) {
	res.render('mailer', { });
}



router.get('/mailer', mailer);

router.post('/mailer', mailer);

router.post('/submit', function(req, res, next) {

	var gender = req.body.gender;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var street = req.body.street; //REQUESTING DATA FROM the form.
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var phone = req.body.phone;
	var email = req.body.email;
	var mail = req.body.mail;
	var canPhone = req.body.phoneBox;
	var canEmail = req.body.emailBox;
	var any = req.body.anyBox
	var fullAddress = street + " " + city + " " + state + " "+ zip + " ";
	var form = {gender: gender, fname : firstName, lname : lastName, street : street,  //creating a an array of data
			city : city, state: state, zip: zip, phone : phone, email: email, mail: mail, any : any, canPhone: canPhone, canEmail: canEmail };
	

	if (mail == 'on')
	{
		form.mail = "Yes";
	}
	if (canPhone == 'on')
	{
		form.canPhone = "Yes";
	}
	if (canEmail == 'on')
	{
		form.canEmail = "Yes";
	}
	if (mail != 'on')
	{
		form.mail = "No";
	}
	if (canPhone != 'on')
	{
		form.canPhone = "No";
	}
	if (canEmail != 'on')
	{
		form.canEmail = "No";
	}
	if (any == 'on')
	{
		form.canPhone = "Yes";
		form.canEmail = "Yes";
		form.mail = "Yes";
	}
	var geocodedAddress = geocoder.geocode(fullAddress, function(err, res){
		geocodedAddresses.push(geocodedAddress);
		//console.log(res);
	});

//	geocoder.geocode(address, function(req, res){
//		console.log(res);
//	});

	allInfo.push(form);
	//contacts.remove();
	contacts.insertOne(form);
//	contacts.find().toArray(function(err, docs) {
//		console.log(JSON.stringify(docs));
//	});

	res.render('submit', form);
});

router.get('/updatemailer', function(req, res, next)
{
	id = req.query._id;
	id = id.trim();
	//console.log(id.toString());

	//var updateContact = contacts.find.toArray(({"_id": ObjectId(id.toString())}));
	contacts.find({"_id": ObjectId(id.toString())}).toArray(function(err, docs) {
		updateContact = JSON.stringify(docs);
		//console.log(JSON.stringify(docs));
		//console.log(updateContact);
		res.render('updatemailer', {updateContact: allInfo});
	});	
	
	//console.log(JSON.stringify(updateContact.fname));
	//res.render('updatemailer', {updateContact: allInfo});
})

router.post('/updated', function(req, res, next) {

	var gender = req.body.gender;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var street = req.body.street; //REQUESTING DATA FROM the form.
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var phone = req.body.phone;
	var email = req.body.email;
	var mail = req.body.mail;
	var canPhone = req.body.phoneBox;
	var canEmail = req.body.emailBox;
	var any = req.body.anyBox
	var fullAddress = street + " " + city + " " + state + " "+ zip + " ";
	if (mail == 'on')
	{
		mail = "Yes";
	}
	if (canPhone == 'on')
	{
		canPhone = "Yes";
	}
	if (canEmail == 'on')
	{
		canEmail = "Yes";
	}
	if (mail != 'on')
	{
		mail = "No";
	}
	if (canPhone != 'on')
	{
		canPhone = "No";
	}
	if (canEmail != 'on' && any == 'on')
	{
		canEmail = "No";
	}
	if (any == 'on')
	{
		canPhone = "Yes";
		canEmail = "Yes";
		mail = "Yes";
	}
	var form = {gender: gender, fname : firstName, lname : lastName, street : street,  //creating a an array of data
			city : city, state: state, zip: zip, phone : phone, email: email, mail: mail, any : any, canPhone: canPhone, canEmail: canEmail };
	//contacts.remove();
	//contacts.insertOne(form);
	var geocodedAddress = geocoder.geocode(fullAddress);
	geocodedAddresses.push(geocodedAddress);
	//console.log(geocodedAddresses);
	contacts.update({"_id": ObjectId(id)}, {'$set': {
		gender: gender, 
		fname: firstName, 
		lname: lastName,
		street: street,
		city: city,
		state: form.state,
		zip: zip,
		phone: phone,
		email: email,
		mail: mail,
		canPhone: canPhone,
		canEmail: canEmail}}, function(err, res){
		if(err)
		{
			console.log(err);
		}

	});
	//contacts.find({"_id": ObjectId(id.toString())}).toArray(function(err, docs) {
	//	updateContact = JSON.stringify(docs);
	//	console.log(JSON.stringify(docs));
	//});

	res.render('updated', form);
});

router.get('/deleted', function(req, res, next) {
	id = req.query._id;
	id = id.trim();


	contacts.remove({"_id": ObjectId(id.toString())}, function(err, docs) {
		updateContact = JSON.stringify(docs);
		//console.log(JSON.stringify(docs));
		//console.log(updateContact);
		res.render('deleted', {updateContact: allInfo});
	})
});


var loggedIn = function(req, res, next) {
	if ( req.user ) {
		next();
	}
	else {
		//console.log(req.user);
		res.redirect("/login");
	}
}
router.get('/contacts', loggedIn, function(req, res, next) {
	//res.render('contacts', {contacts: allInfo});
//	contacts.find().toArray(function(err, docs) {
//		console.log(JSON.stringify(docs));
//	});

	contacts.find().toArray(function (err,docs) {
		if(err)
		{
			console.log(err)
		}	
		else{

			//console.log(JSON.stringify(docs));
			//var addresses = JSON.stringify(docs);;
			res.render('contacts', {allInfo: docs});			
		}

	});

});

module.exports = router;


