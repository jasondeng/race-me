(function () {
    'use strict';

    angular
        .module('app')
        .service('charts', charts);

    charts.$inject = ['$http'];
    function charts($http) {

        var getHealthData = function (response) {
            return $http.get('/profile')
                .success(function (response) {
                    return response;
                });
        };

        return {
            getHealthData: getHealthData
        };
    }
})();
