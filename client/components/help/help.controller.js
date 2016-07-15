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
                return month[monthNumber];
            };

            $scope.convertMonthNameToNumber = function (monthName){
                var myDate = new Date(monthName + " 1, 2000");
                var monthDigit = myDate.getMonth();
                // return isNaN(monthDigit) ? 0 : (monthDigit + 1);
                return isNaN(monthDigit) ? 0 : (monthDigit);
            };

            $scope.getDaysinMonth = function (month){
                var year = new Date().getYear();
                return new Date(year, month, 0).getDate();
            };

            $scope.currentMonth = new Date().getMonth();

            $scope.data = {
            availableMonth: [
              {id: '0', name: 'January'},
              {id: '1', name: 'February'},
              {id: '2', name: 'March'},
              {id: '3', name: 'April'},
              {id: '4', name: 'May'},
              {id: '5', name: 'June'},
              {id: '6', name: 'July'},
              {id: '7', name: 'August'},
              {id: '8', name: 'September'},
              {id: '9', name: 'October'},
              {id: '10', name: 'November'},
              {id: '11', name: 'December'}
            ],
            selectedMonth: {id: $scope.currentMonth} //This sets the default value of the select in the ui
            };

            $scope.dataCounter = 4;

            $scope.getDataHC = function(result, selectedMonthName) {
                var dataArr = [];
                var dataCounter = 4;
                for (var i = 0; i < result.health.totalStepsForEachDayOfYear.length; i++) {
                    var test = result.health.totalStepsForEachDayOfYear[i];

                    var dataSplit = test.split("-");
                    var dataMonth = dataSplit[0].slice(0,3);
                    var dataStep = dataSplit[1];

                    // ///////////
                    // X 0-6 = Sunday to Monday
                    var dataDay = (new Date(dataSplit[0])).getDay();
                    //
                    //     dataSplit[0] = Number(dataDay);
                    //  //    console.log(dataSplit[0]);
                    //     //Y Month Number
                    //     dataSplit[1] = $scope.convertMonthNameToNumber(dataMonth);
                    //     // Z Daily Steps
                    //     dataSplit[2] = Number(dataStep);
                    //  //    console.log(dataSplit[2]);
                    //     $scope.dataArr.push(dataSplit);

                        // ////////////////////////////////////////////////

                    if (dataMonth === selectedMonthName){
                        //X
                        console.log();
                        dataSplit[0] = Number(dataDay);
                     //    console.log(dataSplit[0]);
                        //Y
                     //    dataSplit[1] = $scope.convertMonthNameToNumber(dataMonth);
                     //    console.log(dataSplit[1]);
                        //Z
                        dataSplit[1] = dataCounter;

                        if (dataSplit[0] === 6){
                            dataCounter -= 1;
                        }
                        dataSplit[2] = Number(dataStep);
                     //    console.log(dataSplit[2]);
                        dataArr.push(dataSplit);
                    }
                }
                return dataArr;
            };

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
                           data: [{}],
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


            $scope.resultData = [];


            $scope.update = function () {
                var selectedMonthNumber = $scope.data.selectedMonth.id;
                var selectedMonthName = $scope.convertNumberToMonth(selectedMonthNumber);

                var dataArr = $scope.getDataHC($scope.resultData, selectedMonthName);

                $scope.highchartsNG.series[0].data = dataArr;
            };

            $http.get('/profile')
                .success(function (result){
                    $scope.resultData = result;
                    var selectedMonthNumber = $scope.data.selectedMonth.id;
                    var selectedMonthName = $scope.convertNumberToMonth(selectedMonthNumber);

                    var dataArr = $scope.getDataHC(result,selectedMonthName);

                    $scope.highchartsNG.series[0].data = dataArr;
                });


        }
}) ();
