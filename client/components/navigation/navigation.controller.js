(function () {
    'use strict';

    angular
        .module('app')
        .controller('navigationCtrl', navigationCtrl);

        navigationCtrl.$inject = ['$route','$location', '$scope', 'authentication'];
        function navigationCtrl($route, $location, $scope, authentication) {
            var navvm = this;

            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };

            navvm.currentPath = $location.path();

            navvm.isLoggedIn = authentication.isLoggedIn();

            navvm.currentUser = authentication.currentUser();

            navvm.hasHealthData = authentication.hasHealthData();

            navvm.hasHealth = false;
            authentication.checkHealth().then(function(data) {
                if(data) {
                  navvm.hasHealth = data.health;
                }
            });

            navvm.logout = function() {
                authentication.logout();
                $location.path('/');
                $route.reload();
            };
        }
})();
