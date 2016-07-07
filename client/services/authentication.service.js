(function () {
    'use strict';

    angular
        .module('app')
        .service('authentication', authentication);

        authentication.$inject = ['$http', '$window', '$location' ,'$auth', 'toastr'];
        function authentication ($http, $window, $location ,$auth, toastr) {

            var saveToken = function (token) {
                $window.localStorage['token'] = token;
            };

            var getToken = function () {
                if($window.localStorage['token'] !== undefined) {
                    return $window.localStorage['token'];
                }
                else if($window.localStorage['satellizer_token'] !== undefined) {
                    return $window.localStorage['satellizer_token'];
                }
            };

            var register = function (user) {
                return $http.post('/register', user)
                    .success(function (response) {
                        saveToken(response.token);
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
                    });
            };

            var login = function (user) {
                return $http.post('/login', user)
                    .success(function (response) {
                        saveToken(response.token);
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
                    });
            };

            var logout = function () {
                if ($auth.isAuthenticated()) {
                    $auth.logout()
                    .then(function() {
                        toastr.info('You have been logged out');
                        $location.path('/');
                    });
                }
                else {
                    $window.localStorage.removeItem('token');
                    // $window.localStorage.removeItem('satellizer_token');
                    // $window.localStorage.removeItem('google_state');
                    $http.defaults.headers.common.Authorization = '';
                }
            };

            var isLoggedIn = function () {
                var token = getToken();
                if (token) {
                    var payload = JSON.parse($window.atob(token.split('.')[1]));
                    return payload.exp > Date.now() / 1000;
                } else {
                    return false;
                }
            };

            var currentUser = function () {
                if (isLoggedIn()) {
                    var token = getToken();
                    var payload = JSON.parse($window.atob(token.split('.')[1]));
                    return {
                        username : payload.username,
                        fullname : payload.fullname,
                        first_name : payload.first_name
                    };
                }
            };

            return {
                saveToken : saveToken,
                getToken : getToken,
                register : register,
                login : login,
                logout : logout,
                isLoggedIn : isLoggedIn,
                currentUser : currentUser
            };
        }
})();
