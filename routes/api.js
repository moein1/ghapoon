var db=require('../accessDB');

//using nodemailer

//using mailer

//you must turn on less secure account access on your gmail account for sending email
//https://support.google.com/accounts/answer/6010255
//https://www.google.com/settings/security/lesssecureapps

//you must turn on less secure app from your account
var nodemailer = require('nodemailer');


function sendEmail(subject,text,to,callback) {
    //start test mailer
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: 'm.mammad.karimi@gmail.com', pass: 'nilufar1356' }
    });

    var mailOptions = {
        from: 'm.mammad.karimi@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error){
            console.log('sending email error '+error)
            callback(error);
        }
            
        else {
            if (response) {
                callback(null, true);
            }
        }
        console.log('Sending email response :' + response);
        smtpTransport.close();
        //done();
    });

}

exports.login=function (req,res) {
    db.login(req.body,function (err,data) {
        if(err){
             res.send(401,err);
        }else{
             res.send(data);
        }
    })
}
exports.uniqueEmail=function (req,res) {
 var email=req.query.email; 
 db.uniqueEmail(email,function (err,data) {
     if(err)
        res.send(err);
     else
        res.send({
            available:data
        })

 })
}
exports.signup=function (req,res) {
    db.signup(req.body,function (err,data) {
        if(err)
            res.send(401,'Invalid userName/Password');
        else
            res.send(200);
    })
}

exports.resetPassword=function  (req,res) {
    db.resetPassword(req.body,function  (err,email) {
        if(err){
            res.send(err);
        }else{
            res.send(200,{
                email:email,
                status:'success'
            });
        }

    })
}

exports.forgetPassword=function (req,res) {
    var hostname = req.headers.host;
    console.log('host is' + hostname);
    var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
    console.log('email is '+req.body.email)
    db.forgetPassword(req.body.email,function (err,user) {
        if(err){
            res.send(401,'Invalid email address')
        }else
        {
            resetPasswordUrl += '?account=' + user._id;
            sendEmail('Ghapoon Password reset request', resetPasswordUrl,user.email,
                function (err,result) {
                    
                    if(err){
                        res.send('Some error occured sending email for reset password.Please try again later');
                    }else{
                        res.send({
                            result:'success'
                        });
                    }
                });
        }

    })
}

exports.searchProduct=function (req,res) {
  db.searchProduct(req.query.$words,req.query.$whole,req.query.$category,
    req.query.$group,req.query.$province,function (err,data) {
     if(err){
        res.send(err);
     }else{
        console.log('return '+data.searchresult);
        res.send(data);
     }
  })
}


exports.getProduct=function (req,res) {
	var top=req.query.$top;
	var reverse=req.query.$reverse;
	var skip=req.query.$skip;
	var orderby=req.query.$orderby;
    var category = req.query.$category;
    var group = req.query.$group;
	db.getProduct(top,skip,orderby,reverse,category,group,function (err,data) {
		if(err)
	    	res.send(err);
	    else{
	    	 res.json(data);
	    }
           

	});
}

exports.singleProduct=function (req,res) {
    var productId=req.params.productId;
    console.log('productId is '+productId);
    db.singleProduct(productId,function (error,data) {
        if(error){
            res.send('some error occured '+error);
        }else{
            res.send(data);
        }
    })
}

exports.addProduct=function (req,res) {
	db.addProduct(req.body,function (err,data) {
		if(err)
			res.send('some error occured');
		else{
            //we disable sending email Temporary
            sendEmail('Your addvertise at Ghapoon','You have added adevertisment successfully',data.email,
                function (err,data) {
                if(err)
                    res.send('some error occured in sending email');
                else{
                    console.log('advertise add successfully and send email successfully');
                    res.send('success');
                }
                  
            })
            //res.send('success');
            
        }
			
	})
}

exports.addCategory = function (req,res) {
    db.addCategory(req.body,function (err,data) {
       if(err){
         res.send(405,err);
       }else{
        res.send('success');
       }
    })
}
exports.getCategory =function (req,res) {
    db.getCategory(function (err,data) {
        if(err){
            res.send(405,err);
        }else{
            res.send(data);
        }
    })
}
exports.addCity =function (req,res) {
   db.addCity(req.body , function (err,data) {
      if(err){
        res.send(err);
      }else{
        res.send('success');
      }
   })
}

exports.getCity =function (req,res) {
    db.getCity(function (err,result) {
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }

    })
}

exports.AddToBasket=function (req,res) {
    db.AddToBasket(req.body,function (err,data) {
        if(err){
            res.send('some error occured '+err);
        }else{
            res.send('success');
            //we cand send an email to seller
        }
    })
}

exports.sendMessage=function (req,res) {
    db.sendMessage(req.body,function (err,data) {
        if(err){
            res.send('some eror occured');
        }else{
            sendEmail('ghapoon message', 'someone send you a message '+data.message,data.SellerEmail,
                function (err,result) {
                    
                    if(err){
                        res.send('Some error occured sending email to seller of product');
                    }else{
                        res.send('success');
                    }
                });
            //res.send('success');
            //we shoul send email to buyer and seller of product
        }
    })
}

var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra');

exports.deleteFile = function (req,res) {
   var exactFile = 'public/img/'+req.body.file;
   fs.remove(exactFile,function (err) {
       if(err)
         res.send({status:false,message:err}) ;
       else
        res.send({status: true});
   })

} 

exports.uplaodImage = function (req, res) {
    var form = new formidable.IncomingForm();
    var message;
    form.parse(req, function (err, fields, files) {
        if (files.file.size > 60000) {
            //alertingService.startAlert('error', 'File size must be less than 30k');
            message = 'File size must be less than 30k';
            res.send({ status: false, message: message });
        } else if (files.file.type != 'image/jpeg') {
            // alertingService.startAlert('error', 'File type must be image/jpeg only');
            message = 'File type must be image/jpeg only';
            res.send({ status: false, message: message });
        } else {
            /* Temporary location of our uploaded file */
            var temp_path = files.file.path;
            /* The file name of the uploaded file */
            var file_name = files.file.name;
            /* Location where we want to copy the uploaded file */
            var new_location = 'public/img/';
            fs.copy(temp_path, new_location + file_name, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("success!")
                    res.send({ status: true });

                }
            });
        };
        
    });

}