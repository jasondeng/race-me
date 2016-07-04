(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngMessages', 'ngSanitize'])
        .config(config)
        .run(run);

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'components/home/home.view.html',
                controller: 'HomeCtrl'
            })
            .when('/login', {
                templateUrl: 'components/login/login.view.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: 'components/register/register.view.html',
                controller: 'RegisterCtrl',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: 'components/about/about.view.html',
                controller: 'AboutCtrl',
                controllerAs: 'vm'
            })
            .when('/help', {
                templateUrl: 'components/help/help.view.html',
                controller: 'HelpCtrl',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo:'/'});
    }

    function run($http, $window) {
        if ($window.localStorage['token']) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $window.localStorage['token'];
        }
    }

})();