(function () {
    'use strict';

    angular
        .module('app')
        .controller('SocialCtrl', SocialCtrl);

    SocialCtrl.$inject = ['$scope','authentication'];
    function SocialCtrl($scope, authentication) {
        var vm = this;

    }
}) ();
