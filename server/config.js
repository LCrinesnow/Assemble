const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID wxfd5b73f81b4cbde5
    appId: 'wxfd5b73f81b4cbde5',

    // 微信小程序 App Secret 72aa7f31f690eef0e420d7a5cd6454e2
    appSecret: '72aa7f31f690eef0e420d7a5cd6454e2',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'bj-cdb-hg6ghuqx.sql.tencentcdb.com',  //改！
        port: 63593,
        user: 'root',
        db: 'cAuth',
        pass: 'rinesnow876',  //改！
        char: 'utf8mb4',
        dateStrings: 'datetime',
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
