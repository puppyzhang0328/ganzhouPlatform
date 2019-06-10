/**
 * Created by huangxiang  on 2017/3/24 0024.
 * @author: huangxiang
 * Module: welcome.controller.js
 * feature: 主页设置
 */
(function () {
    angular.module('app.welcome')
        .controller('WelcomeController',WelcomeController);

    WelcomeController.$inject = [];

    'use strict';
    function WelcomeController() {

        var vm = this;

        vm.myInterval = 1000;
        vm.noWrapSlides = false;

        vm.active = 0;

        vm.slides = [
            {
                image:'/park/app/img/carousel/banner_1.jpg',
                text: ['Nice image','Awesome photograph','That is so cool','I love that'],
                id: 1
            },
            {
                image:'/park/app/img/carousel/banner_2.jpg',
                text: ['Nice image','Awesome photograph','That is so cool','I love that'],
                id: 2
            },
            {
                image:'/park/app/img/carousel/banner_3.jpg',
                text: ['Nice image','Awesome photograph','That is so cool','I love that'],
                id: 3
            }
        ];

    }
})();
