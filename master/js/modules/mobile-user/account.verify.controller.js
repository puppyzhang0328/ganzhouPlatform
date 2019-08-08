/**
 * Created by huangxiang  on 2016/11/22 0022.
 * @author: huangxiang
 * Module:collector.controller.js
 * feature: collectormanage settings
 */
(function () {
    angular.module('app.mobile-user')
        .controller('accountVerifyController', accountVerifyController);

        accountVerifyController.$inject = ['Mobile_User','$rootScope','$scope', 'DTColumnDefBuilder', '$location', 'CollectorManageFactory', '$uibModal', '$cookies', 'datatablesOptions', 'logger','$timeout'];

    'use strict';
    function accountVerifyController(Mobile_User,$rootScope,$scope, DTColumnDefBuilder, $location, CollectorManageFactory, $uibModal, $cookies, datatablesOptions, logger, $timeout) {

        var vm = this;

        vm.querylists = querylists; // 查询所有用户的方法
        // vm.clearAndRefresh = clearAndRefresh;
        // vm.searchUsers = searchUsers; // 按用户名查找用户
        vm.verifyAccount = verifyAccount;  // 打开删除用户的modal
        // vm.queryParams = {
        //     start_index: null,
        //     pagedirect: '',
        //     staffid: '',
        //     maxId: null,
        //     minId: null,
        // };
        vm.queryParams = {
            page_num: 1,
            dis_num:20
        }
        // var maxRecordsId = null, minRecordsId = null; // 记录列表数据中的最大id和最小id
        vm.pageCount = 1;
        
        vm.querylists(0); // 初始化用户列表

        /*群组选择-------------------------------------------------*/
        
        // CollectorManageFactory.readAll().then(function (response) {
        //     if (response.status === 0) {
        //         vm.roleAsync = response.data;
        //     } else {
        //         logger.error('获取用户失败',response.detail,'获取用户数据失败！！！');
        //     }
        // });

        // vm.onSelectCallback = function (item) {
        //     vm.eventResult = {model: item};
        // };

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

       
        function querylists(index, staffid) {
            let curPage =  vm.queryParams.page_num
            if(index == 0){ // 查询首页
                vm.queryParams.page_num = 1;
            }else if(index == 1){ // 查询上一页
                if( curPage < 2 ){
                    logger.warning('已经到首页！','','没有上一页');
                    return;
                }
                vm.queryParams.page_num -=1;
            }else if(index == 2){ // 查询下一页
                if( curPage >  vm.pageCount -1){
                    logger.warning('已经到最后一页！','','没有下一页');
                    return;
                }
                vm.queryParams.page_num +=1;
            }else if(index == 3){ // 查询末页
                vm.queryParams.page_num = vm.pageCount;
            }
            // vm.queryParams.staffid = staffid || '';
            console.log(vm.queryParams)
            $rootScope.showLoadingBar = true;
            Mobile_User.queryVerifyList(vm.queryParams).then(function (response) {
                console.log(response)
                if (response.status === 0  && response.count > 0) {
                    var list = response.data;
                    vm.users = list;
                    let recordsCount =  response.count;

                    vm.pageCount =  Math.ceil(recordsCount/vm.queryParams.dis_num)
                    console.log(vm.pageCount, recordsCount/vm.queryParams.dis_num)
                } else {
                    if(response.data.length == 0){
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
            },6000); 
        }

        // function searchUsers() {
        //     querylists(0, vm.eventResult.model.id);

        // }

        // function clearAndRefresh(){
        //     vm.roleAsync.selected = '';
        //     querylists(0);
        // }
       
        // 删除用户
        function verifyAccount(user) {
            if(confirm('确定审核通过吗？')){
                Mobile_User.verifyAccount({id:user.id, pro_status: 'True'}).then(function (response) {
                    if (response.status === 0) {
                        logger.success('审核成功','','操作成功');
                        vm.querylists(0); 
                    } else {
                        logger.error('操作失败',response.detail,'审核失败！！！');
                    }
    
                    $timeout(function(){
                        $rootScope.showLoadingBar = false;
                    }); 
                });
            }
        }
    }
})();
