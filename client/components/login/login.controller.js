(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);

        LoginCtrl.$inject = ['$location','authentication', '$scope', 'toastr', '$auth'];
        function LoginCtrl($location, authentication, $scope, toastr, $auth) {
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
                        vm.formError = err;
                    })
                    .then(function() {
                        $location.path('/');
                    })
            };
            vm.oauth2 = function(provider) {
                authentication.oauth2(provider);
            };
        }
}) ();
