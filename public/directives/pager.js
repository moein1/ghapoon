angular.module('ghapoon').
directive('customPager',function () {

  /*several important note 
   1)in naming be very ceraful because camel case naming 
    the best way for avoidnig canfusing must
    avoid using uppser case in scope names
  2)
  for passing data from directive to main controller we should 
  //pass it like setpage dcope by json way and catch  it in
  //other side with the same name
  you must be careful to not catching this function inside the d
  directive controller or link function
  */
  return{
    restrict:'E',
    replace:true,
    scope:{
      pages : '=',
      index : '=',
      perpage:'=',
      counts:'=',
      nopages:'=',
      setpage:'&'
    },
    link:function (scope,element,attrs) {
      
    }
    ,
    templateUrl:'./views/pagerTemplate.html'
  }
})