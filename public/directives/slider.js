angular.module('ghapoon').
directive('slider',['$timeout',function ($timeout) {
	return{
		restrict:'EA',
		//replace:true,
		scope:{
			images:'=',
			description : '='
		},
		link:function (scope,element,attrs) {
			/*$('#image1').elevateZoom(/*{
			   
			   }); */
			scope.imageroot='./img/';
			scope.currentIndex = 0; // Initially the index is at the first image
           	scope.selectedImage =  '';
           console.log()
           scope.selectOverly=function () {
	       	 //$scope.images=images;
	       	  toggleOverlay();
	    	 };
            scope.selectImage=function (image) {
            	scope.selectedImage=image;
            }
			/*scope.next = function() {
			  scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
			};

			scope.prev = function() {
			  scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
			};*/

			/*scope.$watch('currentIndex',function () {
				//scope.selectedImage=image;
			});

			var timer;
			var sliderFunc=function () {
				timer=$timeout(function() {
					scope.next();
					//timer=$timeout(sliderFunc,3000);
				}, 3000);
			}

			sliderFunc();

			scope.$on('$destroy',function () {
				$timeout.cancel(timer);//when the scope is getting destroed cancel timer
			});*/
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
		 
		  console.log('transEndEventName is '+transEndEventName);
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
		},
		templateUrl:'./views/sliderTempalte.html'
	}
}])