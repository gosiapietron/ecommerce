var mongoose  = require('mongoose'),
	 Schema  = mongoose.Schema,
	 user    = require('./user')

var	 mySchema = new Schema({
		  item:String,
		  price:String,
		  description:String,
		  availability:String,
		  photos:[],
	user:{type: mongoose.Schema.Types.ObjectId, ref: 'salame fresco'}
	});

var myProducts = mongoose.model("myProducts", mySchema)
module.exports = myProducts