(function () {
    angular
        .module('app')
        .directive('navigation', navigation);
    function navigation () {
        return {
            restrict: 'EA',
            templateUrl: '/directives/navigation.html',
            controller: 'navigationCtrl as navvm'
        };
    }
})();