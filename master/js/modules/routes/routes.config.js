/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/
(function () {
    'use strict';
    angular
        .module('app.routes')
        .config(routesConfig);
    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        // 去除URL中的#号 true:去除  false:关闭，即不去除
        $locationProvider.html5Mode({
            enabled: false, // 关闭
            requireBase: false
        });
        // defaults to dashboard
        $urlRouterProvider.otherwise('/page/login');
        // Application Routes
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app/app.html'),
                resolve: helper.resolveFor('modernizr', 'icons')
            })
            .state('app.welcome', {
                url: '/welcome',
                title: '欢迎登录本系统',
                templateUrl: helper.basepath('common/welcome.html')
            })
            .state('app.no-auth',{
                url: '/no-auth',
                title: '没有访问权限',
                templateUrl: helper.basepath('common/403error.html')
            })
            //- 用户管理
            .state('app.operator', {
                url: '/operator',
                title: '用户管理',
                templateUrl: helper.basepath('operator/operator.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-operator', {
                url: '/add-operator',
                title: '新增用户',
                templateUrl: helper.basepath('operator/add-operator.html'),
                resolve: helper.resolveFor('lodash')
            })
            .state('app.modify-operator', {
                url: '/modify-operator',
                title: '修改用户',
                templateUrl: helper.basepath('operator/modify-operator.html'),
                resolve: helper.resolveFor('lodash')
            })
            .state('app.manage-group-user',{
                url: '/manage-group-user',
                title: '集团用户管理',
                templateUrl: helper.basepath('group/manage-group-user.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.modify-group-user',{
                url: '/modify-group-user',
                title: '修改集团用户权限',
                templateUrl: helper.basepath('group/modify-group-user.html'),
                resolve: helper.resolveFor('lodash')
            })
            // 收费员app用户管理
            .state('app.collector', {
                url: '/collector',
                title: '收费员APP用户管理',
                templateUrl: helper.basepath('collector/collector.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-collector', {
                url: '/add-collector',
                title: '新增用户',
                templateUrl: helper.basepath('collector/add-collector.html'),
                resolve: helper.resolveFor('lodash')
            })
            .state('app.modify-collector', {
                url: '/modify-collector',
                title: '修改用户',
                templateUrl: helper.basepath('collector/modify-collector.html'),
                resolve: helper.resolveFor('lodash')
            })
            //- 群组管理
            .state('app.user-group', {
                url: '/user-group',
                title: '群组列表',
                templateUrl: helper.basepath('group/user-group.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-group', {
                url: '/user-group/add-group',
                title: '群组管理|添加群组',
                templateUrl: helper.basepath('group/add-group.html')
            })
            .state('app.modify-group', {
                url: '/user-group/modify-group',
                title: '群组管理|修改群组',
                templateUrl: helper.basepath('group/modify-group.html')
            })
            //- 停车场管理
            .state('app.parking', {
                url: '/parking',
                title: '停车场管理',
                templateUrl: helper.basepath('parking/parking.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-new-parking', {
                url: '/parking/add-new-parking',
                title: '新增停车场',
                templateUrl: helper.basepath('parking/add-parking.html')
            })
            .state('app.modify-parking', {
                url: '/parking/modify-parking',
                title: '修改停车场信息',
                templateUrl: helper.basepath('parking/modify-parking.html')
            })
            .state('app.parking-pic', {
                url: '/parkPic/parking-pic',
                title: '停车场图片管理',
                templateUrl: helper.basepath('parkPic/parking-pic.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.parking-pic-upload', {
                url: '/parkPic/parking-pic-upload',
                title: '停车场图片上传',
                templateUrl: helper.basepath('parkPic/parking-pic-upload.html')
            })
            .state('app.parking-updatapic', {
                url: '/parkPic/parking-updatapic',
                title: '停车场图片修改',
                templateUrl: helper.basepath('parkPic/parking-updatapic.html')
            })
            .state('app.parking-baidu-map', {
                url: '/parking/parking-baidu-map',
                title: '停车场地理位置',
                templateUrl: helper.basepath('parking/parking-baidu-map.html')
            })
            .state('app.parking-state', {
                url: '/parking/parking-state',
                title: '上传工具状态检测',
                templateUrl: helper.basepath('parking/parking-state.html'),
                resolve: helper.resolveFor('ui.grid', 'localytics.directives')
            })
            .state('app.parking-network', {
                url: '/parking/parking-network',
                title: '网络状态检测',
                templateUrl: helper.basepath('parking/parking-network.html'),
                resolve: helper.resolveFor('ui.grid', 'localytics.directives')
            })
            .state('app.parking-baidu-map-state', {
                url: '/parking/parking-baidu-map-state',
                title: '停车场地理位置(状态)',
                templateUrl: helper.basepath('parking/parking-baidu-map-state.html')
            })
            // 停车记录
            .state('app.vehicle-in', {
                url: '/parking/parking-vehicle-in',
                title: '停车入场记录',
                templateUrl: helper.basepath('parking/vehicle-in.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.vehicle-out', {
                url: '/parking/parking-vehicle-out',
                title: '停车出场记录',
                templateUrl: helper.basepath('parking/vehicle-out.html'),
                resolve: helper.resolveFor('ui.grid', 'localytics.directives')
            })
            // 缴费记录
            .state('app.online-prepayment', {
                url: '/prepayment/online-prepayment',
                title: '线上缴费纪录',
                templateUrl: helper.basepath('bill/online-payment.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.online-detail', {
                url: '/online-detail',
                title: '线上缴费纪录',
                templateUrl: helper.basepath('bill/online-bill-detail.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            //线上退款记录
            .state('app.refund-detail', {
                url: '/refund-detail',
                title: '线上缴费纪录',
                templateUrl: helper.basepath('refund/refund-detail.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.online-wechatpay', {
                url: '/bill/online-wechatpay',
                title: '线上缴费纪录',
                templateUrl: helper.basepath('bill/online-wechatpay.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.online-alipay', {
                url: '/bill/online-alipay',
                title: '线上缴费纪录',
                templateUrl: helper.basepath('bill/online-alipay.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.online-dadapay', {
                url: '/bill/online-dadapay',
                title: '线上缴费纪录',
                templateUrl: helper.basepath('bill/online-dadapay.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            //长沙银行充值记录
            .state('app.online-bcspay-recharge', {
                url: '/bill/online-bcspay-recharge',
                title: '长沙银行充值记录',
                templateUrl: helper.basepath('bill/online-bcspay-recharge.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            //长沙银行消费记录
            .state('app.online-bcspay-pay', {
                url: '/bill/online-bcspay-pay',
                title: '长沙银行消费记录',
                templateUrl: helper.basepath('bill/online-bcspay-pay.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            //账单退款流程
            .state('app.refund', {
                url: '/bill/refund',
                title: '长沙银行消费记录',
                templateUrl: helper.basepath('refund/refund.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            //婚庆园消费
            .state('app.online-hqypay-pay', {
                url: '/bill/online-hqypay-pay',
                title: '婚庆园消费',
                templateUrl: helper.basepath('bill/online-hqypay.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            //充值记录
            .state('app.online-alipay-recharge', {
                url: '/bill/online-alipay-recharge',
                title: '线上缴费纪录',
                templateUrl: helper.basepath('bill/online-alipay-recharge.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.online-wechatpay-recharge', {
                url: '/bill/online-wechatpay-recharge',
                title: '线上缴费纪录',
                templateUrl: helper.basepath('bill/online-wechatpay-recharge.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.offline-prepayment', {
                url: '/prepayment/offline-prepayment',
                title: '线下缴费纪录',
                templateUrl: helper.basepath('bill/offline-payment.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            // 账单管理
            .state('app.online-bill',{
                url: '/parking-bill/online-bill',
                title: '线上账单查询',
                templateUrl: helper.basepath('bill/online-bill.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.account-balance',{
                url: '/parking-bill/account-balance',
                title: '对账',
                templateUrl: helper.basepath('account/account-balance.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.offline-bill', {
                url: '/parking-bill/offline-bill',
                title: '线下缴费账单',
                templateUrl: helper.basepath('bill/offline-bill.html'),
                resolve: helper.resolveFor('ui.grid', 'localytics.directives')
            })
            .state('app.reconciliation', {
                url: '/reconciliation',
                title: '对账',
                templateUrl: helper.basepath('account/reconciliation.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            // APP设置
            .state('app.apk-update', {
                url: '/app-setting/app-update',
                title: 'app在线升级',
                templateUrl: helper.basepath('app/apk-update.html'),
                resolve: helper.resolveFor('filestyle')
            })
            .state('app.app-pic-upload', {
                url: 'app-setting/app-pic-update',
                title: 'APP图片上传',
                templateUrl: helper.basepath('app/app-pic-upload.html'),
                resolve: helper.resolveFor('filestyle')
            })
            .state('app.Information-setup', {
                url: '/app-setting/app-Information-setup',
                title: 'APP资讯设置',
                templateUrl: helper.basepath('app/app-Information-setup.html'),
                resolve: helper.resolveFor('filestyle')
            })
            .state('app.Information-addsetup', {
                url: '/app-setting/app-Information-addsetup',
                title: 'APP资讯新增',
                templateUrl: helper.basepath('app/app-Information-addsetup.html'),
                resolve: helper.resolveFor('filestyle')
            })
            .state('app.Information-modifysetup', {
                url: '/app-setting/app-Information-modifysetup',
                title: 'APP资讯修改',
                templateUrl: helper.basepath('app/app-Information-modifysetup.html'),
                resolve: helper.resolveFor('filestyle')
            })
            .state('app.mobile-user', {
                url: '/mobile-user',
                title: 'APP用户管理',
                templateUrl: helper.basepath('app/mobile-user-manage.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.user-pay', {
                url: '/user-pay',
                title: 'APP消费',
                templateUrl: helper.basepath('app/user_pay.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.mobile-user-comment', {
                url: '/mobile-user-comment',
                title: '用户反馈建议',
                templateUrl: helper.basepath('app/mobile-user-comment.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.replay-comment', {
                url: '/replay-comment',
                title: '用户反馈建议',
                templateUrl: helper.basepath('app/replay_comment.html')
            })
            // Pages Routes
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons'),
                controller: ['$rootScope', function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }],
                controllerAs: 'vm'
            })
            .state('page.login', {
                url: '/login',
                title: '云平台登录',
                templateUrl: 'app/pages/login.html'
            })
            .state('page.lock', {
                url: '/lock',
                title: '锁定屏幕',
                templateUrl: 'app/pages/lock.html'
            })

            // wxpay routes
            .state('wxpay',{
                url: '/wxpay',
                templateUrl: 'app/wechat/wxpay.html',
                resolve: helper.resolveFor('modernizr','icons')
            })
            .state('wxpay.query',{
                url: '/wxpay/query',
                templateUrl: 'app/wechat/query.html'
            })
            .state('wxpay.dadapay',{
                url: '/wxpay/dadapay',
                templateUrl: 'app/wechat/dadapay.html'
            })
            //- 区域信息管理
            .state('app.region', {
                url: '/region',
                title: '区域管理',
                templateUrl: helper.basepath('region/region.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-new-region', {
                url: '/region/add-new-region',
                title: '新增停区域',
                templateUrl: helper.basepath('region/add-region.html')
            })
            .state('app.modify-region', {
                url: '/region/modify-region',
                title: '修改区域信息',
                templateUrl: helper.basepath('region/modify-region.html')
            })
            //- 商圈信息
            .state('app.town', {
                url: '/town',
                title: '区域管理',
                templateUrl: helper.basepath('town/town.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-new-town', {
                url: '/town/add-new-town',
                title: '新增停区域',
                templateUrl: helper.basepath('town/add-town.html')
            })
            .state('app.modify-town', {
                url: '/town/modify-town',
                title: '修改区域信息',
                templateUrl: helper.basepath('town/modify-town.html')
            })
            //- 停车场性质信息表
            .state('app.bustype', {
                url: '/bustype',
                title: '停车场性质信息表',
                templateUrl: helper.basepath('bustype/bustype.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-new-bustype', {
                url: '/bustype/add-new-bustype',
                title: '新增停车场性质信息表',
                templateUrl: helper.basepath('bustype/add-bustype.html')
            })
            .state('app.modify-bustype', {
                url: '/bustype/modify-bustype',
                title: '修改停车场性质信息表',
                templateUrl: helper.basepath('bustype/modify-bustype.html')
            })
            //控制台
            .state('app.console', {
                url: '/console',
                title: '控制台',
                templateUrl: helper.basepath('console/console.html'),
                resolve: helper.resolveFor('highcharts')
            })
            //- 优惠券相关页面
            .state('app.coupon', {
                url: '/coupon',
                title: '优惠券界面',
                templateUrl: helper.basepath('coupon/coupon.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-new-coupon', {
                url: '/coupon/add-new-coupon',
                title: '新增优惠券界面',
                templateUrl: helper.basepath('coupon/add-coupon.html')
            })
            .state('app.modify-coupon', {
                url: '/coupon/modify-coupon',
                title: '修改优惠券界面',
                templateUrl: helper.basepath('coupon/modify-coupon.html')
            })
            .state('app.coupon-man', {
                url: '/coupon-man',
                title: '用户优惠券情况',
                templateUrl: helper.basepath('couponman/coupon-man.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            //- 组织模块
            .state('app.organ', {
                url: '/organ',
                title: '组织管理',
                templateUrl: helper.basepath('organ/organ.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-new-organ', {
                url: '/organ/add-new-organ',
                title: '新增组织',
                templateUrl: helper.basepath('organ/add-organ.html')
            })
            .state('app.modify-organ', {
                url: '/organ/modify-organ',
                title: '修改组织信息',
                templateUrl: helper.basepath('organ/modify-organ.html')
            })
            //- 派出所信息
            .state('app.police', {
                url: '/police',
                title: '派出所信息',
                templateUrl: helper.basepath('police/police.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-new-police', {
                url: '/police/add-new-police',
                title: '新增派出所信息',
                templateUrl: helper.basepath('police/add-police.html')
            })
            .state('app.modify-police', {
                url: '/police/modify-police',
                title: '修改派出所信息',
                templateUrl: helper.basepath('police/modify-police.html')
            })
            //- 平台信息
            .state('app.platform', {
                url: '/platform',
                title: '平台信息',
                templateUrl: helper.basepath('platform/platform.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-new-platform', {
                url: '/platform/add-new-platform',
                title: '新增平台信息',
                templateUrl: helper.basepath('platform/add-platform.html')
            })
            .state('app.modify-platform', {
                url: '/platform/modify-platform',
                title: '修改平台信息',
                templateUrl: helper.basepath('platform/modify-platform.html')
            })
            //平台权限管理
            .state('app.platform-power', {
                url: '/platform-power',
                title: '平台权限管理',
                templateUrl: helper.basepath('platformpower/platform-power.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.modify-platform-power', {
                url: '/platform/modify-platform-power',
                title: '修改平台信息',
                templateUrl: helper.basepath('platformpower/modify-platform-power.html')
            })
            //- 市局派出所信息
            .state('app.bureau', {
                url: '/bureau',
                title: '派出所信息',
                templateUrl: helper.basepath('bureau/bureau.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-new-bureau', {
                url: '/bureau/add-new-bureau',
                title: '新增派出所信息',
                templateUrl: helper.basepath('bureau/add-bureau.html')
            })
            .state('app.modify-bureau', {
                url: '/bureau/modify-bureau',
                title: '修改派出所信息',
                templateUrl: helper.basepath('bureau/modify-bureau.html')
            })
            //- 社区信息
            .state('app.community', {
                url: '/community',
                title: '派出所信息',
                templateUrl: helper.basepath('community/community.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-new-community', {
                url: '/community/add-new-community',
                title: '新增社区信息',
                templateUrl: helper.basepath('community/add-community.html')
            })
            .state('app.modify-community', {
                url: '/community/modify-community',
                title: '修改社区信息',
                templateUrl: helper.basepath('community/modify-community.html')
            })
            //- 基础信息导入
            .state('app.export', {
                url: '/export',
                title: '基础数据导入',
                templateUrl: helper.basepath('export/export.html'),
                resolve: helper.resolveFor('export')
            })
            //- 停车场报表
            .state('app.analysis-pay', {
                url: '/analysis-pay',
                title: '停车场报表',
                templateUrl: helper.basepath('analysis/analysis-pay.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.analysis-region', {
                url: '/analysis-region',
                title: '区域报表',
                templateUrl: helper.basepath('analysis/analysis-region.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.analysis-town', {
                url: '/analysis-town',
                title: '商圈报表',
                templateUrl: helper.basepath('analysis/analysis-town.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.analysis-bustype', {
                url: '/analysis-bustype',
                title: '停车场类型报表',
                templateUrl: helper.basepath('analysis/analysis-bustype.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.analysis-user', {
                url: '/analysis-user',
                title: '用户统计报表',
                templateUrl: helper.basepath('analysis/analysis-user.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.analysis-account', {
                url: '/analysis-account',
                title: '财务统计报表',
                templateUrl: helper.basepath('analysis/analysis-account.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.analysis-organ', {
                url: '/analysis-organ',
                title: '组织统计报表',
                templateUrl: helper.basepath('analysis/analysis-organ.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.analysis-app-user', {
                url: '/analysis-pp-user',
                title: 'app用户推广统计',
                templateUrl: helper.basepath('analysis/analysis-app-user.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.paySettlement', {
                url: '/paySettlement',
                title: '结算页面',
                templateUrl: helper.basepath('paySettlement/paySettlement.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.paySettlement-detail', {
                url: '/paySettlement-detail',
                title: '结算页面',
                templateUrl: helper.basepath('paySettlement/paySettlement-detail.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            //停车场功能设置
            .state('app.park-power', {
                url: '/parkPower',
                title: '停车场功能设置',
                templateUrl: helper.basepath('parkpower/park-power.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.park-power-add', {
                url: '/parkPowerAdd',
                title: '停车场功能新增',
                templateUrl: helper.basepath('parkpower/add-park-power.html')
            })
            .state('app.park-power-modify', {
                url: '/parkPowerModify',
                title: '停车场功能修改',
                templateUrl: helper.basepath('parkpower/modify-park-power.html')
            })
            //停车场功能配置
            .state('app.park-action', {
                url: '/parkAction',
                title: '停车场功能配置',
                templateUrl: helper.basepath('parkingaction/park-action.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.park-action-add', {
                url: '/parkActionAdd',
                title: '停车场功能新增',
                templateUrl: helper.basepath('parkingaction/add-park-action.html')
            })
            .state('app.park-action-modify', {
                url: '/parkActionModify',
                title: '停车场功能修改',
                templateUrl: helper.basepath('parkingaction/modify-park-action.html')
            })
            .state('app.reconcile', {
                url: '/reconcile',
                title: '停车场对账',
                templateUrl: helper.basepath('reconcile/reconcile.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.settlement', {
                url: '/settlement',
                title: '停车场对账',
                templateUrl: helper.basepath('reconcile/settlement.html'),
                resolve: helper.resolveFor('ui.grid', 'localytics.directives','analysis-highcharts')
            })
            .state('app.organReconcile', {
                url: '/organReconcile',
                title: '停车场对账',
                templateUrl: helper.basepath('reconcile/organReconcile.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.iotdevice', {
                url: '/iotdevice',
                title: '设备管理',
                templateUrl: helper.basepath('iotdevice/iotdevice.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.add-iotdevice', {
                url: '/addIotdevice',
                title: '新增设备管理',
                templateUrl: helper.basepath('iotdevice/add-iotdevice.html')
            })
            .state('app.modify-iotdevice', {
                url: '/modifyIotdevice',
                title: '新增设备管理',
                templateUrl: helper.basepath('iotdevice/modify-iotdevice.html')
            })
            .state('app.park-state', {
                url: '/parkstate',
                title: '停车场状态',
                templateUrl: helper.basepath('park-state/park-state.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.net-state', {
                url: '/netstate',
                title: '停车场状态',
                templateUrl: helper.basepath('park-state/net-state.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.inducement', {
                url: '/inducement',
                title: '诱导屏设置',
                templateUrl: helper.basepath('inducement/inducement.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.dataTmp', {
                url: '/dataTmp',
                title: '第三方数据监控',
                templateUrl: helper.basepath('dataTmpObject/dataTmpObject.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.examine', {
                url: '/examine',
                title: '账单审核',
                templateUrl: helper.basepath('examine/examine.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.examineGroup', {
                url: '/examineGroup',
                title: '账单审核',
                templateUrl: helper.basepath('examine/examineGroup.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.groupBill', {
                url: '/groupBill',
                title: '组织用户账单查询',
                templateUrl: helper.basepath('examine/groupBill.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.parkBill', {
                url: '/parkBill',
                title: '停车场用户账单查询',
                templateUrl: helper.basepath('examine/parkBill.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.induCard', {
                url: '/induCard',
                title: '诱导屏卡设置',
                templateUrl: helper.basepath('inducement/induCard.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.induCard-add', {
                url: '/induCardAdd',
                title: '诱导屏卡设置',
                templateUrl: helper.basepath('inducement/add-inducard.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.induCardModify', {
                url: '/induCardModify',
                title: '诱导屏卡设置',
                templateUrl: helper.basepath('inducement/modify-inducard.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.unnormal-bill', {
                url: '/unnormal-bill',
                title: '平台异常账单',
                templateUrl: helper.basepath('nonormalbill/unnormal-bill.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.third-bill', {
                url: '/third-bill',
                title: '第三方异常账单',
                templateUrl: helper.basepath('nonormalbill/third-bill.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
            .state('app.appunnormal-bill', {
                url: '/appunnormal-bill',
                title: 'APP异常账单',
                templateUrl: helper.basepath('nonormalbill/appunnormal-bill.html'),
                resolve: helper.resolveFor('datatables', 'datatables.bootstrap', 'datatables.buttons')
            })
    }
})();

