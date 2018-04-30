/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://241701134.togetherfun.club';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        userUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        //匹配请求接口
        matchRequestUrl: `${host}/weapp/matchRequest`,
        
        //匹配请求接口
        confirmRequestUrl: `${host}/weapp/confirmRequest`,

        //获取队员信息逻辑接口
        getTeamMemberUrl: `${host}/weapp/getTeamMember`,

        //检查是否已经接受的请求接口
        checkIfAlreadyConfirmedUrl: `${host}/weapp/checkIfAlreadyConfirmed`,
    }
};

module.exports = config;
