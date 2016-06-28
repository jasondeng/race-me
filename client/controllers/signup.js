(function () {
    angular
        .module('app')
        .controller('SignupCtrl', SignupCtrl);
    SignupCtrl.$inject = ['$location', '$window', 'authentication'];
    function SignupCtrl($location, $window,authentication) {
        var vm = this;

        vm.credentials = {
            name : "",
            email : "",
            password : ""
        };

        vm.onSubmit = function () {
            vm.doRegister();
        };

        vm.doRegister = function() {
            authentication
                .register(vm.credentials)
                .error(function(err){
                    console.log('Error = ' + err);
                })
                .then(function(){
                    var token = authentication.getToken();
                    console.log('Token = ' + token);

                    //var base64Url = token.split('.')[1];
                    //var base64 = base64Url.replace('-', '+').replace('_', '/');
                    //var payload =  JSON.parse($window.atob(base64));
                    var payload = JSON.parse($window.atob(token.split('.')[1]));
                    console.log('payload = ' + payload);
                    console.log('payload.name = ' + payload.username);
                    return {
                        name : payload.username
                    };

                });
        };
    }

})();