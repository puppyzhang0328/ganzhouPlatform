/**
 * Created by huangxiang  on 2016/11/22 0022.
 * @author: huangxiang
 * Module:collector.controller.js
 * feature: collectormanage settings
 */
(function () {
    angular.module('app.collector')
        .controller('CollectorParklotController', CollectorParklotController);

    CollectorParklotController.$inject = ['$rootScope','$scope', 'DTColumnDefBuilder', '$location', 'CollectorManageFactory', '$uibModal', '$cookies', 'datatablesOptions', 'logger','$timeout'];

    'use strict';
    function CollectorParklotController($rootScope,$scope, DTColumnDefBuilder, $location, CollectorManageFactory, $uibModal, $cookies, datatablesOptions, logger, $timeout) {

        var vm = this;

        vm.queryCollectors = queryCollectors; // 查询所有用户的方法
        vm.clearAndRefresh = clearAndRefresh;
        vm.searchParklots = searchParklots; // 按用户名查找用户
        vm.updateParklot = updateParklot;  // 打开删除用户的modal
        vm.queryAllParklotsList = queryAllParklotsList;  // 打开删除用户的modal
        vm.queryParams = {
            start_index: null,
            pagedirect: '',
            id: undefined,
            maxId: null,
            minId: null,
        };
        var maxRecordsId = null, minRecordsId = null; // 记录列表数据中的最大id和最小id
        vm.parklots = []

        /*停车场选择-------------------------------------------------*/
        vm.parklotAsync = []
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
        vm.queryAllParklotsList()
        var start_index = 0;
        function queryAllParklotsList() {
            CollectorManageFactory.queryParklots({start_index:start_index,pagedirect:1,max_results:100}).then(function (response) {
                if(response.data.length !== 0) {
                    start_index =  response.data[response.data.length - 1].id;
                    vm.parklotAsync=vm.parklotAsync.concat(response.data);
                    vm.queryAllParklotsList();
                }
            });
        }
        
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
            DTColumnDefBuilder.newColumnDef(4).notSortable(),
        ];

        vm.queryCollectors(0); // 初始化列表
        function queryCollectors(index, id) {

            if(index == 0){ // 查询首页
                vm.queryParams.start_index = 0;
                vm.queryParams.pagedirect = ''
            }else if(index == 1){ // 查询上一页
                if( !vm.queryParams.maxId){
                    logger.warning('已经到首页！','','没有上一页');
                    return;
                }
                vm.queryParams.start_index= vm.queryParams.maxId;
                vm.queryParams.pagedirect=0;
            }else if(index == 2){ // 查询下一页
                if( !vm.queryParams.minId ){
                    logger.warning('已经到最后一页！','','没有下一页');
                    return;
                }
                vm.queryParams.start_index= vm.queryParams.minId;
                vm.queryParams.pagedirect=1;
            }else if(index == 3){ // 查询末页
                vm.queryParams.start_index= -1;
                vm.queryParams.pagedirect= '';
            }
            vm.queryParams.id = id || '';
            // console.log(vm.queryParams)
            $rootScope.showLoadingBar = true;
            CollectorManageFactory.queryParklots(vm.queryParams).then(function (response) {
                if (response.status === 0  && response.data.length > 0) {
                    var list = response.data
                    vm.parklots = list;
                    console.log(vm.parklots)
                    if(!vm.queryParams.id){
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
                    }
                    
                } else {
                    if(response.data.length == 0){
                        logger.warning('查询到0条数据','','数据为空');
                    }else{
                        logger.error('获取停车场失败',response.detail,'获取停车场数据失败！！！');
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

        function searchParklots() {
            queryCollectors(0, vm.eventResult.model.id);

        }

        function clearAndRefresh(){
            vm.parklotAsync.selected = '';
            vm.queryParams.id = undefined,
            queryCollectors(0);
        }
        
        // 删除用户
        function updateParklot(parklot, type) {
            let str = type == 0?'关闭':'开启'
            console.log(parklot, type)
            if(confirm('确定'+str+'收费员APP功能吗？')){
                CollectorManageFactory.parklotConfigUpdate({id:parklot.id, is_active: type}).then(function (response) {
                    if(response.status == 0) {
                        logger.success('操作成功', '', response.detail);
                        vm.queryCollectors(0);
                    }else{
                        logger.error('操作失败','',response.detail);
                    }
                });
            }
        }
    }
})();
