var mongoose  = require('mongoose'),
	  Schema  = mongoose.Schema,
	 user    = require('./user')

var	 mySchema = new Schema({
		  sentence:String,
		  translations:[],
	user:{type: mongoose.Schema.Types.ObjectId, ref: 'salame fresco'}
	});

var mySentences = mongoose.model("mySentences", mySchema)
module.exports = mySentences

