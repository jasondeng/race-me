(function () {
    'use strict';

    angular
        .module('app')
        .controller('AboutCtrl', AboutCtrl);

        AboutCtrl.$inject = ['$sce'];

        function AboutCtrl($sce) {
            var vm = this;

            vm.trustSrc = function(src) {
                return $sce.trustAsResourceUrl(src);
            };

            vm.data = {
                team: [{
                    name: 'Jason Deng',
                    picture : 'vendor/img/profile-pics/jason.jpg',
                    github: {
                        href : 'https://github.com/jasonCodeng'
                    },
                    linkedin: {
                        href : 'https://www.linkedin.com/in/jasondeng94'
                    },
                    role: 'Frontend Developer',
                    column:'col-sm-4'
                }, {
                    name: 'Itzhak Koren Kloussner ',
                    picture : 'vendor/img/profile-pics/itzak.jpg',
                    github: {
                        href : 'https://github.com/zackoren'
                    },
                    linkedin: {
                        href : 'https://www.linkedin.com/in/isaac-koren-5101b9118'
                    },
                    role: 'iOS Developer',
                    column:'col-sm-4'
                },{
                    name: 'Satbir Tanda',
                    picture : "vendor/img/profile-pics/satbir.png",
                    github: {
                        href : 'https://github.com/sst-1'
                    },
                    linkedin: {
                        href : 'https://www.linkedin.com/in/satbir-singh-tanda-92751b116'
                    },
                    role: 'iOS Developer',
                    column:'col-sm-4'
                },{
                    name: 'Cheng Pan',
                    picture : "vendor/img/profile-pics/cheng.jpg",
                    github: {
                        href : 'https://github.com/cpanz'
                    },
                    linkedin: {
                        href : 'https://www.linkedin.com/in/cheng-pan-435047b8'
                    },
                    role: 'Backend Developer',
                    column:'col-sm-4 col-sm-offset-2'
                },{
                    name: 'Lizhou Cao',
                    picture : "vendor/img/profile-pics/alan3.png",
                    github: {
                        href : 'https://github.com/newtext'
                    },
                    linkedin: {
                        href : 'https://www.linkedin.com/in/lizhou-cao-a69aabb6'
                    },
                    role: 'Data Visualization',
                    column:'col-sm-4'
                }]
            };
        }
}) ();
