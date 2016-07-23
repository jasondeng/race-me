(function () {
    'use strict';

    angular
        .module('app')
        .directive('loading', loading);

    function loading() {
        return {
            restrict: 'E',
            replace:true,
            templateUrl: '/components/loading/loading.view.html',
            link: function (scope, element, attr) {
                scope.$watch('loading', function (val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
            }
        }
    }
})();
