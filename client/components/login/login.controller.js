(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);

        LoginCtrl.$inject = ['$location','authentication', '$scope', 'toastr', '$auth', '$route'];
        function LoginCtrl($location, authentication, $scope, toastr, $auth, $route ) {
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
                        toastr.error('Something went wrong!', 'Error');
                    })
                    .then(function() {
                        $route.reload();
                        $location.path('/');
                        toastr.success('You have successfully signed!','Success');
                    })
            };
            vm.oauth2 = function(provider) {
                authentication.oauth2(provider);
            };
        }
}) ();
