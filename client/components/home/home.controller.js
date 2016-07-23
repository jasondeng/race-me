(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', 'authentication', '$http', 'charts'];
    function HomeCtrl($scope, authentication, $http, charts) {

        var vm = this;

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.hasHealthData = authentication.hasHealthData();

        $scope.currentUser = authentication.currentUser();

        $scope.calendarData = {};
        $scope.areaData1 = [];
        $scope.areaData2 = [];

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

        vm.loadedData = false;
        if (vm.isLoggedIn && vm.hasHealthData) {
            vm.data = function () {
                $scope.loading = true;
                charts.getHealthData()
                    .then(function (response) {
                        $scope.calendarData = charts.calendarData(response.data);

                        //GET USER'S SELECTED MONTH FROM PAGE
                        let selectedMonthName = charts.convertNumberToMonth($scope.data.selectedMonth.id);

                        //SET CALENDAR DATA
                        $scope.calenderChart.series[0].data = $scope.calendarData[selectedMonthName];

                        // AREA DATA FIRST DATA - CURRENT MONTH DATA AND NAME
                        $scope.areaData1 = charts.areaChartData(selectedMonthName, $scope.calendarData);
                        $scope.areaChart.series[0].data = $scope.areaData1;
                        $scope.areaChart.series[0].name = $scope.data.availableMonth[$scope.data.selectedMonth.id].name;


                        let lastMonthName = charts.convertNumberToMonth($scope.data.selectedMonth.id -1);

                        //AREA DATA SECOND DATA - LAST MONTH DATA AND NAME
                        $scope.areaData2 = charts.areaChartData(lastMonthName, $scope.calendarData);
                        $scope.areaChart.series.push({data: $scope.areaData2});
                        $scope.areaChart.series[1].name = $scope.data.availableMonth[$scope.data.selectedMonth.id -1].name;

                        vm.loadedData = true;
                        $scope.loading = false;

                    });
            }();

            $scope.update = function () {

                let selectedMonthName = charts.convertNumberToMonth($scope.data.selectedMonth.id);
                $scope.calenderChart.series[0].data = $scope.calendarData[selectedMonthName];

                $scope.areaData2 = charts.areaChartData(selectedMonthName, $scope.calendarData);
                $scope.areaChart.series[1].data = $scope.areaData2;
                $scope.areaChart.series[1].name = $scope.data.selectedMonth.name;
                $scope.areaChart.title.text = "This month vs " + $scope.data.selectedMonth.name;

                let sum = 0;
                let max = 0;

                $scope.calenderChart.series[0].data.forEach((entry) => {
                    max = Math.max(max, entry[2]);
                    sum += entry[2];
                });
                if(sum === 0) {
                    $scope.calenderChart.options.colorAxis.max = 1000;
                }
                else {
                    $scope.calenderChart.options.colorAxis.max = max;
                }
          };

          $scope.calenderChart = {
              options: {
                  tooltip: {
                      style: {
                          fontSize: '16px'
                      },
                      useHTML: true,
                      formatter: function () {
                          return "<strong>" + this.point.value + "</strong> Steps";
                      }
                  },
                  plotOptions: {
                      heatmap: {
                          dataLabels: {
                              enabled: true,
                              color: '#000000',
                              formatter: function () {
                                  return $scope.calenderChart.series[0].data[this.series.data.indexOf(this.point)][3];
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
                      marginBottom: 80
                  },
                  colorAxis: {
                      min: 0,
                      minColor: '#FFFFFF',
                      maxColor: Highcharts.getOptions().colors[0]
                  }
              },
              title: {
                  text:" Your steps per day"
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
                  data: []
              }],
              credits: {
                  enabled: false
              },
              loading: false
          };

          $scope.areaChart = {
              options: {
                  chart: {
                      type: 'area'
                  },
                  tooltip: {
                      useHTML: true,
                      formatter: function () {
                        if (this.series.name === $scope.data.availableMonth[$scope.currentMonth].name){
                           return '<b>' + Highcharts.dateFormat('%m/%d/%Y', $scope.areaData1[this.series.data.indexOf(this.point)][2]) + '</b> <center> <b>' + this.y + '</b> </center>';
                        }else {
                          return '<b>' + Highcharts.dateFormat('%m/%d/%Y', $scope.areaData2[this.series.data.indexOf(this.point)][2]) + '</b> <center> <b>' + this.y + '</b> </center>';
                        }
                      }
                  },
                  plotOptions: {
                    area: {
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        }
                    }
                  },
              },
              xAxis: {
                  tickInterval: 1
              },
              yAxis: {
                  title:{
                    text: 'Steps',
                    style: {
                         fontSize: '16px'
                    }
                  },
                  type: 'logarithmic',
                  minorTickInterval: 1
              },
              series: [{
                  data: []
              }],
              title: {
                  text: "This month vs Last Month"
              },
              loading: false
          };

        }
    }

})();
