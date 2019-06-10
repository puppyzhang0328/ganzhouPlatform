/**
 * Created by yumaotao  on 2017/11/27 0014.
 * @author: yumaotao
 * Module: muser.comment.controller.js
 * feature: 用户反馈建议初始化及设置
 */
(function () {
    'use strict';
    angular.module('app.mobile-user')
        .controller('replayCommentController',replayCommentController);
    replayCommentController.$inject = ['$uibModal','$location','userCommentFactory','commentUser','logger'];
    function replayCommentController($uibModal,$location,userCommentFactory,commentUser,logger) {
        var vm = this;
        vm.comments = '';
        vm.queryUserComment = queryUserComment;
        vm.backToPrevious = backToPrevious;
        vm.replayUser = replayUser;
        vm.queryUserComment();
        function queryUserComment(){
            userCommentFactory.getUserComment();
            commentUser.queryUserComment(userCommentFactory.getUserComment().comid).then(function(response){
                if(response.status == 0){
                    logger.success('查询序号为' + '"' + userCommentFactory.getUserComment().comid+ '"!', '查询成功');
                    vm.advice= response.superior[0];
                    vm.replay = response.reply;
                }else{
                    logger.error('查询序号为' + '"' +userCommentFactory.getUserComment().comid + '"!', '查询失败');
                }
            })
        }
        function backToPrevious() {
            $location.path('/app/mobile-user-comment');
        };
        function replayUser(){
            commentUser.ReplyUserComment(userCommentFactory.getUserComment().comid,vm.comments).then(function(response){
                if(response.status == 0){
                    logger.success('回复序号为' + '"' + userCommentFactory.getUserComment().comid+ '"!', '回复成功');
                    $location.path('/app/mobile-user-comment');
                }else{
                    logger.error('回复序号为' + '"' +userCommentFactory.getUserComment().comid + '"!', '回复失败');
                }
            })
        }
    }
})();
