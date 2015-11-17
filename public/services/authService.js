angular.module('ghapoon').
factory('authService',['$http','alertingService','$location','$window','$rootScope','$state',
	function ($http,alertingService,$location,$window,$rootScope,$state) {
		//we use localStorage for cashing user
		//all the modern browser support that and at least 5MB is size limitation
		var token=$window.localStorage.token;
		if(token){
			
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			$rootScope.currentUser=payload.user;
			
			//$rootScope.inbox = $window.localStorage.inbox1;
			//$rootScope.outbox = $window.localStorage.outbox2;
			//$rootScope.shoppingBasket = $window.localStorage.shoppingBasket1;
		}
		
	return{
		signup:function (user) {
			$http.post('/api/signup',user).success(function (response) {
				alertingService.startAlert('ok','User signup successfully');
				//$location.path('home/login');
				$state.go('home.login');

			}).error(function (err) {
				alertingService.startAlert('error','User signup failed '+err );
			})
		},
		login:function (user,callback) {
			$http.post('/api/login',user).success(function (response) {
				//we save the current user in localStorage 
				//we want to store inbox and
				$window.localStorage.token=response.token;
				var payload=JSON.parse($window.atob(response.token.split('.')[1]));
				$rootScope.currentUser=payload.user;

				//retrive message box
				$rootScope.inbox=[];
				$rootScope.outbox=[];
				if(response.messageBox.length > 0){
				//var messageBox=response.messageBox;
				for (var i = 0; i < response.messageBox.length; i++) {
					//we must split the message to shorrer parts
					messagelist =[];
					counts = Math.ceil(response.messageBox[i].message.length / 25);
					
					for (var j = 0; j < counts; j++) {
						messagelist.push(response.messageBox[i].message.slice(j*25,(j+1)*25));
					};
					response.messageBox[i].messageList=messagelist;
					$rootScope.currentUser.email == response.messageBox[i].SellerEmail ?
						$rootScope.inbox.push(response.messageBox[i]) :
						$rootScope.outbox.push(response.messageBox[i]);
				  };
				  
			    };
				//retrive shopping basket
				$rootScope.shoppingBasket= [];
				if(response.shoppingBasket.length > 0){
				for (var i = 0; i < response.shoppingBasket[0].shoppingList.length; i++) {
					$rootScope.shoppingBasket.push(response.shoppingBasket[0].shoppingList[i]);
				  };
				 
			    };
			    
				
				callback(null,'success')
				
			}).error(function (err) {
				callback(err);
			})
		},
		logout:function () {
			$http.get('/api/logout').success(function (response) {
				delete $window.localStorage.token;
				$rootScope.currentUser="";
				$rootScope.inbox =[];
				$rootScope.outbox = [];
				$rootScope.shoppingBasket = [];
				alertingService.startAlert('ok','Logout succesfuly');
				$location.path('/');
			})
		},
		forgetPassword:function (email) {
			$http.post('/api/forgetPassword',email).success(function (response) {
				alertingService.startAlert('ok','Reset Password start,Please check your email to Change Password complete');
				$location.path('/');
			}).error(function (err) {
				alertingService.startAlert('error','Reset Password error '+err);
			})
		},
		resetPassword:function (password,accountId) {
			var newPassInfo={
				password:password,
				id:accountId
			};

			$http.post('/api/resetPassword',newPassInfo).success(function (response) {
				alertingService.startAlert('ok','password user with email '+response.email+' has been changed successfully');
				$location.path('/login');
			}).error(function (err) {
				alertingService.startAlert('error','Change password failed '+err);
			})
		}
	}
}])