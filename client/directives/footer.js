(function () {
    angular
        .module('app')
        .directive('footerGeneric', footerGeneric);
    function footerGeneric () {
        return {
            restrict: 'EA',
            templateUrl: '/directives/footer.html'
    };
    }
})();