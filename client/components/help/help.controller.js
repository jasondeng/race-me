// function convertMonthNameToNumber(monthName) {
//     var myDate = new Date(monthName + " 1, 2000");
//     var monthDigit = myDate.getMonth();
//     return isNaN(monthDigit) ? 0 : (monthDigit + 1);
// }

// function convertNumberToMonth(monthNumber) {
//     var month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//     return month[monthNumber - 1];
// }


(function () {
    'use strict';

    angular
        .module('app')
        .controller('HelpCtrl', HelpCtrl);

        HelpCtrl.$inject = ['$scope','authentication','$log','$http'];
        function HelpCtrl($scope, authentication ,$log , $http) {
            $scope.convertNumberToMonth = function (monthNumber){
                var month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                return month[monthNumber - 1];
            };

            $scope.convertMonthNameToNumber = function (monthName){
                var myDate = new Date(monthName + " 1, 2000");
                var monthDigit = myDate.getMonth();
                return isNaN(monthDigit) ? 0 : (monthDigit + 1);
            };

            // $scope.getDaysinMonth = function (month,year){
            //     var date = new Date(year, month, 1);
            //     var days  = [];
            //
            //     while(date.getMonth() === month){
            //         days.push(new Date(date));
            //         date.setDate(date.getDate() + 1);
            //     }
            //     console.log(days[1]);
            // };


            $http.get('/profile')
                .success(function (result){
                    Highcharts.setOptions({
                        lang: {
                            thousandsSep: ','
                        }
                    });
                    $scope.highchartsNG = {
                        options: {
                                   chart: {
                                       type: 'heatmap',
                                       marginTop: 40,
                                       marginBottom: 80
                                   },
                                   colorAxis: {
                                       min: 0,
                                       minColor: '#FFFFFF',
                                       maxColor: Highcharts.getOptions().colors[0]
                                   }
                               },

                               tooltip: {
                                   formatter: function () {
                                       return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                                           this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
                                   }
                               },

                               title: {
                                   text: 'Sales per employee per weekday'
                               },

                               xAxis: {
                                   categories: ['S','M', 'T', 'W', 'Th', 'F', 'S']
                               },

                               yAxis: {
                                   categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon', 'Anna', 'Tim', 'Laura'],
                                   title: null
                               },
                               legend: {
                                   align: 'right',
                                   layout: 'vertical',
                                   margin: 0,
                                   verticalAlign: 'top',
                                   y: 25,
                                   symbolHeight: 280
                               },

                               series: [{
                                   name: 'Sales per employee',
                                   borderWidth: 1,
                                   data: function() {
                                    //    $scope.getDaysinMonth(5,1994);
                                    //     var dataArr =[];
                                            // $scope.getDaysinMonth(5,1994);
                                    //     }
                                    // return dataArr;
                               }(),
                                   dataLabels: {
                                       enabled: true,
                                       color: '#000000'
                                   }
                               }],
                        credits: {
                          enabled: false
                        },
                        loading: false
                    };
                    $log.log(result);
                });
        }
}) ();
