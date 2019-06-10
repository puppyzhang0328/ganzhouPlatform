/**
 * basic.police.factory.js
 * @author: yumaotao
 * @create 2017/12/2
 */
(function () {
    angular.module('app.mobile-user')
        .factory('userCommentFactory', userCommentFactory);
    'use strict';
    function userCommentFactory(){
        var userComment = {
            id:'',//序号Id
            comments:'',//投诉内容
            created_time:'',//创建时间
            handle:false,//是否回复
            handler:'',//回复人
            user:'',//投诉人
        };
        return {
            setUserComment: setUserComment,
            getUserComment: getUserComment
        };
        function setUserComment(cUserComment) {
            userComment.id = cUserComment.id;
            userComment.comments = cUserComment.comments;
            userComment.created_time = cUserComment.created_time;
            userComment.handle = cUserComment.handle;
            userComment.handler = cUserComment.handler;
            userComment.user = cUserComment.user;
        }
        function getUserComment() {
            return userComment;
        }
    }
})();