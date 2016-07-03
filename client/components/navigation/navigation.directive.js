(function () {
    angular
        .module('app')
        .directive('navigation', navigation);
    function navigation () {
        return {
            restrict: 'EA',
            templateUrl: '/components/navigation/navigation.view.html',
            controller: 'navigationCtrl as navvm'
        };
    }
})();