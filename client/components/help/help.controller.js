(function () {
    'use strict';

    angular
        .module('app')
        .controller('HelpCtrl', HelpCtrl);

    HelpCtrl.$inject = ['$scope', 'authentication', '$log', '$http'];
    function HelpCtrl($scope, authentication, $log, $http) {

        $scope.convertNumberToMonth = function (monthNumber) {
            var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return month[monthNumber];
        };

        $scope.convertMonthNameToNumber = function (monthName) {
            var myDate = new Date(monthName + " 1, 2000");
            var monthDigit = myDate.getMonth();
            // return isNaN(monthDigit) ? 0 : (monthDigit + 1);
            return isNaN(monthDigit) ? 0 : (monthDigit);
        };

        //GET CURRENT MONTH NUMBER FOR DEFAULT CHART MONTH
        $scope.currentMonth = new Date().getMonth();

        //GET CURRENT DATE TO DISPLAY ON PANEL
        $scope.current = {
            currentDate: {date: new Date().toDateString()}
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

        $scope.getDaysinMonth = function (month, year) {
            return new Date(year, month, 0).getDate();
        };

        $scope.timeChartData = [];
        $scope.lastActivity = [];
        $scope.getDataHC = function (result) {

            var Flights = result.health.totalFlightsForEachDayOfYear[result.health.totalFlightsForEachDayOfYear.length - 1].split("-");
            var Steps = result.health.totalStepsForEachDayOfYear[result.health.totalStepsForEachDayOfYear.length - 1].split("-");
            var WalkRun = result.health.totalWalkRunDistanceForEachDayOfYear[result.health.totalWalkRunDistanceForEachDayOfYear.length - 1].split("-");

            //STORE INTO ARRAY FOR Activity CHART
            $scope.lastActivity.push(Number(Flights[1]), Number(WalkRun[1]), Number(Steps[1]));

            //GET CURRENT YEAR
            var year = new Date().getFullYear();

            //CREATE CALENDAR FOR HEATMAP
            for (let i = 1; i < 13; i++) {
                var counter = 5;

                var dayNumbers = $scope.getDaysinMonth(i, year);

                for (let j = 1; j < dayNumbers + 1; j++) {
                    var day = i + " " + j + ", " + year;
                    var dataDay = (new Date(day).getDay());

                    var monthName = $scope.convertNumberToMonth(i - 1);
                    $scope.storedData[monthName].push([dataDay, counter, 0, j, year]);
                    if (dataDay === 6)
                        counter -= 1;
                }
            }

            //UPDATE CALENDAR VALUE STEPS
            for (let i = 0; i < result.health.totalStepsForEachDayOfYear.length; i++) {
                var dataSplit = result.health.totalStepsForEachDayOfYear[i].split("-");
                var currentDayHolder = dataSplit[0].split(",");
                //currentHolder[0] = Month Name currentHolder[1] = Month Day Number
                var currentHolder = currentDayHolder[0].split(" ");

                //Store data into timechart [Date, steps]
                var holdDay = Date.parse(currentHolder[0] + " " + currentHolder[1] + ", " + currentDayHolder[1]);
                $scope.timeChartData.push([holdDay, Number(dataSplit[1])]);

                if ($scope.storedData[currentHolder[0]][Number(currentHolder[1])] !== undefined && year === Number(currentDayHolder[1]))
                    $scope.storedData[currentHolder[0]][Number(currentHolder[1])].splice(2, 1, Number(dataSplit[1]));
            }

        };

        $scope.highchartsNG = {
            options: {
                tooltip: {
                    style: {
                        fontSize: '16px'
                    },
                    useHTML: true,
                    formatter: function () {
                        return "<strong>" + this.point.value + "</strong> Steps";
                    },
                },
                plotOptions: {
                    heatmap: {
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            formatter: function () {
                                // return "<center>" + $scope.highchartsNG.series[0].data[this.series.data.indexOf( this.point )][3] + "</center>" + this.point.value;
                                return $scope.highchartsNG.series[0].data[this.series.data.indexOf(this.point)][3];
                            }
                        }
                    }
                },
                legend: {
                    title: {
                        text: 'Steps'
                    },
                    align: 'right',
                    layout: 'vertical',
                    verticalAlign: 'top',
                    y: 20,
                    symbolHeight: 260
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
                text: "UserName's " + $scope.data.availableMonth[$scope.data.selectedMonth.id].name + " Steps"
            },
            xAxis: {
                opposite: true,
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
                data: [],
            }],
            credits: {
                enabled: false
            },
            loading: false
        };

        $scope.timeChart = {
            options: {
                chart: {
                    type: 'spline'
                },
                tooltip: {
                    useHTML: true,
                    formatter: function () {
                        return '<b>' + Highcharts.dateFormat('%m/%d/%Y', this.x) + '</b> <center> <b>' + this.y + '</b> </center>';
                    }
                }
            },
            xAxis: {
                type: 'datetime',
                tickInterval: 30 * 24 * 3600 * 1000,
                labels: {
                    formatter: function () {
                        return Highcharts.dateFormat('%b %Y', this.value);
                    }
                }
            },
            yAxis: {
                type: 'logarithmic',
                minorTickInterval: 1
            },
            series: [{
                data: []
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
                    // '{series.name}<br><span style="color: {point.color}; font-weight: bold">{value}</span>'
                    pointFormatter: function () {
                        return this.series.name + '<br><span style="color:' + this.color + '; font-weight: bold">' + this.series.yData + '</span>';
                    },
                    positioner: function (labelWidth) {
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
                        backgroundColor: Highcharts.Color('#B38867').setOpacity(0.3).get(),
                        borderWidth: 0
                    }, { // Track for Exercise
                        outerRadius: '87%',
                        innerRadius: '63%',
                        backgroundColor: Highcharts.Color('#DDBC95').setOpacity(0.3).get(),
                        borderWidth: 0
                    }, { // Track for Stand
                        outerRadius: '62%',
                        innerRadius: '38%',
                        backgroundColor: Highcharts.Color('#CDCDC0').setOpacity(0.3).get(),
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
                text: "Yesterday's Activity"
            },
            yAxis: {
                min: 0,
                // max: 100,
                lineWidth: 0,
                tickPositions: []
            },
            series: [{
                name: 'Steps',
                borderColor: '#B38867',
                data: [{
                    color: '#B38867',
                    radius: '100%',
                    innerRadius: '100%'
                }]
            }, {
                name: 'WalkRun',
                borderColor: '#DDBC95',
                data: [{
                    color: '#DDBC95',
                    radius: '75%',
                    innerRadius: '75%'
                }]
            }, {
                name: 'Flights',
                borderColor: '#CDCDC0',
                data: [{
                    color: '#CDCDC0',
                    radius: '50%',
                    innerRadius: '50%'
                }]
            }],
        };

        //USED TO STORED DATA GOTTEN FROM HTTP GET REQUEST
        $scope.resultData = [];

        $scope.update = function () {
            var selectedMonthName = $scope.convertNumberToMonth($scope.data.selectedMonth.id);
            $scope.highchartsNG.series[0].data = $scope.storedData[selectedMonthName];
        };

        $http.get('/profile')
            .success(function (result) {
                //STORE DATA INTO SCOPE
                $scope.resultData = result;


                $scope.getDataHC($scope.resultData);


                //GET USER'S SELECTED MONTH FROM PAGE
                var selectedMonthName = $scope.convertNumberToMonth($scope.data.selectedMonth.id);

                //SET CALENDAR DATA
                $scope.highchartsNG.series[0].data = $scope.storedData[selectedMonthName];

                //SET SPLINE CHART DATA
                $scope.timeChart.series[0].data = $scope.timeChartData;

                //Y AXIS MAXIUM VALUE FOR EACH DATA
                $scope.activityChart.yAxis.max = $scope.lastActivity[2] + $scope.lastActivity[1] + $scope.lastActivity[0];

                //SET Activity DATA
                $scope.activityChart.series[0].data = [$scope.lastActivity[2]];
                $scope.activityChart.series[1].data = [$scope.lastActivity[1]];
                $scope.activityChart.series[2].data = [$scope.lastActivity[0]];
            });
    }
})();
