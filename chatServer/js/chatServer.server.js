define(function () {
    'use strict';
    var chatServer = chatServer || {
        // 发送并存储消息记录
        sendMsg: function (from) {
            var data = {
                cityName: yf.getItem('userInfo').city,
                bussinessId: from.bussinessId,
                msgType: from.msgType,
                sendTime: from.sendTime,
                msgContent: from.msgContent
            }
            return $.ajax({
                type: "post",
                data: data,
                dataType: 'json',
                url: "/api/v1/artificialNuclearValence/msgSend",
            });
        },
        // 获取消息记录
        queryMsgLogs: function (from) {
            var data = {
                positionNo: from.positionNo,
                rqNums: from.rqNums
            }
            return $.ajax({
                type: "get",
                data: data,
                dataType: 'json',
                url: "/api/v1/artificialNuclearValence/" + yf.getItem('userInfo').city + "/" + from.sessionId + "/mqmRecordsGet",
            });
        },
        // 查询核价列表
        getOjbectList: function () {
            return $.ajax({
                type: "get",
                dataType: 'json',
                async: false,
                url: "/api/v1/artificialNuclearValence/" + yf.getItem('userInfo').city + "/mqRecordsByDay",
            });
        },
        // 根据sessionId查找是否存在核价记录
        isExistLog: function (from) {
            return $.ajax({
                type: "get",
                dataType: 'json',
                url: "/api/v1/artificialNuclearValence/mqRecordsDetail/" + yf.getItem('userInfo').city + "/" + from.sessionId,
            });
        },
        // appkey
        wsAppKeyGet: function () {
            return $.ajax({
                type: "get",
                dataType: 'json',
                async: false,
                url: "/api/v1/artificialNuclearValence/" + yf.getItem('userInfo').city + "/wsAppKeyGet",
            });
        },
        // 根据核价记录id更新核价对象数据 排到最前
        activationRecord: function (from) {
            var data = {
                bussinessId: from.bussinessId,
                cityName: yf.getItem('userInfo').city
            }
            return $.ajax({
                type: "post",
                data: data,
                dataType: 'json',
                async: false,
                url: "/api/v1/artificialNuclearValence/activationRecord",
            });
        },
    }
    return chatServer;
});
