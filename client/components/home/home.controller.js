(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeCtrl', HomeCtrl);

        HomeCtrl.$inject = ['$scope', 'authentication'];
        function HomeCtrl($scope, authentication) {
            var vm = this;

            vm.isLoggedIn = authentication.isLoggedIn();
            
            vm.hasHealthData = authentication.hasHealthData();

            $scope.currentUser = authentication.currentUser();

        }
}) ();
