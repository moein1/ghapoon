var mongoose=require('mongoose');

var ProductSchema=new mongoose.Schema({
 name:{type:String,trim:true,required:true},
 description:{type:String,trim:true},
 category:{type:String,trim:true,required:true}
 ,group:{type:String,trim:true}
 ,image:[String]
 ,price:{type:Number,required:true}
 ,AddDate:{type:String}
 ,province:{type:String,trim:true,required:true}
 ,city:{type:String,trim:true,required:true}
 ,email:{type:String,trim:true,required:true}
 ,phone:{type:String}
 //,productCategory:[productCategorySchema]
})

//this is for cratnig incremental id for every table example productCategory table
var settingSchema=new mongoose.Schema({
	collectionName:{type:String,required:true,trim:true,default:'ProductCategory'},
	nextSeqNumber:{type:Number,default:1}
})


var productCategorySchema=new mongoose.Schema({
	category : {type:String,trim:true,required:true},
	group : [{type: String,trim:true}],
	id : {type:Number,unique:true}
})

productCategorySchema.index({id:1,type:1});

var Setting =mongoose.model('setting',settingSchema);

//this pre save function can assign the last id increment to id
productCategorySchema.pre('save',function (next) {
	console.log('doc is '+this);
	var doc = this;
	//we should arrange all the new insert product
	if(this.isNew){
		console.log('we are in setting'+doc);
		//the setting table has only one row for each colletion in this example products collection
        //in every change if this is a insert you can increnent the seq number by one and catch the current seq number
        //for this last insert row to products colection
        Setting.findOneAndUpdate({collectionName:'ProductCategory'},{$inc:{nextSeqNumber : 1}},
        	function (err,setting) {
        		if(err){
        			console.log('error in find and update setting'+err)
        			next(err);
        		}
        			
        	if(setting == null){
        		//so this is the first time and must insert a row in setting table and assign id = 1 to productCategory
        		var firstSet = new Setting;
        		firstSet.nextSeqNumber = 1;
        		firstSet.collectionName = 'ProductCategory';
        		firstSet.save(function (error,result) {
        			if(error){
        				console('eror in adding first category '+error);
        				next(error);
        			}
        				
        			//insert frist id to productCategory table
        			doc.id = 1;
        			console.log('first inseret in productCategory'+doc);
        			next();
        		})
        	}else{
        		doc.id = setting.nextSeqNumber + 1;
        		console.log('second or more insert product category '+doc);
        		next();
        	}

        })
	}else{
		next();
	}
})

var cityProvinceSchema =new mongoose.Schema({
	id:{type:Number,unique:true},
	province:{type:String,trim:true,required:true},
	city:[{type:String,trim:true}]
})

cityProvinceSchema.pre('save',function (next) {
	var doc =this;
	if(this.isNew){
		Setting.findOneAndUpdate({collectionName:'CityProvince'},{$inc:{nextSeqNumber:1}},function (err,setting) {
		if(err){next(err)}

		if(setting == null){
			var firstSet =new Setting;
			firstSet.nextSeqNumber = 1;
			firstSet.collectionName = 'CityProvince';
			firstSet.save(function (error,result) {
				if(error){
					console.log('error in setting nextSeqNumber '+error);
					next(error);
				}else
				{
					doc.id = 1;
					next();
				}
			})
			
		}else{
			doc.id = setting.nextSeqNumber + 1;
			next();
		}
	})
	}else{
		next();
	}
	
})

var favoriteProductSchema=new mongoose.Schema({
	userId:{type:String,required:true},
	productId:{type:String,required:true},
	AddDate:{type:String,required:true}
})

var shoppingBasketSchema=new mongoose.Schema({
	userId:{type:String,required:true},
	shoppingList:[ProductSchema],
	AddDate:{type:String,required:true}
})

var messageBoxSchema=new mongoose.Schema({
	BuyerEmail : {type:String,required:true},
	SellerEmail :{type:String,required:true},
	message:{type:String,required:true,trim:true},
	AddDate:{type:String,required:true},
	Sender:{type:String},
	ProductName:{type:String},
	ProductImage:{type:String}

})
//setting index for improve qery
ProductSchema.index({AddDate:1,type:1});

//module.exports=mongoose.model('product',ProductSchema);

//module.exports=mongoose.model('FavoriteProduct',favoriteProductSchema);

module.exports={
	Product : mongoose.model('product',ProductSchema),
	FavoriteProduct : mongoose.model('FavoriteProduct',favoriteProductSchema),
	MessageBox : mongoose.model('MessageBox',messageBoxSchema),
	ShoppingBasket:mongoose.model('ShoppingBasket',shoppingBasketSchema),
	ProductCategory : mongoose.model('ProductCategory',productCategorySchema),
	CityProvince : mongoose.model('CityProvince',cityProvinceSchema)
}