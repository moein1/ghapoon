var Product=require('./models/product').Product;
var FavoriteProduct=require('./models/product').FavoriteProduct;
var MessageBox=require('./models/product').MessageBox;
var ShoppingBasket=require('./models/product').ShoppingBasket;
var ProductCategory = require('./models/product').ProductCategory;
var User=require('./models/user');
var CityProvince = require('./models/product').CityProvince;

//using for enocding the user befor send back to server
var jwt=require('jwt-simple'),
moment=require('moment'),
tokenSecret='my token secret';

function creatJwtToken (user) {

	var payload={
		user:user,
		iat:new Date().getTime(),
		exp:moment().add('days',7).valueOf
	}
	return jwt.encode(payload,tokenSecret);
}

module.exports={
	resetPassword:function (req_body,callback) {
		var newPassword=req_body.password,
		accountId=req_body.id;

		User.findOne({'_id':accountId},function (err,user) {
			if(err)
				return callback(err);
			user.password=newPassword;
			user.save(function (err,user) {
				if(err)
					return callback(err);
				return callback(null,user.email);
			})
		})
	},
	forgetPassword:function (email,callback) {
		User.findOne({'email':email},function (err,user) {
			if(err)
				return callback(err);
			return callback(null,user)
		})
	},
	login:function (req_body,callback) {
		var email=req_body.email,
		password=req_body.password;

		User.findOne({'email':email},function (err,user) {
			if(err)
				return callback(err)
			if(user){
			
			user.comparePassword(password,function (err,isMath) {
				if(err)
					return callback(err);
				//for retrive the refresh info we used !same! password
				if(!isMath && password!='!same!'){
					return callback('invalid username/pasword');
				}else if(isMath || password=='!same!'){
				//we will decode this token in client side in $httpProvider.intercdpor in request part
				var token=creatJwtToken(user);
				//we must retrive your inbox,outbox and shopping basket
				//inbox is the message that your email is seller
				//outbox is the message that your email is buyer
				MessageBox.find({$or:[{'SellerEmail' : email},{'BuyerEmail':email}]},function (err,messageBox) {
					if(err)
						return callback('some error in retrive inbox outbox '+err);
					//your shopping basket
					ShoppingBasket.find({'userId':user._id},function (error,shoppingBasket) {
						if(error)
							return callback('some error in retrive shopping basket '+error);
						//console.log('retrive data ')
						return callback(null,{
							token:token,
							messageBox:messageBox,
							shoppingBasket:shoppingBasket
						});
					})
				})
				}
			})
		}else{
			console.log('user is not valid');
			return callback('User name is not valid');
		}
		})
	},
	uniqueEmail:function (email,callback) {
		User.findOne({'email':email},function (err,data) {
			if(err)
				return callback(err);
			if(data){
				return callback(null,true);
			}else
			{

				return callback(null,false);
			}
		})
	},
	signup:function (req_body,callback) {
		var newUser=new User;

		newUser.name=req_body.name;
		newUser.email=req_body.email;
		newUser.password=req_body.password;
       console.log('new user in accessdb '+newUser);
		newUser.save(function (err,data) {
			if(err)
				return callback(err);
			return callback(null,data);
		})
	},searchProduct:function (words,whole,category,group,province,callback) {
		//if whole has been checked we must not split the words
		var searchArray=[];
		if(whole=='true'){
			searchArray.push(words);
		}else{
		  searchArray=words.split(' ');
		}
		
		var searchReqExp=[]
		var counts;
		//Product.find({$text:{$search:'Laptop'}}).exec(function (err,data) {
			for (var i = 0; i < searchArray.length; i++) {
				//first we should delete words with less than 3 characters
				if(searchArray[i].length <3){
					delete searchArray[i]
				}else{
					searchReqExp[i] = new RegExp(searchArray[i], 'i');
				}
		    //searchQuery[i] = Product.find({$or:[{'name':new RegExp(searchArray[i], 'i')},{'description':new RegExp(req_body, 'i')}]});
			};	
			var query;
			query = category == 'all' ? Product.find() : Product.find({category : category , group : group});
			
			query = province == 'all' ? query.find() : query.find({province : province});
			
			query.find({$or:[{'name':{$in:searchReqExp}},{'description':{$in:searchReqExp}}]}).exec(	
				function (err,data) {
			if(err){
				console.log('error in search '+err);
				return callback(err);
			}
			counts=data.length;
			return callback(null,{ searchresult : data,counts:counts });
		})
},
singleProduct:function (req_body,callback) {
	Product.findOne({'_id':req_body},function (err,result) {
		if(err){
			return callback(err);
		}
			
		return callback(null,{product:result});
	})
},
getProduct:function (top,skip,orderby,reverse,category,group,callback) {
		var counts,
		asc,
		category_count,
		group_count,
		query;
		asc = reverse == 1 ? "" : "-";
		/*very important note is that we have three query
		 and we must try to wait for all of them so we call one
		 by one inside the result of each other
		*/ 
		var count_query;
		//count_query = category =="all" ? Product.count() : Product.count({category : category});
		if(category =='all'){
		 	count_query = Product.count();
		 }else{
		 	if(group == 'all'){
		 		count_query = Product.count({category : category});
		 	}else{
		 		count_query = Product.count({category : category , group : group});
		 	}
		 }

		count_query.exec(function (err,result) {
		counts=result;

		 var query;
		 if(category =='all'){
		 	query = Product.find();
		 }else{
		 	if(group == 'all'){
		 		query = Product.find({category : category});
		 	}else{
		 		query = Product.find({category : category , group : group});
		 	}
		 }
		query.sort(asc+orderby).skip(skip).limit(top).exec(function (err,limitprods) {
		if(err)
			return callback(err);
		else{
				//aggregate function
			Product.aggregate({
				$group:{
					_id:'$category',
					total:{$sum : 1}
				}
			}, function (err, result) {
		        if (err) {
		            console.log(err);
		           // return;
		        }
		        category_count=result;
		        //grouping selected categoory by group
		        Product.aggregate([{$match: {
			            category: category
			        }},
		        	{
		        		$group : {
		        			_id:'$group',
		        			total : {$sum : 1}
		        		}
		        	}],
		        	function (err,groupResult) {
		        	if(err)
		        		return callback(err);
		        	group_count = groupResult;
		        	return callback(null,{
						counts:counts,
						products:limitprods,
	                    category_count:category_count,
	                    group_count : group_count
		        })
			});
		    });
		}
		})
		})
		//}
	},
	addProduct:function (req_body,callback) {
		var product;
		product=new Product;
		product.name=req_body.name;
		product.description=req_body.description;
		product.price=req_body.price;
		product.category=req_body.category;
		product.group = req_body.group;
		product.image=req_body.image;
		product.phone=req_body.phone;
		product.email=req_body.email;
		product.province=req_body.province;
		product.city=req_body.city;
		product.AddDate=new Date();
		product.save(function (err,data) {
			if(err){
				return callback(err);
			}
				
			else{
				return callback(null,data);
			}
				
		})

	},
	getCategory:function (callback) {
		ProductCategory.find({},function (err,result) {
			if(err){
				return callback(err);
			}
			return callback( null, {categories:result} );
		})
	},
	addCategory:function (req_body,callback) {
		ProductCategory.findOne({'category' : req_body.category},function (err,existCategory) {
			if(err)
				return callback(err);
			if(existCategory == null ){
				//add new category and group
				var newCategory= new ProductCategory;
				newCategory.category = req_body.category;
				newCategory.group = req_body.group;
				newCategory.save(function (err,result) {
					if(err){
						console.log(err);
						return callback(err);
					}
					return callback(null,'success');
				})
			}else{
				if(existCategory.group.indexOf(req_body.group) > -1){
					return callback('this group has already been added');
				}
				//add group to exist category
				existCategory.group.push(req_body.group);
				existCategory.save(function (error,result) {
					if(error) return callback(err);
					return callback(null,'success');
				})
			}
		})
		
	},
	addCity:function (req_body,callback) {
		CityProvince.findOne({'province':req_body.province},function (err,existProvince) {
			if(err)
				return callback(err);
			if(existProvince == null){
				//add new province with citye
				var newCity = new CityProvince;
				newCity.province=req_body.province;
				newCity.city = req_body.city;
				newCity.save(function (error,result) {
					if(error){
						console.log('some error ocured'+error);
						return callback(error);
					}
					console.log('nw CityProvince added '+result);
					return callback(null,'success');
				})
			}else{
				if(existProvince.city.indexOf(req_body.city) > -1){
					return callback('this city has already been added')
				}
				//add city to existing province
				existProvince.city.push(req_body.city);
				existProvince.save(function (error,result) {
					if(error){return callback(error);}
					return callback(null,'success');
				})
			}
		})
		
	},
	getCity:function (callback) {
		CityProvince.find({},{'_id':0},function (err,result) {
			if(err)
			  return callback(err);
			return callback(null,{cities : result});
		})
	},
	AddToBasket:function (req_body,callback) {
		console.log('add to basket'+req_body);
	var myBasket=new ShoppingBasket;
	//first we should query on the id if the user has been aded a shopping befor
	//we should add this product to the list
	var userId=req_body.userId;
	ShoppingBasket.findOne({'userId':userId},function (err,shopping) {
		if(err)
			return callback(err);
		if(shopping){
			shopping.shoppingList.push(req_body.Product);
			shopping.save(function (error,data) {
				if(error)
					return callback(error);

				return callback(null,data);
			})
		}else{
			myBasket.userId = req_body.userId;
			myBasket.shoppingList=req_body.Product;
			myBasket.AddDate = new Date();
			myBasket.save(function (error,data) {
				if(err)
					return callback(error);

				return callback(null,data);
			})
		}

	})
	},
	sendMessage:function (req_body,callback) {
		var messageBox=new MessageBox();
		messageBox.BuyerEmail = req_body.BuyerEmail;
		messageBox.SellerEmail = req_body.SellerEmail;
		messageBox.message = req_body.message;
		messageBox.AddDate = new Date();
		messageBox.Sender = req_body.Sender;
		messageBox.ProductName = req_body.ProductName;
		messageBox.ProductImage = req_body.ProductImage;

		messageBox.save(function (err,data) {
			if(err){
				return callback(err);
			}
			return callback(null,data);
		})
	}
}