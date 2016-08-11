(function () {
    'use strict';

    angular
        .module('app')
        .service('mailbox', mailbox);

    mailbox.$inject = ['$http'];
    function mailbox($http) {
        var getActivityData = function () {
            return $http.get('/mailbox')
                .success(function (response) {
                    return response;
                });
        };

        return {
            getActivityData: getActivityData
        }


    }
})();

