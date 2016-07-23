(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterCtrl', RegisterCtrl);

        RegisterCtrl.$inject = ['$location', 'authentication','$route'];
        function RegisterCtrl($location,authentication, $route) {
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
                        toastr.error('Something went wrong!', 'Error');
                    })
                    .then(function(){
                        $route.reload();
                        $location.path('/');
                        toastr.success('You have successfully signed!','Success');
                    });
            };

            vm.oauth2 = function(provider) {
                authentication.oauth2(provider);
            };
        }
})();
