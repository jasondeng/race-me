(function () {
    'use strict';

    angular
        .module('app')
        .controller('HelpCtrl', HelpCtrl);

        HelpCtrl.$inject = ['$scope','authentication'];
        function HelpCtrl($scope, authentication) {
            var vm = this;

        }
}) ();