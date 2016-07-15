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

            // $scope.currentMonth = function () {
            //     var date = new Date().getMonth();
            //     return $scope.convertNumberToMonth(date);
            // };
            $scope.currentMonth = new Date().getMonth();

            $scope.current = {
                currentDate:{date: new Date().toDateString()}
            };

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

            // $scope.data = {
            //     availableMonth: [
            //       {name: 'Jan'},
            //       {name: 'Feb'},
            //       {name: 'Mar'},
            //       {name: 'Apr'},
            //       {name: 'May'},
            //       {name: 'Jun'},
            //       {name: 'Jul'},
            //       {name: 'Aug'},
            //       {name: 'Sep'},
            //       {name: 'Oct'},
            //       {name: 'Nov'},
            //       {name: 'Dec'}
            //     ],
            //     selectedMonth: {name: $scope.currentMonth()} //This sets the default value of the select in the ui
            // };

            $scope.dataCounter = 4;
            $scope.dataArr = [];
            $scope.dayValue = [];

            $scope.getDataHC = function(result, selectedMonthName) {
                $scope.dataArr = [];
                var dataCounter = 4;

                for (var i = 0; i < result.health.totalStepsForEachDayOfYear.length -1; i++) {
                    var test = result.health.totalStepsForEachDayOfYear[i];

                    var dataSplit = test.split("-");
                    var dataMonth = dataSplit[0].slice(0,3);
                    var dataStep = dataSplit[1];

                    var currentDayHolder = dataSplit[0].split(",");

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

                    if (dataMonth === selectedMonthName && dataDay !== undefined){
                        $scope.dayValue.push(currentDayHolder[0].slice(4));
                        //X
                        dataSplit[0] = dataDay;
                     //    console.log(dataSplit[0]);
                        //Y
                     //    dataSplit[1] = $scope.convertMonthNameToNumber(dataMonth);
                     //    console.log(dataSplit[1]);
                        //Y
                        dataSplit[1] = dataCounter;

                        if (dataSplit[0] === 6){
                            dataCounter -= 1;
                        }

                        //Value
                        dataSplit[2] = Number(dataStep);
                     //    console.log(dataSplit[2]);
                        $scope.dataArr.push(dataSplit);
                    }

                }
                return $scope.dataArr;
            };

            $scope.getDataLabel = function (x,y) {
                for (var i = 0; i < $scope.dataArr.length; i++) {
                    if (x === $scope.dataArr[i][0] && y === $scope.dataArr[i][1])
                        return $scope.dataArr[i][3];
                }
            };

            $scope.highchartsNG = {
                options: {
                       plotOptions: {
                            heatmap: {
                                tooltip:{
                                    useHTML: true,
                                    headerFormat: 'Daily Step: ',
                                    pointFormatter: function () {
                                        return "<strong>" + this.value + "</strong>";
                                    }
                                },
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    useHTML: true,
                                    formatter: function () {
                                        return "<center>" + $scope.dayValue.shift() + "</center>" + this.point.value;
                                    }
                                }
                            }
                       },
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
                          enabled: false
                       },
                       title: {
                           text: ''
                       },
                       xAxis: {
                           opposite: true,
                           categories: ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                       },
                       yAxis: {
                           gridLineWidth: 0,
                           labels: {
                               enabled: false
                           },
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
                           name: 'Daily Step',
                           borderWidth: 1,
                           data: [{}],
                       }],
                credits: {
                  enabled: false
                },
                loading: false
            };


            $scope.resultData = [];

            $scope.update = function () {
                // var selectedMonthName = $scope.data.selectedMonth.name;
                var selectedMonthNumber = $scope.data.selectedMonth.id;
                var selectedMonthName = $scope.convertNumberToMonth(selectedMonthNumber);

                var dataArr = $scope.getDataHC($scope.resultData, selectedMonthName);

                $scope.highchartsNG.series[0].data = dataArr;
            };

            $http.get('/profile')
                .success(function (result){
                    $scope.resultData = result;
                    // var selectedMonthName = $scope.data.selectedMonth.name;
                    var selectedMonthNumber = $scope.data.selectedMonth.id;
                    var selectedMonthName = $scope.convertNumberToMonth(selectedMonthNumber);


                    var dataArr = $scope.getDataHC(result,selectedMonthName);

                    $scope.highchartsNG.series[0].data = dataArr;
                });


        }
}) ();
