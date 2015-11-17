var mongoose=require('mongoose'),
bcrypt=require('bcryptjs');

var userSchema=new mongoose.Schema({
	name:{type:String,trim:true,required:true},
	email:{type:String,trim:true,required:true,unique:true},
	password:{type:String,trim:true,required:true}
});

//this is a method for encrypting the password befor store in database
//we use bcrypt middlewaere
userSchema.pre('save',function (next) {
	console.log('we re in encrpy pass'+this);
	var user=this;

	if(!user.isModified('password')) next();

	bcrypt.genSalt(10,function (err,salt) {
		if(err) return next(err);

		bcrypt.hash(user.password,salt,function (err,hash) {
			if(err) return next(err);

			user.password=hash;
			console.log('password bctypted +'+hash);
			next();
		});
	});

});

//adding a function for encrypt the password befor checking with the pure password come from client side
userSchema.methods.comparePassword=function (canidatedPassword,callback) {
	bcrypt.compare(canidatedPassword,this.password,function (err,isMath) {
	if(err) return callback(err);

	callback(null,isMath);
	})
}

module.exports = mongoose.model('user',userSchema);
