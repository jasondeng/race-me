(function () {
    'use strict';

    angular
        .module('app')
        .controller('ActivityLogCtrl', ActivityLogCtrl);

    ActivityLogCtrl.$inject = ['$scope','authentication'];
    function ActivityLogCtrl($scope, authentication) {
        var vm = this;

    }
}) ();
