(function () {
    'use strict';
    angular
        .module('parkhero', [
            'app.core',
            'app.routes',
            'app.sidebar',
            'app.navsearch',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.utils',
            'app.login',
            'app.logout',
            'app.operator',
            'app.collector',
            'app.parking',
            'app.vehicle',
            'app.prepayment',
            'app.bill',
            'app.appupdate',
            'app.picupload',
            'app.user-group',
            'app.mobile-user',
            'app.reconciliation',
            'app.logger',
            'app.welcome',
            'app.auth',
            'app.basicinfo',
            'app.console',
            'app.analysis',
            'app.iotdevice',
            'app.picuploadtest',
            'app.refund',
            'app.inforsetup',
            'app.unnormalbill'
        ])
        .config(InitSettingConfig)
        .constant('URL_SEED', {
            // API_URL: 'http://120.24.249.69:8000/parkhero/v0.1/',//哒哒服务器
            API_URL: 'http://dev.dadapark.com/parkhero/v0.1/', // 测试服务器
            // API_URL: 'http://xxtx.cszhjt.com/parkhero/v0.1/', // 湘行天下
            // API_URL: 'http://deploy.dadapark.com/parkhero/v0.1/', // 赣州服务器
            // API_IMGURL:'http://120.24.249.69:8000/park/',
            API_IMGURL:'http://dev.dadapark.com/park/',
            // API_IMGURL:'http://xxtx.cszhjt.com/park/',//静态图片地址
            // API_IMGURL:'http://deploy.dadapark.com/park/',//赣州静态图片地址
            // IMG_URL:'http://120.24.249.69:8000/parkhero/'//服务器资源地址
            IMG_URL:'http://dev.dadapark.com/parkhero/'//服务器资源地址
            // IMG_URL:'http://xxtx.cszhjt.com/parkhero/'
            // IMG_URL:'http://deploy.dadapark.com/parkhero/'//赣州服务器
        });
    InitSettingConfig.$inject = ['$httpProvider', '$compileProvider'];
    function InitSettingConfig($httpProvider, $compileProvider) {
        // 允许跨域请求
        $httpProvider.defaults.useXDomain = true;
        // 删除AngularJS默认的请求头
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        // 添加CSRF TOKEN header
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        // 使用$applyAsync 合并http请求
        $httpProvider.useApplyAsync(true);
        // 禁用debug信息
        $compileProvider.debugInfoEnabled(false);
    }
})();

