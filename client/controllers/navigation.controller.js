(function () {
    angular
        .module('app')
        .controller('navigationCtrl', navigationCtrl);
    navigationCtrl.$inject = ['$route','$location', 'authentication'];
    function navigationCtrl($route, $location, authentication) {
        var navvm = this;

        navvm.currentPath = $location.path();

        navvm.isLoggedIn = authentication.isLoggedIn();

        navvm.currentUser = authentication.currentUser();
        navvm.logout = function() {
            authentication.logout();
            $location.path('/');
            $route.reload();
        };
    }
})();