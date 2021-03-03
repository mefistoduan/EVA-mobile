import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
// 全局插件
import Toast from 'muse-ui-toast';
import Loading from 'muse-ui-loading';


import Message from 'muse-ui-message';
Vue.use(Message);
import NProgress from 'muse-ui-progress';
Vue.use(NProgress);

// import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole
// let vConsole = new VConsole() // 初始化

Vue.use(MuseUI);
Vue.locale = () => {
};

let ToastConfig = {
    position: 'bottom',               // 弹出的位置
    time: 2000,                       // 显示的时长
    closeIcon: 'close',               // 关闭的图标
    close: true,                      // 是否显示关闭按钮
    successIcon: 'check_circle',      // 成功信息图标
    infoIcon: 'info',                 // 信息信息图标
    warningIcon: 'priority_high',     // 提醒信息图标
    errorIcon: 'warning'
};

Vue.use(Toast, ToastConfig);

Vue.use(Loading);

// 演示版本数据
require('./Mock/index.js');

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');

Vue.prototype.axios = axios;


//Toast
Vue.prototype.Toast = function (e, color) {
    let ToastColor = !color ? 'warning' : color;
    let that = this;
    switch (ToastColor) {
        case 'message':
            that.$toast.message(e);
            break;
        case 'success':
            that.$toast.success(e);
            break;
        case 'info':
            that.$toast.info(e);
            break;
        case 'warning':
            that.$toast.warning(e);
            break;
        case 'error':
            that.$toast.error(e);
            break;
    }
};

// loading
Vue.prototype.Loading = function (target) {
    let loading = this.$loading({
        overlayColor: 'hsla(0,0%,100%,.9)',        // 背景色
        size: 48,
        color: 'warning',                           // color
    });
    setTimeout(() => {
        loading.close();
    }, 3000)
};

Vue.prototype.TransMemo = function (text) {
    let that = this;
    switch (text) {
        case '记录不存在':
            that.$toast.error(that.$t('Record does not exist'));
            break;
        case '服务器繁忙，请稍后再试':
            that.$toast.error(that.$t('The server is busy. Please try again later'));
            break;
        case '服务暂不可用':
            that.$toast.error(that.$t('Service is temporarily unavailable'));
            break;
        case 'key不存在':
            that.$toast.error(that.$t('Key does not exist'));
            break;
        case '用户名或密码错误':
            that.$toast.error(that.$t('Wrong user name or password'));
            break;
        case '图形验证码错误':
            that.$toast.error(that.$t('Graphic verification code error'));
            break;
        case '密码格式错误':
            that.$toast.error(that.$t('Password format error'));
            break;
        case '密码错误':
            that.$toast.error(that.$t('Password error'));
            break;
        case '用户已存在':
            that.$toast.error(that.$t('User already exists'));
            break;
        case '发送频率过高':
            that.$toast.error(that.$t('Transmission frequency too high'));
            break;
        case '用户被禁用':
            that.$toast.error(that.$t('User is disabled'));
            break;
        case '用户状态异常':
            that.$toast.error(that.$t('Abnormal user status'));
            break;
        case '用户不存在':
            that.$toast.error(that.$t('user does not exist'));
            break;
        case '验证码错误':
            that.$toast.error(that.$t('Verification code error'));
            break;
        case '登录失效':
            that.$toast.error(that.$t('Logon failure'));
            break;
        case 'MAC已存在':
            that.$toast.error(that.$t('MAC already exists'));
            break;
        case '不是完整的逗号分隔列表格式':
            that.$toast.error(that.$t('Is not a complete comma separated list format'));
            break;
        case 'HBase错误':
            that.$toast.error(that.$t('HBase error'));
            break;
        case '请重新上传图片':
            that.$toast.error(that.$t('Please upload the picture again'));
            break;
        default:
            that.$toast.error(text);
            break
    }
};
