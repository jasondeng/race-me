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
                    picture : 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
                    github: {
                        href : 'https://github.com/jasonCodeng',
                        label :"Follow @jasonCodeng on GitHub",
                        text : "Follow @jasonCodeng"
                    },
                    role: 'Full Stack Developer',
                    column:'col-sm-4'
                }, {
                    name: 'Itzhak Koren Kloussner ',
                    picture : 'vendor/img/profile-pics/itzak.jpg',
                    github: {
                        href : 'https://github.com/zackoren',
                        label :"Follow @zackoren on GitHub",
                        text : "Follow @zackoren"
                    },
                    role: 'Full Stack Developer',
                    column:'col-sm-4'
                },{
                    name: 'Satbir Tanda',
                    picture : "vendor/img/profile-pics/satbir.png",
                    github: {
                        href : 'https://github.com/sst-1',
                        label :"Follow @sst-1 on GitHub",
                        text : "Follow @sst-1"
                    },
                    role: 'iOS Developer',
                    column:'col-sm-4'
                },{
                    name: 'Cheng Pan',
                    picture : 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
                    github: {
                        href : 'https://github.com/cpanz',
                        label :"Follow @cpanz on GitHub",
                        text : "Follow @cpanz"
                    },
                    role: 'Full Stack Developer',
                    column:'col-sm-4 col-sm-offset-2'
                },{
                    name: 'Lizhou Cao',
                    picture : 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
                    github: {
                        href : 'https://github.com/newtext',
                        label :"Follow @newtext on GitHub",
                        text : "Follow @newtext"
                    },
                    role: 'Data Visualization',
                    column:'col-sm-4'
                }]
            };
        }
}) ();