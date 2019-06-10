(function () {
    angular.module('app.parking')
        .factory('induCardFactory', induCardFactory);
    'use strict';
    function induCardFactory(){
        var inducard = {
            CardId:'',//卡id
            CardNum:'',//卡号
            IsOnline:''//在线状态（1 在线    0 不在线）
        };
        return {
            setInduCard: setInduCard,
            getInduCard: getInduCard
        };
        function setInduCard(cInduCard) {
            inducard.CardId = cInduCard.CardId;
            inducard.CardNum = cInduCard.CardNum;
            inducard.IsOnline = cInduCard.IsOnline;
        }
        function getInduCard() {
            return inducard;
        }
    }
})();