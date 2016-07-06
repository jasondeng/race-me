(function () {
    'use strict';

    angular
        .module('app')
        .controller('GearCtrl', GearCtrl);

    GearCtrl.$inject = ['$scope','authentication'];
    function GearCtrl($scope, authentication) {
        var vm = this;

    }
}) ();
