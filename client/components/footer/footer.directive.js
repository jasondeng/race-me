(function () {
    'use strict';

    angular
        .module('app')
        .directive('footerGeneric', footerGeneric);
    
        function footerGeneric () {
            return {
                templateUrl: '/components/footer/footer.view.html',
                restrict: 'EA'
        };
    }
})();