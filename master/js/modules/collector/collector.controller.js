/**
 * Created by huangxiang  on 2016/11/22 0022.
 * @author: huangxiang
 * Module:collector.controller.js
 * feature: collectormanage settings
 */
(function () {
    angular.module('app.collector')
        .controller('CollectorManageController', CollectorManageController);

    CollectorManageController.$inject = ['$rootScope','$scope', 'DTColumnDefBuilder', '$location', 'CollectorManageFactory', '$uibModal', '$cookies', 'datatablesOptions', 'logger','$timeout'];

    'use strict';
    function CollectorManageController($rootScope,$scope, DTColumnDefBuilder, $location, CollectorManageFactory, $uibModal, $cookies, datatablesOptions, logger, $timeout) {

        var vm = this;

        vm.addNewUser = addNewUser; // 跳转至新增用户页面的方法
        vm.queryCollectors = queryCollectors; // 查询所有用户的方法
        vm.clearAndRefresh = clearAndRefresh;
        vm.searchUsers = searchUsers; // 按用户名查找用户
        vm.queryCollectorDetail = queryCollectorDetail; // 查询用户详情/跳转至修改用户页面的方法
        vm.deleteCollector = deleteCollector;  // 打开删除用户的modal
        vm.queryParams = {
            start_index: null,
            pagedirect: '',
            staffid: '',
            maxId: null,
            minId: null,
        };
        var maxRecordsId = null, minRecordsId = null; // 记录列表数据中的最大id和最小id
        vm.queryCollectors(0); // 初始化用户列表

        /*群组选择-------------------------------------------------*/
        vm.disabled = undefined;
        vm.searchEnabled = undefined;

        vm.setInputFocus = function () {
            $scope.$broadcast('UiselectDemo1');
        };
        vm.enable = function () {
            vm.disabled = false;
        };

        vm.disabled = function () {
            vm.disabled = true;
        };

        vm.enableSearch = function () {
            vm.searchEnabled = true;
        };

        vm.disableSearch = function () {
            vm.searchEnabled = false;
        };

        CollectorManageFactory.readAll().then(function (response) {
            if (response.status === 0) {
                vm.roleAsync = response.data;
            } else {
                logger.error('获取用户失败',response.detail,'获取用户数据失败！！！');
            }
        });

        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
        };

        vm.dynamicPopover = 'Hello, World!';
        vm.dynamicPopoverTitle = 'Title';

        // 获取表格设置
        vm.dtOptions = datatablesOptions.getDatatableOption();
        // 表格列设置
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6).notSortable()
        ];

        function addNewUser() {
            $location.path('app/add-collector');
        }

        function queryCollectors(index, staffid) {

            if(index == 0){ // 查询首页
                vm.queryParams.start_index = -1;
                vm.queryParams.pagedirect = ''
            }else if(index == 1){ // 查询上一页
                if( !vm.queryParams.maxId){
                    logger.warning('已经到首页！','','没有上一页');
                    return;
                }
                vm.queryParams.start_index= vm.queryParams.maxId;
                vm.queryParams.pagedirect=1;
            }else if(index == 2){ // 查询下一页
                if( !vm.queryParams.minId ){
                    logger.warning('已经到最后一页！','','没有下一页');
                    return;
                }
                vm.queryParams.start_index= vm.queryParams.minId;
                vm.queryParams.pagedirect=0;
            }else if(index == 3){ // 查询末页
                vm.queryParams.start_index= 0;
                vm.queryParams.pagedirect= '';
            }
            vm.queryParams.staffid = staffid || '';
            // console.log(vm.queryParams)
            $rootScope.showLoadingBar = true;
            CollectorManageFactory.readAll(vm.queryParams).then(function (response) {
                if (response.status === 0  && response.operators.length > 0) {
                    var list = response.operators
                    vm.users = list;
                    vm.queryParams.maxId = list[0].id;
                    vm.queryParams.minId = list[list.length-1].id ;
                    minRecordsId = minRecordsId?minRecordsId:response.minid;
                    maxRecordsId = maxRecordsId?maxRecordsId:response.maxid;
                    if(index == 0 || vm.queryParams.maxId == maxRecordsId ){ // 已经到首页
                        vm.queryParams.maxId = null;
                        console.log('已经到首页')
                    }
                    if(index ==3 || vm.queryParams.minId == minRecordsId ){ // 已经到最后一页
                        vm.queryParams.minId = null;
                        console.log('已经到最后一页')
                    }
                    console.log('最新数据id:'+maxRecordsId,'最早数据id:'+minRecordsId)
                } else {
                    if(response.operators.length == 0){
                        logger.warning('查询到0条数据','','数据为空');
                    }else{
                        logger.error('获取用户失败',response.detail,'获取用户数据失败！！！');
                    }
                    
                }

                $timeout(function(){
                    $rootScope.showLoadingBar = false;
                }); 
            });
            $timeout(function(){
                if($rootScope.showLoadingBar){
                    $rootScope.showLoadingBar = false;
                    console.log('数据加载超时')
                }
            },8000); 
        }

        function searchUsers() {
            queryCollectors(0, vm.eventResult.model.id);

        }

        function clearAndRefresh(){
            vm.roleAsync.selected = '';
            queryCollectors(0);
        }
        function queryCollectorDetail(user) {
            CollectorManageFactory.setUserId(user.id);
            CollectorManageFactory.setUsername(user.username);
            $cookies.put('currentClickUserStaffid',user.id);
            $cookies.put('currentClickUsername',user.username);
            $location.path('/app/modify-collector');
        }

        // 删除用户
        function deleteCollector(user) {
            CollectorManageFactory.setUserId(user.id);
            CollectorManageFactory.setUsername(user.username);
            $cookies.put('currentClickUserStaffid',user.id);
            $cookies.put('currentClickUsername',user.username);
            var uibModalInstance = $uibModal.open({
                backdrop: 'static',  // 点击空白处不隐藏并保持黑色模态背景，默认是true，false为不隐藏也没有模态背景
                templateUrl: '/gzpark/app/views/partials/delete-collector-modal.html',
                controller: 'DeleteCollectorController',
                controllerAs: 'vm'
            });
            uibModalInstance.result.then(function (response) {
                logger.success('操作成功', '你已成功删除用户' + '‘' + user.username + '’！', response.data);
                vm.queryCollectors();
            });
        }

        // function deleteCollector(user){
        //     CollectorManageFactory.deleteCollector(user.id).then(function (response) {
        //         if (response.status == 0) {
        //             logger.success('操作成功', response.detail, '员工' + '‘' + vm.currentCollector.username + '’离职成功！');
        //             queryCollectors(0);
        //         } else {
        //             alert('修改失败！！' + response.detail);
        //         }
        //     });
        // }
    }
})();
