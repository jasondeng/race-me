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

            $scope.getDaysinMonth = function (month,year){
                 return new Date(year, month, 0).getDate();
            };

            $scope.dataCounter = 4;

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
                                       marginTop: 70,
                                       marginBottom: 80,
                                       width: 500
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
                                   text: 'Steps per day'
                               },

                               xAxis: {
                                   opposite: true,
                                   categories: ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                               },

                               yAxis: {
                                   categories: ['Week 4','Week 3','Week 2','Week 1','Week 0',],
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
                                       var dataArr =[];
                                       for (var i = 0; i < result.health.totalStepsForEachDayOfYear.length; i++) {
                                           var test = result.health.totalStepsForEachDayOfYear[i];

                                           var dataSplit = test.split("-");
                                           var dataMonth = dataSplit[0].slice(0,3);
                                           var dataStep = dataSplit[1];

                                           var dataDay = (new Date(dataSplit[0])).getDay();
                                           if (dataMonth === 'May'){
                                               //X
                                               dataSplit[0] = Number(dataDay);
                                               console.log(dataSplit[0]);
                                               //Y
                                            //    dataSplit[1] = $scope.convertMonthNameToNumber(dataMonth);
                                               console.log(dataSplit[1]);
                                               //Z
                                               dataSplit[1] = $scope.dataCounter;

                                               if (dataSplit[0] === 6){
                                                   $scope.dataCounter -= 1;
                                               }
                                               dataSplit[2] = Number(dataStep);
                                               console.log(dataSplit[2]);
                                               dataArr.push(dataSplit);
                                           }
                                       }
                                       return dataArr;
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
                });
        }
}) ();
