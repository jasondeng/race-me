(function () {
    'use strict';

    angular
        .module('app')
        .controller('HelpCtrl', HelpCtrl);

    HelpCtrl.$inject = ['$scope', 'authentication', '$log', '$http'];
    function HelpCtrl($scope, authentication, $log, $http) {
        var vm = this;

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.hasHealthData = authentication.hasHealthData();

        $scope.currentUser = authentication.currentUser();

        $scope.oneAtATime = true;

    }
})();
