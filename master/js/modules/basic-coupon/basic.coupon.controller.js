/**
 * region.controller.js
 * @author: yumaotao
 * @create 2017/11/6
 * @feather: 区域信息表单初始化配置
 */
(function () {
    angular.module('app.basicinfo')
        .controller('CouponCtr', CouponCtr);
    CouponCtr.$inject = ['$location', 'couponService', 'DTColumnDefBuilder', 'datatablesOptions', 'couponFactory', '$uibModal','$document','logger'];
    'use strict';
    function CouponCtr($location, couponService, DTColumnDefBuilder, datatablesOptions, couponFactory, $uibModal,$document,logger) {
        var vm = this;
        vm.pagination = {
            pagetype: {
                next_page: 1,
                pervious_page: 0
            },
            next_start_index:0,
            previous_start_index:0,
            maxid: 0,
            minid: 0
        };
        vm.number={
            start:0,
            next:0
        };
        vm.queryCoupon = queryCoupon; // 查询所有信息
        vm.addCoupon = addCoupon; //新增优惠券
        vm.deleteCoupon = deleteCoupon; //删除优惠券
        vm.modifyCoupon = modifyCoupon; //修改优惠券
        vm.readRecords = readRecords;
        vm.readRecords(0); // 初始化优惠券表格数据
        vm.dtOptions = datatablesOptions.getDatatableOption(); // 获取datatables表格设置
        // 创建表格列
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7),
            DTColumnDefBuilder.newColumnDef(8),
            DTColumnDefBuilder.newColumnDef(9),
            DTColumnDefBuilder.newColumnDef(10),
            DTColumnDefBuilder.newColumnDef(11),
            DTColumnDefBuilder.newColumnDef(12).notSortable()
        ];
        /**
         * 查询所有优惠券
         */
        function queryCoupon() {
            couponService.queryCoupon().then(function (response) {
                vm.coupon = response.data.records;
                angular.forEach(response.data.records, function (value,index) {
                    vm.coupon[index].mony = response.data.records[index].denomination/100;
                });
            });
        }
        /**
         * 新增区域.跳转至新增优惠券界面
         */
        function addCoupon() {
            $location.path('/app/coupon/add-new-coupon');
        }
        /**
         * 打开删除优惠券的modal;
         * @param parking
         */
        function deleteCoupon(coupon) {
            couponFactory.setCoupon(coupon);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteCoupon.html',
                size: 'sm',
                controller: 'CouponDeteleCtr',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.readRecords(0);
            });
        }
        /**
         * 修改优惠券信息，跳转至修改优惠券信息界面
         * @param region 当前要修改的区域
         */
        function modifyCoupon(coupon) {
            couponFactory.setCoupon(coupon);
            $location.path('/app/coupon/modify-coupon');
        }
        function readRecords(start_index){
            if(start_index == 0){//首页index
                couponService.readRecords(0,'').then(function (response) {
                    vm.coupon =  response.data.records;
                    angular.forEach( response.data.records, function (value,index) {
                        vm.coupon[index].mony = response.data.records[index].denomination/100;
                    });
                    vm.number.start = vm.coupon[0];
                    vm.number.next = vm.coupon[vm.coupon.length - 1].number;
                    vm.pagination.next_start_index =  response.data.records[ response.data.records.length - 1].id;
                    vm.pagination.previous_start_index =  response.data.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    if ( response.data.records.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }else{
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                    }
                });
            }else if(start_index == 1){//上一页
                if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                    logger.warning('已经到首页！','','没有上一页');
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }else{
                    couponService.readRecords(vm.pagination.previous_start_index,0).then(function (response) {
                        vm.coupon =  response.data.records;
                        angular.forEach( response.data.records, function (value,index) {
                            vm.coupon[index].mony = response.data.records[index].denomination/100;
                        });
                        vm.number.start = vm.coupon[0];
                        vm.number.next = vm.coupon[vm.coupon.length - 1].number;
                        vm.pagination.next_start_index =  response.data.records[ response.data.records.length - 1].id;
                        vm.pagination.previous_start_index =  response.data.records[0].id;
                        vm.pagination.maxid = response.maxid;
                        if ( response.data.records.length < 50) {
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        }else{
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        }
                    });
                }
            }else if(start_index == 2){//下一页
                if (vm.pagination.next_start_index <= vm.pagination.minid) {
                    logger.warning('已经到最后一页！','','没有下一页');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                }else{
                    couponService.readRecords(vm.pagination.next_start_index,1).then(function (response) {
                        vm.coupon =  response.data.records;
                        angular.forEach( response.data.records, function (value,index) {
                            vm.coupon[index].mony = response.data.records[index].denomination/100;
                        });
                        vm.number.start = vm.coupon[0];
                        vm.number.next = vm.coupon[vm.coupon.length - 1].number;
                        vm.pagination.next_start_index =  response.data.records[ response.data.records.length - 1].id;
                        vm.pagination.previous_start_index =  response.data.records[0].id;
                        vm.pagination.minid = response.minid;
                        if ( response.data.records.length < 50) {
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        }else{
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        }
                    });
                }
            }else if(start_index == 3){//加载最后一页
                couponService.readRecords(-1,'').then(function (response) {
                    vm.coupon =  response.data.records;
                    angular.forEach( response.data.records, function (value,index) {
                        vm.coupon[index].mony = response.data.records[index].denomination/100;
                    });
                    vm.number.start = vm.coupon[0];
                    vm.number.next = vm.coupon[vm.coupon.length - 1].number;
                    vm.pagination.next_start_index =  response.data.records[ response.data.records.length - 1].id;
                    vm.pagination.previous_start_index =  response.data.records[0].id;
                    vm.pagination.minid = response.minid;
                    if ( response.data.records.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }else{
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    }
                });
            }
        }
    }
})();