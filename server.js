var express = require('express')
,bodyParser=require('body-parser')
,path=require('path')
,cookieParser=require('cookie-parser')
,logger=require('morgan')
,mongoose=require('mongoose')
,compression = require('compression')
,app=express();

var api=require('./routes/api');
var config=require('./routes/config');

//using for enocding the user befor send back to server
var jwt=require('jwt-simple'),
moment=require('moment'),
tokenSecret='my token secret';

//decode token recived from server for ensuring authetication

function ensureAuthenticated (req,res,next) {
	if(req.headers.authorization){
		var token=req.headers.authorization.split(' ')[1];

		try{
			var decoded=jwt.decode(token,tokenSecret);
			if(decoded.exp<= Date().now){
				res.send(400,'Access token has been expired');
			}else{
				console.log('succssfully decode token and authenircated '+decoded.user.name)
				req.user=decoded.user;
				return next();
			}
		}catch(err){
			res.send(500,'error catching token');
		}
	}else
	{
		res.send(401);
	}
}

app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));

app.set('port',process.env.PORT || 3005);
mongoose.connect(config.db);
mongoose.connection.on('open',function () {
	console.log('we are connnecting to ghapoon database');
})
app.post('/api/login',api.login);
app.post('/api/signup',api.signup);
//for checkenig unique email address
app.get('/api/user',api.uniqueEmail);
app.get('/api/logout',function (req,res) {
	res.send(200);
})
//forgot password
app.post('/api/forgetPassword',api.forgetPassword);

app.post('/api/resetPassword',api.resetPassword);

app.get('/api/product',api.getProduct);

app.get('/api/product/:productId',api.singleProduct);

app.post('/api/product',ensureAuthenticated,api.addProduct);

app.get('/api/searchProduct',api.searchProduct);

app.post('/api/AddToBasket',api.AddToBasket);

app.post('/api/sendMessage',api.sendMessage);
//uplad image
app.post('/api/uploadFile', api.uplaodImage);
//delete file
app.post('/api/deleteFile',api.deleteFile);
/*
 this is the adimninstrator panel
*/
//adding category
app.post('/api/addCategory',api.addCategory);

app.get('/api/getCategory',api.getCategory);

app.post('/api/addCity',api.addCity);

app.get('/api/getCity',api.getCity);

//this route must be the last one and use for any refresh in angular pages
app.get('*',function (req,res) {
	res.redirect('/#'+req.originalUrl);
});
app.listen(app.get('port'),function () {
	console.log('we are listening on port '+app.get('port'));
})