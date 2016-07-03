(function () {
    angular
        .module('app')
        .directive('footerGeneric', footerGeneric);
    function footerGeneric () {
        return {
            restrict: 'EA',
            templateUrl: '/components/footer/footer.view.html'
    };
    }
})();