angular.module('ghapoon').
filter('breakLine',function () {
	return function (input) {
		var counts = Math.ceil(input.length / 20);
		var output='';
		for (var i = 0; i <= counts; i++) {
			output = output + input.slice(i*20,20*(i+1))+'\\n';
		};
		console.log('output is '+output+'couts is '+counts);
		return output;
	}
})