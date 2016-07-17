(function () {
    'use strict';

    angular
        .module('app')
        .directive('missingData', missingData);

    function missingData () {
        return {
            restrict: 'EA',
            templateUrl: '/components/no-data/no-data.view.html'
        };
    }
})();
