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
        vm.doLogin();
    };
    vm.doLogin = function() {
        authentication
            .login(vm.credentials)
            .error(function(err){
                console.log(err);
            })
            .then(function() {
                console.log('login success')
            })
    }
}