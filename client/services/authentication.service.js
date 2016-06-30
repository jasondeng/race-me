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
            return $http.post('/register', user).success(function (data) {
                saveToken(data.token);
            });
        };

        login = function (user) {
            return $http.post('/login', user).success(function (data) {
                saveToken(data.token);
            });
        };

        logout = function () {
            $window.localStorage.removeItem('token');
        };

        var isLoggedIn = function () {
            var token = getToken();
            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                // TODO EXP DATE
                return true;
            } else {
                return false;
            }
        };

        var currentUser = function () {
            if (isLoggedIn()) {
                var token = getToken();
                console.log(token);

                var payload = JSON.parse($window.atob(token.split('.')[1]));
                console.log(payload);
                return {
                    username : payload.username,
                    fullname : payload.fullname
                };
            }
        };

        return {
            currentUser : currentUser,
            saveToken : saveToken,
            getToken : getToken,
            isLoggedIn : isLoggedIn,
            register : register,
            login : login,
            logout : logout
        };
    }

})();