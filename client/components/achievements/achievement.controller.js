(function () {
    'use strict';

    angular
        .module('app')
        .controller('AchievementCtrl', AchievementCtrl);

    AchievementCtrl.$inject = ['$scope','authentication'];
    function AchievementCtrl($scope, authentication) {
        var vm = this;

    }
}) ();
