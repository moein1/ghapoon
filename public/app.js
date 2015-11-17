angular.module('ghapoon',['ngRoute','ui.router','ui.bootstrap','wc.directives','ngAnimate','ngMessages']).
config(['$locationProvider','$stateProvider','$urlRouterProvider',
	function ($locationProvider,$stateProvider,$urlRouterProvider) {
	$locationProvider.html5Mode(true);
	//for any unmatched state redirect to //state1
	$urlRouterProvider.otherwise('/home');

	//now set up the state
	$stateProvider.state('home',{
		url:'/home',
		templateUrl:'views/main.html',
		controller:'mainCtrl'
	})
	.state('home.details',{
		url:'/selectProduct/:product',
		templateUrl: 'views/selectProduct.html',
        controller: 'selectProductCtrl'
	})
	/*.state('details',{
		url:'/selectProduct/:product',
		templateUrl: 'views/selectProduct.html',
        controller: 'selectProductCtrl'
	})*/
	.state('home.login',{
		url:'/login',
		templateUrl:'views/login.html',
		controller:'loginCtrl'
	}).state('home.signup',{
		url:'/signup',
		templateUrl:'views/signup.html',
		controller:'signupCtrl'
	}).state('home.forgetPassword',{
		url:'/forgetPassword',
		templateUrl:'views/forgetPassword.html',
		controller:'forgetPasswordCtrl'
	}).state('home.addCategory',{
		url:'/addCategory',
		templateUrl : 'views/addCategory.html',
		controller:'addCategoryCtrl'
	})
	.state('addProduct',{
		url:'/addProduct',
		templateUrl:'views/newProduct.html',
		controller:'addProductCtrl'
	}).state('home.addCity',{
		url:'/addCity',
		templateUrl:'views/addCity.html',
		controller:'addCityCtrl'
	})
	.state('shoppingBasket',{
		url:'/shoppingBasket',
		 templateUrl: "views/shoppingBasket.html",
		 controller:'shoppingBasket' 
        
      	
	})
//http://angular-route-segment.com/
//https://github.com/angular-ui/ui-router/wiki/URL-Routing

	/*console.log('we are in routing');
	$routeProvider.when('/',{
		templateUrl:'views/main.html',
		controller:'mainCtrl'
	}).when('/selectProduct/:productId', {
            templateUrl: 'views/selectProduct.html',
            controller: 'selectProductCtrl'
        }).when('/addProduct',{
		templateUrl:'views/newProduct.html',
		controller:'addProductCtrl'
	}).when('/signup',{
		templateUrl:'views/signup.html',
		controller:'signupCtrl'
	}).when('/login',{
		templateUrl:'views/login.html',
		controller:'loginCtrl'
	}).when('/forgetPassword',{
		templateUrl:'views/forgetPassword.html',
		controller:'forgetPasswordCtrl'
	}).when('',{
		templateUrl:'views/resetPassword.html',
		controller:'resetPasswordCtrl'
	}).otherwise({
		redirectTo:'/'
	})*/
}]).config(['$httpProvider',function ($httpProvider) {
	$httpProvider.interceptors.push(['$rootScope','$q','$location','$window',
		function ($rootScope,$q,$location,$window) {
		return{
			 //I have assigned to the request property demonstrates how an interceptor can alter a request
			 //this can cause any request from client side shold be check the authentication of user
			 request:function (request) {
			 	if($window.localStorage.token){
			 		request.headers.authorization='Bears '+ $window.localStorage.token;
			 	}
			 	return request;
			 },
			 responseError:function (response) {
			 	if(response.status==401 || response.status==403){
			 		$location.path('/login');
			 	}
			 	return $q.reject(response);
			 }
		}
	}])
}])