/**
 * Created by huangxiang  on 2016/11/23 0023.
 * @author: huangxiang
 * Module: parking.controller.js
 * feature: 停车场表格初始化设置
 */
(function() {
    'use strict';
    angular.module('app.parking')
        .controller('ParkingManageController', ParkingManageController);

    ParkingManageController.$inject = ['$state', '$scope', 'toastr', '$location', 'ManageParkingService', 'DTColumnDefBuilder', '$uibModal', '$timeout', '$cookies', 'datatablesOptions'];
    
    function ParkingManageController($state, $scope, toastr, $location, ManageParkingService, DTColumnDefBuilder, $uibModal, $timeout, $cookies, datatablesOptions) {
        // var vm = this;
        // 查询所有停车场
        $scope.queryParkings = function() {
            ManageParkingService.queryParking().then(function(response) {
                $scope.parking_lots = response.parking_lots;
            });
        };

        /*查询停车场入口*/
        $scope.queryParkingGate = function() {
            ManageParkingService.queryGate(parkid).then(function(response) {    
                // console.log(response);
                $scope.parkgate = response.parkgate;
            });
        };

        //==================================停车场入口设置========================================
        // 查询停车场入口坐标
        var parkid = 0;
        $scope.queryGates = function(id) {
            parkid = id;
            var modalInstance;
            modalInstance = $uibModal.open({
                backdrop: 'static', // 点击空白处不隐藏并保持黑色模态背景，默认是true，false为不隐藏也没有模态背景
                templateUrl: 'queryParkingGate.html',
                size: 'lg',
                controller: GateModalInstanceCtrl
            });
        };


        var GateModalInstanceCtrl = function($scope, $uibModalInstance) {

            ManageParkingService.queryGate(parkid).then(function(response) {
                // console.log(response);
                $scope.parkgate = response.parkgate;
            });


            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

            // 新增停车场入口
            $scope.addGate = function() {
                var modalInstance;
                modalInstance = $uibModal.open({
                    backdrop: 'static', // 点击空白处不隐藏并保持黑色模态背景，默认是true，false为不隐藏也没有模态背景
                    templateUrl: 'addParkingGate.html',
                    controller: AddGateModalInstanceCtrl
                });

                modalInstance.result.then(function() {
                    $scope.cancel();
                });
            };

            // 修改停车场入口
            $scope.modifyGate = function(gate) {
                $cookies.putObject('currentGate', gate);
                /*eslint init-declarations:0*/
                var modalInstance;
                modalInstance = $uibModal.open({
                    backdrop: 'static', // 点击空白处不隐藏并保持黑色模态背景，默认是true，false为不隐藏也没有模态背景
                    templateUrl: 'modifyGate.html',
                    controller: AddGateModalInstanceCtrl
                });

                modalInstance.result.then(function() {
                    $scope.cancel();
                });
            };

            var AddGateModalInstanceCtrl = function($scope, $uibModalInstance) {

                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.ParkGate = {
                    gatename: '',
                    isdefault: true,
                    gatetype: '',
                    longitude: 0.00,
                    latitude: 0.00,
                    parklotid: parkid
                };

                /*定义是否为默认入口*/
                $scope.ParkGateItems = [{
                        value: true,
                        text: '是'
                    },
                    {
                        value: false,
                        text: '否'
                    }
                ];
                /*定义出口类型参数*/
                $scope.ParkGateType = [{
                        text: '出口',
                        value: 2
                    },
                    {
                        text: '入口',
                        value: 1
                    },
                    {
                        text: '出/入口',
                        value: 3
                    }
                ];

                $scope.currentParkGate = {
                    parkgateid: 0,
                    gatename: '',
                    isdefault: true,
                    latitude: 0.00,
                    longitude: 0.00,
                    parklotid: parkid
                };

                var getCurrentParkGate = function() {
                    $timeout(function() {
                        $scope.clickParkGate = $cookies.getObject('currentGate');
                        $scope.currentParkGate.parkgateid = $scope.clickParkGate.gateid;
                        $scope.currentParkGate.gatename = $scope.clickParkGate.gatename;
                        $scope.currentParkGate.isdefault = $scope.clickParkGate.isdefault;
                        $scope.currentParkGate.latitude = $scope.clickParkGate.latitude;
                        $scope.currentParkGate.longitude = $scope.clickParkGate.longitude;
                    }, 500);
                };

                getCurrentParkGate();

                $scope.confirmAddGate = function() {
                    ManageParkingService.addGate($scope.ParkGate.gatename, $scope.ParkGate.isdefault.value, $scope.ParkGate.gatetype.value, $scope.ParkGate.longitude, $scope.ParkGate.latitude, $scope.ParkGate.parklotid).then(function(response) {
                        if (response.status === 0) {
                            $timeout(function() {
                                toastr.success('操作成功', '你已成功添加停车场入口' + '"' + $scope.ParkGate.gatename + '"!', {
                                    closeButton: true,
                                    progressBar: true,
                                    positionClass: 'toast-top-center'
                                });
                            }, 500);
                            // $scope.queryGates();
                            // $scope.queryParkingGate();
                            $scope.cancel();
                            $state.reload();
                        } else if (response.status === 400012) {
                            $timeout(function() {
                                toastr.error('删除失败', '该入口已经存在！！', {
                                    closeButton: true,
                                    progressBar: true,
                                    positionClass: 'toast-top-center'
                                });
                            }, 500);
                        } else if (response.status === 10003 || response.status === 500) {
                            $timeout(function() {
                                toastr.error('删除失败', '后台服务器异常或数据库错误！！！请联系管理员！', {
                                    closeButton: true,
                                    progressBar: true,
                                    positionClass: 'toast-top-center'
                                });
                            }, 500);
                        }
                    });
                };

                $scope.confirmModifyGate = function() {
                    ManageParkingService.modifyGate($scope.currentParkGate.parkgateid, $scope.currentParkGate.gatename, $scope.currentParkGate.isdefault.value, $scope.currentParkGate.latitude, $scope.currentParkGate.longitude, $scope.currentParkGate.parklotid).then(function(response) {
                        if (response.status === 0) {
                            $timeout(function() {
                                toastr.success('操作成功', '你已成功修改停车场入口' + '"' + $scope.currentParkGate.gatename + '"!', {
                                    closeButton: true,
                                    progressBar: true,
                                    positionClass: 'toast-top-center'
                                });
                            }, 500);

                            $state.reload();
                        } else if (response.status === 400012) {
                            $timeout(function() {
                                toastr.error('修改失败', '该入口已经存在！！', {
                                    closeButton: true,
                                    progressBar: true,
                                    positionClass: 'toast-top-center'
                                });
                            }, 500);
                        } else if (response.status === 10003 || response.status === 500) {
                            $timeout(function() {
                                toastr.error('修改失败', '后台服务器异常或数据库错误！！！请联系管理员！', {
                                    closeButton: true,
                                    progressBar: true,
                                    positionClass: 'toast-top-center'
                                });
                            }, 500);
                        }
                    });
                };

                $scope.confirmDeleteGate = function() {
                    ManageParkingService.deleteGate(currentGateId).then(function(response) {
                        if (response.status === 0) {
                            $timeout(function() {
                                toastr.success('操作成功', '你已成功删除停车场入口' + '"' + $scope.ParkGate.gatename + '"!', {
                                    closeButton: true,
                                    progressBar: true,
                                    positionClass: 'toast-top-center'
                                });
                            }, 500);
                            // $scope.queryGates();
                            // $scope.queryParkingGate();
                            // $scope.cancel();
                            // $location.path('/app/parking');
                            $state.reload();
                        } else if (response.status === 400010 || response.status === 40011) {
                            $timeout(function() {
                                toastr.error('删除失败', '您要删除的入口不存在或该停车场没有入口！请检查后再操作！', {
                                    closeButton: true,
                                    progressBar: true,
                                    positionClass: 'toast-top-center'
                                });
                            }, 500);
                        } else if (response.status === 10003 || response.status === 500) {
                            $timeout(function() {
                                toastr.error('删除失败', '后台服务器异常或数据库错误！！！请联系管理员！', {
                                    closeButton: true,
                                    progressBar: true,
                                    positionClass: 'toast-top-center'
                                });
                            }, 500);
                        }
                    });
                };
            };
            // 新增入口结束
            var currentGateId = 0;
            /*删除入口开始*/
            $scope.deleteGate = function(currentGate) {
                currentGateId = currentGate.gateid;
                var modalInstance;
                modalInstance = $uibModal.open({
                    backdrop: 'static', // 点击空白处不隐藏并保持黑色模态背景，默认是true，false为不隐藏也没有模态背景
                    templateUrl: 'deleteGate.html',
                    controller: AddGateModalInstanceCtrl
                });
            };
            /*删除入口结束*/

            AddGateModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance'];
        };

        GateModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance'];
        //==================================停车场入口设置========================================

        $scope.dtOptions = datatablesOptions.getDatatableOption();
        //////////////////////////////////////////////////////////////////////////
        // 加载停车场等百度地图
        /*       $scope.loadMap = function () {
         var modalInstance;
         modalInstance = $uibModal.open({
         backdrop: 'static',  // 点击空白处不隐藏并保持黑色模态背景，默认是true，false为不隐藏也没有模态背景
         templateUrl: 'BmapModal.html',
         size: 'lg',
         controller: ModalInstanceCtrl
         // resolve:{
         //     selectedRole:function(){
         //         return $scope.role;
         //     }
         // }
         });
         };*/

        var ModalInstanceCtrl = function($scope, $uibModalInstance, selectedRole) {};
        ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance'];
        /*
         // 百度地图的参数设置
         $scope.mapOptions = {
         center: {
         longitude: 113.95168,
         latitude: 22.539713
         },
         zoom: 17,
         city: 'ShenZhen',
         scaleCtrl: true,
         navCtrl: true,
         overViewCtrl: true,
         enableScrollWheelZoom: true
         };*/

        // 百度地图加载完毕
        /////////////////////////////////////////////////////////////////////////////////////
        // 新增停车场开始

        $scope.addParkinglot = function() {
            $location.path('/app/parking/add-new-parking');
        };

        $scope.parking = {
            name: '',
            address: '',
            city_code: 0,
            longitude: 0.0000,
            latitude: 0.0000,
            price: 0,
            parking_space_total: ''
        };
        $scope.addParking_ = function() {
            ManageParkingService.addParking($scope.parking.name, $scope.parking.address, $scope.parking.city_code, $scope.parking.longitude, $scope.parking.latitude, $scope.parking.price, $scope.parking.parking_space_total)
                .success(function(response) {
                    if (response.status == 0) {
                        $timeout(function() {
                            toastr.success('操作成功', '你已成功添加停车场' + '"' + $scope.parking.name + '"!', {
                                closeButton: true,
                                progressBar: true,
                                positionClass: 'toast-top-center'
                            });
                        }, 500);
                        $scope.queryParkings();
                        $location.path('/app/parking');
                    }
                }).error(function(response) {
                    toastr.error('添加失败', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                });
        };

        // 返回上一层
        $scope.backToPrevious = function() {
            $location.path('/app/parking');
        };
        // 新增停车场结束
        //////////////////////////////////////////////////////////////////////////////////////
        // 删除停车场开始
        var mParking = {};
        $scope.deleteParking = function(parking) {
            mParking = parking;
            var modalInstance = $uibModal.open({
                backdrop: 'static', // 点击空白处不隐藏并保持黑色模态背景，默认是true，false为不隐藏也没有模态背景
                templateUrl: 'deleteParking.html',
                size: 'sm',
                controller: ParkingModalInstanceCtrl
            });
            // 删除成功后弹出Notify通知
            modalInstance.result.then(function() {
                $timeout(function() {
                    toastr.success('操作成功', '你已成功删除停车场' + '‘' + parking.name + '’！', {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    }, 500);
                });
                $scope.queryParkings();
            });
        };

        var parklotid = 0;
        $scope.queryParkDetail = function(id) {
            parklotid = id;
            var modalInstance = $uibModal.open({
                backdrop: 'static', // 点击空白处不隐藏并保持黑色模态背景，默认是true，false为不隐藏也没有模态背景
                templateUrl: 'queryParkDetail.html',
                size: 'lg',
                controller: ParkingDetailModalInstanceCtrl
            });

        };

        var ParkingDetailModalInstanceCtrl = function($scope, $uibModalInstance) {

            ManageParkingService.queryParkingDetail(parklotid).then(function(response) {
                if (response.status == 0) {
                    $scope.identifier = response.identifier;
                    $scope.parklotName = response.name;
                    $scope.private_key = response.private_key;
                } else {
                    alert('从服务器获取数据失败！！');
                }
            });

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        };

        var ParkingModalInstanceCtrl = function($scope, $uibModalInstance) {
            $scope.deleteParkingConfirm = function() {
                ManageParkingService.deleteParking(mParking.id)
                    .then(function(response) {
                        if (response.status == 0) {
                            $uibModalInstance.close('closed');
                        } else {
                            alert('删除失败:' + response.detail);
                        }
                    });
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        };

        ParkingModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance'];
        ParkingDetailModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance'];
        // 删除停车场完毕
        /////////////////////////////////////////////////////////////////////////////////////
        // 修改停车场开始
        $scope.modifyParking = function(parking) {
            $cookies.putObject('currentClickPark', parking);
            $location.path('/app/parking/modify-parking');
        };
        //  修改停车场结束
        //////////////////////////////////////////////////////////////////////////////////////

        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withOption('width', '6%'),
            DTColumnDefBuilder.newColumnDef(1).withOption('width', '8%'),
            DTColumnDefBuilder.newColumnDef(2).withOption('width', '13%'),
            DTColumnDefBuilder.newColumnDef(3).withOption('width', '13%'),
            DTColumnDefBuilder.newColumnDef(4).withOption('width', '7%'),
            DTColumnDefBuilder.newColumnDef(5).withOption('width', '7%'),
            DTColumnDefBuilder.newColumnDef(6).withOption('width', '8%'),
            DTColumnDefBuilder.newColumnDef(7).withOption('width', '8%'),
            DTColumnDefBuilder.newColumnDef(8).withOption('width', '8%'),
            DTColumnDefBuilder.newColumnDef(9).notSortable().withOption('width', '14%')
        ];

        // 初始化停车场数据
        $scope.queryParkings();
    }
})();