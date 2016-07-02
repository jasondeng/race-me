(function () {
    angular
        .module('app')
        .controller('navigationCtrl', navigationCtrl);
    navigationCtrl.$inject = ['$location', 'authentication'];
    function navigationCtrl($location, authentication) {
        var vm = this;
        vm.currentPath = $location.path();
    }
})();