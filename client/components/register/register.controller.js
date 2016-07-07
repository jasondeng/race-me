(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterCtrl', RegisterCtrl);

        RegisterCtrl.$inject = ['$location', '$window', 'authentication'];
        function RegisterCtrl($location, $window,authentication) {
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
                        $location.path('/');
                    });
            };

            vm.oauth2 = function(provider) {
                authentication.oauth2(provider);
            };
        }
})();
