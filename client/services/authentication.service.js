(function () {
    angular
        .module('app')
        .service('authentication', authentication);
    authentication.$inject = ['$http', '$window'];
    function authentication ($http, $window) {
        var saveToken = function (token) {
            $window.localStorage['token'] = token;
        };
        var getToken = function () {
            return $window.localStorage['token'];
        };

        register = function (user) {
            return $http.post('/register', user)
                .success(function (response) {
                    saveToken(response.token);
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
                });
        };

        login = function (user) {
            return $http.post('/login', user)
                .success(function (response) {
                    saveToken(response.token);
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
                });
        };

        logout = function () {
            $window.localStorage.removeItem('token');
            $http.defaults.headers.common.Authorization = '';
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
                    fullname : payload.fullname
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