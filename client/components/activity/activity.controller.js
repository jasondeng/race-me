(function () {
    'use strict';

    angular
        .module('app')
        .controller('ActivityLogCtrl', ActivityLogCtrl);

    ActivityLogCtrl.$inject = ['$scope', 'authentication', 'mailbox'];
    function ActivityLogCtrl($scope, authentication, mailbox) {
        var vm = this;

        $scope.currentUser = authentication.currentUser();

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.hasHealthData = authentication.hasHealthData();

        /*
         $scope.races = [{
         challenger: {
         username: "Alan",
         start: "7/26/2016",
         end: "7/27/2016",
         speed: "12",
         duration: "12",
         route: {
         origin: {
         lat: "40",
         lng: "51"
         },
         wayPoints: [[40, 41], [41, 42], [43, 44]],
         created: "7/12/2016"
         }
         },
         opponent: {
         username: "Satbir",
         start: "7/23/2016",
         end: "7/24/2016",
         speed: "13",
         duration: "14",
         route: {
         origin: {
         lat: "21",
         lng: "21"
         },
         wayPoints: [[40, 41], [41, 42], [43, 44]],
         created: "7/14/2016"
         }
         },
         status: "Open",
         winner: "Satbir",
         created: "7/16/2016"
         },
         {
         challenger: {
         username: "Jason",
         start: "7/26/2016",
         end: "7/27/2016",
         speed: "12",
         duration: "12",
         route: {
         origin: {
         lat: "40",
         lng: "51"
         },
         wayPoints: [[40, 41], [41, 42], [43, 44]],
         created: "7/12/2016"
         }
         },
         opponent: {
         username: "Cheng",
         start: "7/23/2016",
         end: "7/24/2016",
         speed: "13",
         duration: "14",
         route: {
         origin: {
         lat: "21",
         lng: "21"
         },
         wayPoints: [[40, 41], [41, 42], [43, 44]],
         created: "7/14/2016"
         }
         },
         status: "Open",
         winner: "Jason",
         created: "7/16/2016"
         }]*/

        vm.loadedData = false;
        if (vm.isLoggedIn && vm.hasHealthData) {
            $scope.loading = true;
            mailbox.getActivityData()
                .then(function (response) {
                    console.log(response.data);
                    vm.loadedData = true;
                    $scope.loading = false;
                    $scope.races = response.data;
                    return response.data;
                })
        }
    }
})();
