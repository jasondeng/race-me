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
                        console.log(err);
                        vm.formError.error = err;
                    })
                    .then(function() {
                        $location.path('/');
                    })
            };
            $scope.authenticate = function(provider) {
                $auth.authenticate(provider)
                    .then(function() {
                    toastr.success('You have successfully signed in with ' + provider + '!');
                    $location.path('/');
                    })
                    .catch(function(error) {
                    if (error.error) {
                        // Popup error - invalid redirect_uri, pressed cancel button, etc.
                        toastr.error(error.error);
                    } else if (error.data) {
                        // HTTP response error from server
                        toastr.error(error.data.message, error.status);
                    } else {
                        toastr.error(error);
                    }
                    });
                };
        }
}) ();
