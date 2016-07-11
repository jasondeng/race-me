function convertMonthNameToNumber(monthName) {
    var myDate = new Date(monthName + " 1, 2000");
    var monthDigit = myDate.getMonth();
    return isNaN(monthDigit) ? 0 : (monthDigit + 1);
}

function convertNumberToMonth(monthNumber) {
    var month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return month[monthNumber - 1];
}

(function () {
    'use strict';

    angular
        .module('app')
        .controller('HelpCtrl', HelpCtrl);

        HelpCtrl.$inject = ['$scope','authentication','$log','$http'];
        function HelpCtrl($scope, authentication ,$log , $http) {
            $http.get('/profile')
                .success(function (result){
                    $scope.highchartsNG = {
                        chart: {
                            zoomType: 'xy',
                            resetZoomButton: {
                              position: {
                                verticalAlign: 'top'
                              },
                              relativeTo: 'chart'
                            }
                            // height: 300,
                            // width: 700
                        },
                        title: {
                            text: 'Healthkit'
                        },
                        xAxis: {
                            title: {
                                enabled: true,
                                text: 'Days'
                            },
                            tickInterval: 2,
                            gridLineWidth: 0.5,
                            lineWidth: 0,
                            minorGridLineWidth: 0,
                            tickLength: 0,
                            minorTickLength: 0,
                            // startOnTick: true,
                            // endOnTick: false
                            // showLastLabel: true
                        },
                        yAxis: {
                            labels: {
                              formatter: function() {
                                return convertNumberToMonth(this.value);
                              },
                              ordinal: false
                            },
                            title: {
                                enabled: false
                                // text: 'Month'
                            },
                            // startOnTick: true,
                            // showLastLabel: true
                            startOnTick: false,
                            endOnTick: false,
                            tickPixelInterval: 15,
                            gridLineWidth: 0
                        },
                        legend: {
                            enabled: false
                        },
                        tooltip: {
                            useHTML: true,
                            headerFormat: '<thead><tr>',
                            pointFormatter: function () {
                                return '<th> <center><strong>' + convertNumberToMonth(this.y) + ' ' + this.x +
                                '</strong></center> </th> <th>' + this.z + ' Steps </th>';
                            },
                            footFormat: '</tr></thead>',
                            positioner: function () {
                                return { x: 40, y:0 };
                            },
                            shadow: false,
                            borderWidth: 0,
                            backgroundColor: 'rgba(255,255,255,0)'
                        },
                        plotOptions: {
                            bubble:{
                                minSize: '2',
                                maxSize: '12',
                            }
                        },
                        series: [{
                            type: 'bubble',
                            name: 'Steps Per Day',
                            // color: 'rgba(223, 83, 83, .5)',
                            data: function() {
                                     var dataArr =[];
                                     //Date.UTC(1970, 9, 21)
                                     for (var i = 0; i < result.health.totalStepsForEachDayOfYear.length; i++) {
                                         var test = result.health.totalStepsForEachDayOfYear[i];
                                        //
                                         var HoldTest = test.split(":");
                                         var res = HoldTest[0].slice(0,4);

                                        //  console.log(res);
                                        var month = HoldTest[0].split(" ");
                                        var monthNum = month[1].slice(0,month[1].length - 1);
                                        // console.log(monthNum);
                                        //  console.log(HoldTest);
                                        //  var dateandYr = HoldTest[0].slice(4,HoldTest[0].length);
                                        //  console.log(res);
                                        var Hold0 = Number(HoldTest[1]);
                                        var Hold1 = convertMonthNameToNumber(res);
                                        // var Hold1 = Date.parse(convertMonthNameToNumber(res)+ ' ' + dateandYr);
                                        // console.log(Hold0);

                                         HoldTest[0] = Number(monthNum);//DAYS
                                         HoldTest[1] = Hold1;//MONTH
                                         HoldTest[2] = Hold0;//STEPS
                                         dataArr.push(HoldTest);
                                     }
                                    //   console.log(dataArr[1]);
                                      return dataArr;
                            }()
                        }],
                        credits: {
                          enabled: false
                        }
                    };
                    $log.log(result);
                });
        }
}) ();
