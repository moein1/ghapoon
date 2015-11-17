angular.module('ghapoon').
controller('shoppingBasket',['$scope','$rootScope','$state',function ($scope,$rootScope,$state) {
	$scope.products=$rootScope.shoppingBasket;

   if(!$rootScope.currentUser){
        $state.go('home.login');
    }
    
	$scope.overlayClass = "white_content";
	
        $scope.displayBlock = { "display":"block" };
        $scope.displayNone = { "display":"none" };    
    
        $scope.lightStyle = $scope.displayNone;
        $scope.fadeStyle = $scope.displayNone;  

      

       $scope.selectImage=function (product) {
       	 $scope.images=[];
     	 for (var i = 0; i < product.image.length; i++) {
         $scope.images.push({src:product.image[i]});
    	 };

    	/* $scope.lightStyle = $scope.displayBlock;
    	 $scope.fadeStyle = $scope.displayBlock;*/
        toggleOverlay();
  };


   //var triggerBttn = document.getElementById( 'trigger-overlay' ),
    overlay = document.querySelector( 'div.overlay' ),
    overly2=angular.element(overlay);
    closeBttn = overlay.querySelector( 'button.overlay-close' );
    closeBttn2=angular.element(closeBttn);
    transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    },
    transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
    support = { transitions : Modernizr.csstransitions };
 
  function toggleOverlay() {
    if( overly2.hasClass('open') ) {
      overly2.removeClass('open');
      overly2.addClass('close');

      var onEndTransitionFn = function( ev ) {
        if( support.transitions ) {
         // if( ev.propertyName !== 'visibility' ) return;
         // this.removeEventListener( 'transitionend', onEndTransitionFn );
        }
        overly2.removeClass('close');
      };

      if( support.transitions ) {
        overly2.on( 'transitionend', onEndTransitionFn );
      }
      else {
       // onEndTransitionFn();
      }

    }
    else if( !overly2.hasClass('close') ) {
      overly2.addClass('open');
    }
  }

  //triggerBttn.addEventListener( 'click', toggleOverlay );
  closeBttn2.on( 'click', toggleOverlay );
    
}])

