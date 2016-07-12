(function () {
    'use strict';

    angular
        .module('app')
        .service('charts', charts);

    charts.$inject = ['$http', '$window', '$location' ,'$auth'];
    function charts($http, $window, $location ,$auth) {

    }
})();
