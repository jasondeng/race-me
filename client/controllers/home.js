angular
    .module('app')
    .controller('HomeCtrl', HomeCtrl);
    HomeCtrl.$inject = ['$scope', 'authentication'];
    function HomeCtrl($scope, authentication) {
        var vm = this;

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentUser = authentication.currentUser();

    }

