(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);

        LoginCtrl.$inject = ['$location','authentication'];
        function LoginCtrl($location, authentication) {
            var vm = this;

            vm.credentials = {
                username : "",
                password : ""
            };

            vm.onSubmit = function () {
                vm.formError = "";
                if (!vm.credentials.username || !vm.credentials.password) {
                    vm.formError = "All fields required, please try again";
                    return false;
                } else {
                    vm.doLogin();
                }
            };
            vm.doLogin = function() {
                vm.formError = "";
                authentication
                    .login(vm.credentials)
                    .error(function(err){
                        vm.formError.error = err;
                    })
                    .then(function() {
                        $location.path('/');
                    })
            }
        }
}) ();