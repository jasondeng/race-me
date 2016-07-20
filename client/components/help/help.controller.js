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

            //USED TO SET THE Y POSITION OF HIGHCHART'S HEATMAP FOR THE YEAR
            $scope.yCounter = [4,4,4,4,4,4,4,4,4,4,4,4];

            $scope.timeChartData = [];
            $scope.lastActivity = [];
            $scope.getDataHC = function(result) {
                var Flights = result.health.totalFlightsForEachDayOfYear[result.health.totalFlightsForEachDayOfYear.length -1].split("-");
                var Steps = result.health.totalStepsForEachDayOfYear[result.health.totalStepsForEachDayOfYear.length-1].split("-");
                var WalkRun = result.health.totalWalkRunDistanceForEachDayOfYear[result.health.totalWalkRunDistanceForEachDayOfYear.length-1].split("-");

                $scope.lastActivity.push(Number(Flights[1]),Number(WalkRun[1]),Number(Steps[1]));

                for (var i = 0; i < result.health.totalStepsForEachDayOfYear.length; i++) {
                    var test = result.health.totalStepsForEachDayOfYear[i];

                    //SPLIT THE dataSplit[0] = MON NUM, YEAR AND dataSplit[1] = STEPS WALKED
                    var dataSplit = test.split("-");
                    //GET THE MONTH/DAY NAME FROM THE DATE
                    var currentDayHolder = dataSplit[0].split(",");

                    var dataMonth = currentDayHolder[0].slice(0,3);
                    var dataMonthDay = Number(currentDayHolder[0].slice(4,currentDayHolder[0].length));
                    var dayYear = Number(currentDayHolder[1]);

                    //STORE THE STEPS
                    var dataStep = Number(dataSplit[1]);

                    // GET THE X FOR CHART, GET THE Sunday to Monday OF DATE IN (0-6)
                    var dataDay = (new Date(dataSplit[0])).getDay();

                    //CONVERT THE CURRENT POSITION'S MONTH NAME INTO NUMBER
                    var dataMonthNumber = $scope.convertMonthNameToNumber(dataMonth);
                    //ONLY STORE INTO ARRAY IF ITS THE CURRENT YEAR AND DISPLAY

                    //Store data into timechart [Date, steps]
                    var holdDay = Date.parse(dataMonth + " " + dataMonthDay + ", " + dayYear);

                    $scope.timeChartData.push([holdDay,dataStep]);

                    if (dayYear === new Date().getFullYear())
                      $scope.storedData[dataMonth].push([dataDay,$scope.yCounter[dataMonthNumber],dataStep,dataMonthDay,dayYear]);

                    //DECREASE THE Y VALUE IF IT REACHES POSITION 6 OF X VALUE
                    if (dataDay === 6)
                      $scope.yCounter[dataMonthNumber] -= 1;
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
                                    },
                                    positioner: function () {
                                        return { x: 0, y: 250 };
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
                           maxColor: Highcharts.getOptions().colors[0]
                       }
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

            $scope.timeChart = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    tooltip: {
                        useHTML: true,
                        formatter: function() {
                          return '<b>' + Highcharts.dateFormat('%m/%d/%Y',this.x) + '</b> <center> <b>' + this.y + '</b> </center>';
                        }
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickInterval: 30 * 24 * 3600 * 1000,
                    labels: {
                        formatter: function() {
                            return Highcharts.dateFormat('%b %Y', this.value);
                        }
                    }
                },
                yAxis:{
                  type: 'logarithmic',
                  minorTickInterval: 1
                },
                series: [{
                    data: [{}]
                }],
                title: {
                    text: 'Hello'
                },
                loading: false
            };

            $scope.activityChart = {
                    options: {
                        chart: {
                            type: 'solidgauge',
                            marginTop: 50,
                            width: 500
                        },
                        tooltip: {
                            borderWidth: 0,
                            backgroundColor: 'none',
                            shadow: false,
                            style: {
                                fontSize: '16px'
                            },
                            pointFormat: '{series.name}<br><span style="color: {point.color}; font-weight: bold">{point.y}</span>',
                            positioner: function (labelWidth, labelHeight) {
                                return {
                                    x: 255 - labelWidth / 2,
                                    y: 180
                                };
                            }
                        },
                        pane: {
                            startAngle: 0,
                            endAngle: 360,
                            background: [{ // Track for Move
                                outerRadius: '112%',
                                innerRadius: '88%',
                                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
                                borderWidth: 0
                            }, { // Track for Exercise
                                outerRadius: '87%',
                                innerRadius: '63%',
                                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0.3).get(),
                                borderWidth: 0
                            }, { // Track for Stand
                                outerRadius: '62%',
                                innerRadius: '38%',
                                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[3]).setOpacity(0.3).get(),
                                borderWidth: 0
                            }]
                        },
                        plotOptions: {
                            solidgauge: {
                                borderWidth: '34px',
                                dataLabels: {
                                    enabled: false
                                },
                                linecap: 'round',
                                stickyTracking: false
                            }
                        },
                    },
                    title: {
                        text: 'Activity',
                        style: {
                            fontSize: '24px'
                        }
                    },
                    yAxis: {
                        min: 0,
                        // max: 100,
                        lineWidth: 0,
                        tickPositions: []
                    },
                    series: [{
                        name: 'Steps',
                        borderColor: Highcharts.getOptions().colors[0],
                        data: [{
                            color: Highcharts.getOptions().colors[0],
                            radius: '100%',
                            innerRadius: '100%'
                        }]
                    }, {
                        name: 'WalkRun',
                        borderColor: Highcharts.getOptions().colors[2],
                        data: [{
                            color: Highcharts.getOptions().colors[2],
                            radius: '75%',
                            innerRadius: '75%'
                        }]
                    }, {
                        name: 'Flights',
                        borderColor: Highcharts.getOptions().colors[3],
                        data: [{
                            color: Highcharts.getOptions().colors[3],
                            radius: '50%',
                            innerRadius: '50%'
                        }]
                    }],
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

                    Highcharts.setOptions({
                        lang: {
                            thousandsSep: ','
                        }
                    });

                    $scope.highchartsNG.series[0].data = $scope.storedData[selectedMonthName];
                    $scope.timeChart.series[0].data = $scope.timeChartData;

                    $scope.activityChart.yAxis.max = $scope.lastActivity[2] + $scope.lastActivity[1] + $scope.lastActivity[0];

                    $scope.activityChart.series[0].data = [$scope.lastActivity[2]];
                    $scope.activityChart.series[1].data = [$scope.lastActivity[1]];
                    $scope.activityChart.series[2].data = [$scope.lastActivity[0]];
                });
        }
}) ();
