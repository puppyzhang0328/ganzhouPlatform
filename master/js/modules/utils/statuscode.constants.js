/**
 * statuscode.constants.js
 * @author: huangxiang
 * @create 2017-04-12 11:18
 * @feather 该常量文件描述的是http状态码为200的情况下，本应用后台返回的异常状态码
 */
(function(){

    angular.module('app.utils')
        .constant('StatusCode',{
            /*系统级别状态码*/
            SUCCESS: 0,  // 成功请求
            UNKNOWN_ERR: 10000, // 未知原因错误
            ERROR_PARAM: 10001,  // 参数错误
            LOST_PARAM: 10002, // 缺少必要参数
            DATABASE_ERROR: 10003, // 数据库错误
            NETWORK_ERROR: 10004,  // 网络错误
            NEED_LOGIN: 10005,  // 需要登录才能进行下一步操作
            NON_RIGHT: 10006,  // 没有权限
            INVALID_OPT: 10007, // 无效的操作
            FILE_OPERATOR_ERROR: 10008,  // 文件操作出错
            RSA_SIGN_ERROR: 10009,  // 签名出错
            /*账号模块*/
            VERIFY_CODE_EXPIRED: 20000,  // 验证码过期
            VERIFY_CODE_INVALID: 20001,  // 验证码无效
            VERIFY_CODE_WAIT: 20002,    // 请稍等验证码下发
            PHONE_NUMBER_REGISTERED: 20003,  // 该手机号码已经注册
            PHONE_NUMBER_NOT_REGISTERED: 20004, // 该手机号码未被注册
            USER_NO_PROFILE: 20005, // 该用户没有配置数据
            PAY_PASSWORD_ERROR: 20006,  // 支付密码错误
            PAY_PASSWORD_NOT_EXIST: 20007, // 没有支付密码
            TRADE_NUM_NOT_EXIST: 20008, // 该订单号不存在
            USER_PASSWORD_ERROR: 20009, // 用户密码错误
            NON_ADMINISTRATOR: 20010, // 不是管理员
            NO_SUCH_USER: 20011, // 没有该用户
            NO_SUCH_ROLE: 20012, // 没有该角色
            USERNAME_EXISTS: 20013, // 用户名已经存在
            NOT_OPERATOR: 20014, // 不是操作员
            NONE_AUTH_DEL_ROLE: 20015, // 没有权限删除用户组
            GROUPNAME_EXISTS: 20016, // 该用户组已经存在
            USER_NOT_ACTIVE: 20017, // 该用户未被激活
            /*支付模块*/
            NON_UNPAID_BILL: 30001, // 没有未支付的订单
            PAY_CHANNEL_NOT_SUPPORT: 30002, // 该支付方式不支持
            SERVICE_NOT_SUPPORT: 30003, // 该服务不支持
            SUCH_BILL_EXISTS: 30004, // 该账单已经存在
            NON_ENOUGH_BALANCE: 30005, // 余额不足
            NON_SUCH_BILL: 30006, // 没有该账单
            NON_BILL: 30007, // 没有账单
            BILL_PAID: 30008, // 订单已支付
            /*web后台模块*/
            NON_VALID_PACKNAME: 40001,  //不是有效的app包名
            NON_APP_REALEASE: 40002, // 没有app发布
            NON_SUCH_PARKLOT: 40003, // 没有该停车场
            SUCH_PARKLOT_EXITS: 40004, // 该停车场已经存在
            NON_PARKLOT: 40005, // 没有停车场
            NON_VEHICLEIN_RECORD: 40006, // 没有停车入场记录
            NON_VEHICLEOUT_RECORD: 40007, // 没有停车出场记录
            NON_OFFLINEPAY_RECORD: 40008, // 没有线下缴费记录
            NON_ONLINEPAY_RECORD: 40009, // 没有线上缴费记录
            NON_SUCH_PARKGATE: 40010, // 没有该停车场入口
            NON_PARKGATE: 40011, // 该停车场没有入口
            INVALID_PLATE_NUMBER: 40012, // 不正确的车牌号
            NON_VEHICLE_FOUND: 40013, // 不存在该号牌的车辆
            SUCH_PARKGATE_EXISTS: 40014, //该停车场入口已经存在
            NON_RECHARGE_RECORD: 40015, // 没有充值记录
            /*停车场模块*/
            NO_INOUT_RECORD: 50001, // 没有进出场记录
            /*app用户概况模块*/
            ONLY_APPUSER: 70001,  //仅限于APP用户
            HAS_NON_VEHICLE: 70002, //没有车辆
            HAS_NON_USER_PROFILE: 70003, //没有用户配置数据
            /*app版本模块*/
            NON_FILE_EXISTS: 80001, // 文件不存在
            NON_START_IMAGE: 80002, // 没有启动页图片
            NON_INDEX_IMAGE: 80003, // 没有首页页面图片
            NON_COVER_IMAGE: 80004, // 没有封面页图片
            SUCH_VERSION_EXISTS: 80005, // 该版本已经存在
            /*路边停车模块*/
            LUBO_REQUEST_ERROR: 90001 // 从路泊获取信息失败
            /*更多*/
        });
})();