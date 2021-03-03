import axios from 'axios';
import global from '../Global.js'
// 基础方法进行封装
function getApiBasic(url, postdata) {
    return  axios.post(url, postdata).then(function(data){
        let json = data.data;
        return json
    },function(response){
        console.info(response);
    })
}

// 调用的api改写成方法
export function worldDetail(postdata) {
        let url = headapi + 'worldDetail';
        return getApiBasic(url,postdata);
}

export function editbasicinfo(postdata) {
    let url = headapi + 'editbasicinfo';
    return getApiBasic(url,postdata);
}
export function modPwd(postdata) {
    let url = headapi + 'modPwd';
    return getApiBasic(url,postdata);
}
export function logout(postdata) {
    let url = headapi + 'logout';
    return getApiBasic(url,postdata);
}

// 调用的api改写成方法
export function testTable(postdata) {
    let url = headapi + 'testTable';
    return getApiBasic(url,postdata);
}
export function testSelect(postdata) {
    let url = headapi + 'testSelect';
    return getApiBasic(url,postdata);
}

export function testPic(postdata) {
    let url = headapi + 'testPic';
    return getApiBasic(url,postdata);
}

// 获取验证图片
export function GenVerifyPic(postdata) {
    let url = headapi + 'v1/Auth/GenVerifyPic';
    return getApiBasic(url, postdata);
}

// 手机获取验证码
export function GetPhoneVFCode(postdata) {
    let url = headapi + 'v1/Auth/GetPhoneVFCode';
    return getApiBasic(url, postdata);
}

export function SignIn(postdata) {
    let url = headapi + 'v1/Auth/SignIn';
    return getApiBasic(url,postdata);
}
// 手机登录
export function PhoneSignIn(postdata) {
    let url = headapi + 'v1/Auth/PhoneSignIn';
    return getApiBasic(url,postdata);
}

// 用户微信绑定
export function WXBind(postdata) {
    let url = headapi + 'v1/Auth/WXBind';
    return getApiBasic(url,postdata);
}

// 用户微信登录
export function WXSignIn(postdata) {
    let url = headapi + 'v1/Auth/WXSignIn';
    return getApiBasic(url,postdata);
}

// 用户微信解除绑定
export function WXUnbind(postdata) {
    let url = headapi + 'v1/Auth/WXUnbind';
    return getApiBasic(url,postdata);
}
// Weixin

// 预约课程
export function OderAddByVipUser(postdata) {
    let url = headapi + 'v1/Weixin/OderAddByVipUser';
    return getApiBasic(url,postdata);
}

// 取消预约
export function OderCancelByVipUser(postdata) {
    let url = headapi + 'v1/Weixin/OderCancelByVipUser';
    return getApiBasic(url,postdata);
}
// 预约记录查询
export function OrderListQuery(postdata) {
    let url = headapi + 'v1/Weixin/OrderListQuery';
    return getApiBasic(url,postdata);
}
// 可预约店铺信息查询
export function OrderShopQuery(postdata) {
    let url = headapi + 'v1/Weixin/OrderShopQuery';
    return getApiBasic(url,postdata);
}
// 可预约课程列表查询(未完成)
export function CanOrderSchoolTimeTableListQuery(postdata) {
    let url = headapi + 'v1/Weixin/CanOrderSchoolTimeTableListQuery';
    return getApiBasic(url,postdata);
}
// 消费记录查询
export function VipUserConsumeListQuery(postdata) {
    let url = headapi + 'v1/Weixin/VipUserConsumeListQuery';
    return getApiBasic(url,postdata);
}
// 用户自身信息查询
export function VipUserSelfQuery(postdata) {
    let url = headapi + 'v1/Weixin/VipUserSelfQuery';
    return getApiBasic(url,postdata);
}

// 某日课程表查询
export function SchoolTimeQueryByDate(postdata) {
    let url = headapi + 'v1/Weixin/SchoolTimeQueryByDate';
    return getApiBasic(url,postdata);
}

// 通过session查询用户自身信息
export function ManagerSelfQuery(postdata) {
    let url = headapi + 'v1/User/ManagerSelfQuery';
    return getApiBasic(url,postdata);
}

// 课程表预览
export function SchoolTimetablePreview(postdata) {
    let url = headapi + 'v1/SchoolTimeTable/SchoolTimetablePreview';
    return getApiBasic(url, postdata);
}
// CleCk查询
export function VipUserCleCkSum(postdata) {
    let url = headapi + 'v1/Weixin/VipUserCleCkSum';
    return getApiBasic(url, postdata);
}
// 查询下周是否有课
export function QueryNextWeek(postdata) {
    let url = headapi + 'v1/Weixin/QueryNextWeek';
    return getApiBasic(url, postdata);
}

// 用户店铺信息查询
export function MyShopQuery(postdata) {
    let url = headapi + 'v1/Weixin/MyShopQuery';
    return getApiBasic(url, postdata);
}


