(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeCtrl', HomeCtrl);

        HomeCtrl.$inject = ['$scope', 'authentication'];
        function HomeCtrl($scope, authentication) {
            var vm = this;

            vm.isLoggedIn = authentication.isLoggedIn();

            $scope.currentUser = authentication.currentUser();

        }
}) ();
