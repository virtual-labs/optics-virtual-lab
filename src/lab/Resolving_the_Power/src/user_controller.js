(function() {
    angular.module('users', ['FBAngular'])
        .controller('userController', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$scope', '$element', 'Fullscreen', '$mdToast', '$animate',
    userController]);

    /**
     * Main Controller for the Angular Material Starter App
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function userController($mdSidenav, $mdBottomSheet, $log, $q, $scope, $element, Fullscreen, $mdToast, $animate) {
        $scope.toastPosition = {
            bottom: true,
            top: false,
            left: true,
            right: false
        };
        /** Menu swipe */
        $scope.toggleSidenav = function(ev) {
            $mdSidenav('right').toggle();
        };
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
                .filter(function(pos) {
                return $scope.toastPosition[pos];
            })
            .join(' ');
        };
        $scope.showActionToast = function() {
            var _toast1 = $mdToast.simple() /** Instruction 1 */
            .content(helpArray[0])
                .action(helpArray[11])
                .hideDelay(15000)
                .highlightAction(false)
                .position($scope.getToastPosition());

            var _toast2 = $mdToast.simple() /** Instruction 2 */
            .content(helpArray[1])
                .action(helpArray[11])
                .hideDelay(15000)
                .highlightAction(false)
                .position($scope.getToastPosition());

            var _toast3 = $mdToast.simple() /** Instruction 3 */
            .content(helpArray[2])
                .action(helpArray[11])
                .hideDelay(15000)
                .highlightAction(false)
                .position($scope.getToastPosition());

            var _toast4 = $mdToast.simple() /** Instruction 4 */
            .content(helpArray[3])
                .action(helpArray[11])
                .hideDelay(15000)
                .highlightAction(false)
                .position($scope.getToastPosition());

            var _toast5 = $mdToast.simple() /** Instruction 5 */
            .content(helpArray[4])
                .action(helpArray[11])
                .hideDelay(15000)
                .highlightAction(false)
                .position($scope.getToastPosition());

            var _toast6 = $mdToast.simple() /** Instruction 6 */
            .content(helpArray[5])
                .action(helpArray[11])
                .hideDelay(15000)
                .highlightAction(false)
                .position($scope.getToastPosition());

            var _toast7 = $mdToast.simple() /** Instruction 7 */
            .content(helpArray[6])
                .action(helpArray[11])
                .hideDelay(15000)
                .highlightAction(false)
                .position($scope.getToastPosition());

            var _toast8 = $mdToast.simple() /** Instruction 8 */
            .content(helpArray[7])
                .action(helpArray[11])
                .hideDelay(15000)
                .highlightAction(false)
                .position($scope.getToastPosition());

             var _toast9 = $mdToast.simple() /** Instruction 9 */
            .content(helpArray[8])
                .action(helpArray[11])
                .hideDelay(15000)
                .highlightAction(false)
                .position($scope.getToastPosition());

            var _toast10 = $mdToast.simple() /** Instruction 10 */            
            .content(helpArray[9])
                .action(helpArray[11])
                .hideDelay(15000)
                .highlightAction(false)
                .position($scope.getToastPosition());

            var _toast11 = $mdToast.simple() /** Instruction 11 */
            .content(helpArray[10])
                .action(helpArray[12])
                .hideDelay(15000)
                .highlightAction(false)
                .position($scope.getToastPosition());   
   
            $mdToast.show(_toast1).then(function() { /** Instruction 1 */
                $mdToast.show(_toast2).then(function() { /** Instruction 2 */
                    $mdToast.show(_toast3).then(function() { /** Instruction 3 */
                        $mdToast.show(_toast4).then(function() { /** Instruction 4 */
                            $mdToast.show(_toast5).then(function() { /** Instruction 5 */
                                $mdToast.show(_toast6).then(function() { /** Instruction 6 */
                                    $mdToast.show(_toast7).then(function() { /** Instruction 7 */
                                        $mdToast.show(_toast8).then(function() { /** Instruction 8 */
                                            $mdToast.show(_toast9).then(function() { /** Instruction 9 */
                                                $mdToast.show(_toast10).then(function() { /** Instruction 10 */
                                                    $mdToast.show(_toast11).then(function() { /** Instruction 11 */
                                                       
                                                    });    
                                                });

                                            });
                                        });
                                    });
                                });
                            });
                         });
                    });
                });
             });
        };
        var self = this;
        self.selected = null;
        self.users = [];
        self.toggleList = toggleUsersList;
        $scope.showValue=true;/** Result toggle */
        $scope.focus_status=true;/** Focusing status */
        $scope.start_disabled=true;/** Start button disabled */
        $scope.switch_on_off=true;/** Switch on light */
        $scope.place_prism=true;/** Place prism */
        $scope.disabled_status=true;/** Disabled */
       // $scope.switch_disabled=true;
        $scope.goFullscreen = function() {
            /** Full screen */
            if (Fullscreen.isEnabled()) Fullscreen.cancel();
            else Fullscreen.all();
            /** Set Full screen to a specific element (bad practice) */
            /** Full screen.enable( document.getElementById('img') ) */
        };
        /** SideNav toggle  */
        $scope.toggle = function() {
            $scope.showValue = !$scope.showValue;
            $scope.isActive = !$scope.isActive;
        };
        $scope.toggle1 = function() {
            $scope.showVariables = !$scope.showVariables;
            $scope.isActive1 = !$scope.isActive1;
        }; 
        /** Function for focusing telescope */
        $scope.focusTelescope = function() {
            focusTelescopeFn($scope)/** Function defined in experiment.js file */
        } 
        /** Function for startinng experiment */
        $scope.startExperiment = function() {
            $scope.focus_status=!$scope.focus_status;
            startExperimentFn();/** Function defined in experiment.js file */
        }
        /** Function to switch on/off light  */
        $scope.switchOnOrOff= function(){
            $scope.switch_on_off =!$scope.switch_on_off;
            switchOnOrOffFn($scope);/** Function defined in experiment.js file */
        }          
        /** Function to adjust slit focus  */
        $scope.slitFocus = function() {
            slitFocusFn($scope)/** Function defined in experiment.js file */
        } 
        /** Function to adjust slit width  */
        $scope.slitWidth = function() {
            slitWidthFn($scope)/** Function defined in experiment.js file */
        } 
        /** Function to switch on/off light  */
        $scope.placePrism= function(){
            $scope.place_prism =! $scope.place_prism
            placePrismFn($scope);/** Function defined in experiment.js file */
        }          
        /** Function for rotating telescope  */
        $scope.telescopeRotate = function() {
            telescopeRotateFn($scope);/** Function defined in experiment.js file */
        }  
        /** Function for rotating vernier table  */
        $scope.verniertableRotate = function() {
            verniertableRotateFn($scope);/** Function defined in experiment.js file */
        } 
        /** Function for rotating telescope - Fine adjustment */
        $scope.telescopeFineRotate = function() {
            telescopeFineRotateFn($scope);/** Function defined in experiment.js file */
        } 
        /** Function for rotating vernier table - Fine adjustment */
        $scope.verniertableFineRotate = function() {
            verniertableFineRotateFn($scope);/** Function defined in experiment.js file */
        }        
        /** Click event function of the Reset button */
        $scope.resetFn = function() {
            reset($scope); /** Function defined in experiment.js file */
        }
        /**
         * First hide the bottom sheet IF visible, then
         * hide or Show the 'left' sideNav area
         */
        function toggleUsersList() {
            $mdSidenav('right').toggle();
        }
    }
})();