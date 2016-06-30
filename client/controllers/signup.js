(function () {
    angular
        .module('app')
        .controller('SignupCtrl', SignupCtrl);
    SignupCtrl.$inject = ['$location', '$window', 'authentication'];
    function SignupCtrl($location, $window,authentication) {
        var vm = this;

        vm.credentials = {
            fullname : "",
            username : "",
            password : ""
        };

        vm.returnPage = $location.search().page || '/';

        vm.onSubmit = function () {
            vm.formError = "";
            if (!vm.credentials.fullname || !vm.credentials.username || !vm.credentials.password) {
                vm.formError = "All fields required, please try again.";
                return false;
            } else {
                vm.doRegister();
            }
        };

        vm.doRegister = function() {
            vm.formError = "";
            authentication
                .register(vm.credentials)
                .error(function(err){
                    vm.formError = err.error;
                })
                .then(function(){
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                });
        };
    }

})();