/**
 * park.add.controller.js
 * @author: huangxiang
 * @create 2016-12-23 16:43
 */
(function () {
    angular.module('app.inforsetup')
        .controller('addInfoController', addInfoController);
    addInfoController.$inject = ['$location', 'inforService', 'logger','URL_SEED','$scope'];
    'use strict';
    function addInfoController($location, inforService, logger,URL_SEED,$scope) {

        var vm = this;
        vm.platform={
            inputcontent:"新闻",
            inputweather:'天气',
            inputreset:'启动页',
            inputcarSousel:'轮播图'
        };
        $scope.mySelectVal = 'app_news_page';
           if($scope.mySelectVal =="app_start_page"){
               vm.carousel();
           }else if($scope.mySelectVal =="app_info_page"){
               vm.platform.inputweather="天气";
           }else if($scope.mySelectVal =="app_reset_page"){
               vm.platform.inputreset="启动页";
           }
       //调用轮播图
        vm.addPlatform = addPlatform;
        vm.backToPrevious = backToPrevious;
        vm.carousel=carousel;
        vm.appimg = [];
        vm.carousel();

        function addPlatform() {
            if( $scope.mySelectVal=='app_news_page'){
                 if(vm.newtitle){
                     inforService.addinfo(vm.platform.inputcontent,vm.newsurl,vm.platform.inputcontent,vm.newtitle).then(function (response) {
                         if (response.status === 0) {
                             logger.success('添加成功'+'App：'+vm.platform.inputcontent,'操作成功');
                             $location.path('/app/app-setting/app-Information-setup');
                         }else if (response.status === 80101) {
                             logger.error('添加失败' + '"' + vm.platform.inputcontent + '"' + '失败!', vm.platform.inputcontent, '该名称已经存在！');
                         }  else {
                             logger.error('添加失败');
                         }
                     });
                 }else {
                     alert("请填写完整，标题是必须填的");
                     return false;
                 }
            }else if($scope.mySelectVal =="app_start_page"){
                inforService.addinfo(vm.parking,vm.carsouelUrl,vm.platform.inputcarSousel,"").then(function (response) {
                    if (response.status === 0) {
                        logger.success('添加成功'+'App：'+vm.parking,'操作成功');
                        $location.path('/app/app-setting/app-Information-setup');
                    }else if (response.status === 80101) {
                        logger.error('添加失败' + '"' + vm.parking + '"' + '失败!', vm.parking, '该名称已经存在！');
                    }  else {
                        logger.error('添加失败');
                    }
                });
            }else if ($scope.mySelectVal =="app_reset_page"){
                inforService.addinfo(vm.platform.inputreset,vm.reseturl,vm.platform.inputreset,"").then(function (response) {
                    if (response.status === 0) {
                        logger.success('添加成功'+'App：'+vm.platform.inputreset,'操作成功');
                        $location.path('/app/app-setting/app-Information-setup');
                    }else if (response.status === 80101) {
                        logger.error('添加失败' + '"' + vm.platform.inputreset + '"' + '失败!',  vm.platform.inputreset, '该名称已经存在！');
                    }  else {
                        logger.error('添加失败');
                    }
                });

            }else {
                inforService.addinfo(vm.platform.inputweather,vm.wheaterurl,vm.platform.inputweather).then(function (response) {
                    if (response.status === 0) {
                        logger.success('添加成功'+'App：'+vm.platform.inputweather,'操作成功');
                        $location.path('/app/app-setting/app-Information-setup');
                    }else if (response.status === 80101) {
                        logger.error('添加失败' + '"' + vm.platform.inputweather + '"' + '失败!', vm.platform.plateformname, '该名称已经存在！');
                    }  else {
                        logger.error('添加失败');
                    }
                });
            }






        }
        function backToPrevious() {
            $location.path('/app/app-setting/app-Information-setup');
        }
        var carouselimg=[];


        //轮播图渲染

        function carousel() {
            inforService.imgsurl().then(function (response) {
                if(response.status===0){
                    angular.forEach(response.cover_page,function (data) {
                        console.log(data);
                      var imgData = URL_SEED.IMG_URL+"media/"+data;
                        vm.appimg.push(imgData);
                        carouselimg.push(imgData)
                    });
                    //进行图片存储
                     $scope.selectimg=[];
                    if(carouselimg.length>0){
                        //循环遍历指示点
                        for(var i=0; i<carouselimg.length;i++){
                            $scope.selectimg.push(i);
                            if(i===0){
                                console.log(angular.element(document.querySelector('#carousel-indir')));
                                angular.element(document.querySelector('#carousel-indir')).append("<li data-target='#carousel-example-generic' data-slide-to='0'  class='active'></li>");
                            }else {
                                angular.element(document.querySelector('#carousel-indir')).append("<li data-target='#carousel-example-generic' data-slide-to='"+i+"'></li>");
                            }

                        }
                        //循环遍历图片
                        for (var i=0;i<carouselimg.length;i++){
                            if(i===0){
                                angular.element(document.querySelector('#carousel-inn')).append("<div class='item active'>" +
                                    "<img src='" + carouselimg[i] + "' alt='' style='width: 690px;height: 240px'>" +"<div class='carousel-caption' >轮播图"+1+"</div>"+
                                    "</div>");
                            }else {
                                angular.element(document.querySelector('#carousel-inn')).append("<div class='item'>" +
                                    "<img src='" + carouselimg[i] + "' alt='' style='width: 690px;height: 240px'>"
                                    +"<div class='carousel-caption'>轮播图"+(i+1)+"</div>"+
                                    "</div>");
                            }
                        }

                    }
                }

            })

        }













    }
})();