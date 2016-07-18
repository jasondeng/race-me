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

            // Not used
            // $scope.getDaysinMonth = function (month){
            //     var year = new Date().getFullYear();
            //     return new Date(year, month, 0).getDate();
            // };

            //GET CURRENT MONTH NUMBER FOR DEFAULT CHART MONTH
            $scope.currentMonth = new Date().getMonth();

            //GET CURRENT DATE TO DISPLAY ON PANEL
            $scope.current = {
                currentDate:{date: new Date().toDateString()}
            };

            //A FORM SELECTION SO USER CAN CHANGE BETWEEN MONTH
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

            $scope.storedData = {
                Jan: [],
                Feb: [],
                Mar: [],
                Apr: [],
                May: [],
                Jun: [],
                Jul: [],
                Aug: [],
                Sep: [],
                Oct: [],
                Nov: [],
                Dec: []
            };
            $scope.yCounter = [4,4,4,4,4,4,4,4,4,4,4,4];

            $scope.getDataHC = function(result) {
                for (var i = 0; i < result.health.totalStepsForEachDayOfYear.length -1 && i < 365; i++) {
                    var test = result.health.totalStepsForEachDayOfYear[i];

                    //SPLIT THE dataSplit[0] = MON NUM, YEAR AND dataSplit[1] = STEPS WALKED
                    var dataSplit = test.split("-");

                    //GET THE MONTH/DAY NAME FROM THE DATE
                    var currentDayHolder = dataSplit[0].split(",");

                    //
                    var dataMonth = currentDayHolder[0].slice(0,3);
                    var dataMonthDay = Number(currentDayHolder[0].slice(4,currentDayHolder[0].length));
                    var dayYear = Number(currentDayHolder[1]);

                    //STORE THE STEPS
                    var dataStep = Number(dataSplit[1]);

                    // GET THE X FOR CHART, GET THE Sunday to Monday OF DATE IN (0-6)
                    var dataDay = (new Date(dataSplit[0])).getDay();

                    var dataMonthNumber = $scope.convertMonthNameToNumber(dataMonth);
                    $scope.storedData[dataMonth].push([dataDay,$scope.yCounter[dataMonthNumber],dataStep,dataMonthDay,dayYear]);

                    if (dataDay === 6) {
                        $scope.yCounter[dataMonthNumber] -= 1;
                    }

                }
            };

            $scope.highchartsNG = {
                options: {
                       plotOptions: {
                            heatmap: {
                                tooltip:{
                                    useHTML: true,
                                    headerFormat: 'Daily Step <br>',
                                    pointFormatter: function () {
                                        return "<strong>" + this.value + "</strong>";
                                    }
                                },
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    useHTML: true,
                                    formatter: function () {
                                        return "<center>" + $scope.highchartsNG.series[0].data[this.series.data.indexOf( this.point )][3] + "</center>" + this.point.value;
                                    }
                                }
                            }
                       },
                       legend: {
                           align: 'right',
                           layout: 'vertical',
                           verticalAlign: 'top',
                           y: 25,
                           symbolHeight: 280
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
                               maxColor: Highcharts.getOptions().colors[7]
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

            //USED TO STORED DATA GOTTEN FROM HTTP GET REQUEST
            $scope.resultData = [];

            $scope.update = function () {
                var selectedMonthNumber = $scope.data.selectedMonth.id;
                var selectedMonthName = $scope.convertNumberToMonth(selectedMonthNumber);

                $scope.highchartsNG.series[0].data = $scope.storedData[selectedMonthName];
            };

            $http.get('/profile')
                .success(function (result){
                    $scope.resultData = result;

                    $scope.getDataHC($scope.resultData);

                    var selectedMonthNumber = $scope.data.selectedMonth.id;
                    var selectedMonthName = $scope.convertNumberToMonth(selectedMonthNumber);

                    $scope.highchartsNG.series[0].data = $scope.storedData[selectedMonthName];
                });
        }
}) ();
