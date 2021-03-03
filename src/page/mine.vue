<template>
    <div class="pages">
        <img src="../static/images/main/banner.png" width="100%"/>
        <div class="context">
              <span class="num">
                会员卡信息
            </span>
            <div class="user">
                <img src="../static/images/mine/User.png" height="53" width="53"/>
                <span>{{ user.Name }}</span>
                <em>{{ user.Phone | hidePhone}}</em>
            </div>
            <div class="value" v-for="s in schools">
                <div class="vTitle year" v-if="s.VipType == 1"><i></i>年会员</div>
                <div class="vTitle price" v-if="s.VipType == 2"><i></i>充值会员</div>
                <div class="vNum">
                    <span> {{ s.ShopName }}</span>
                    <div class="center">
                        总计{{ s.ClassHourToatal }}课时
                    </div>
                    <em v-if="s.VipType == 1">（有效期至{{ s.ExpTime |fmtTime }}）</em>
                </div>
                <mu-flex class="linear-progress">
                    <mu-linear-progress mode="determinate" :value="s.ClassHourRemain / s.ClassHourToatal *100"
                                        :size="10"
                                        color="secondary"></mu-linear-progress>
                </mu-flex>
                <div class="limit">
                    <em>剩余 {{ s.ClassHourRemain }} 课时</em>
                    <span>完成 {{ s.ClassHourConsume }} 课时</span>
                </div>
            </div>
            <div class="dataSum">
                <div class="row">
                    <em>卡路里（月度）</em>
                    <span>{{ ckRs.CleMonth }}</span>
                </div>
            </div>
            <div class="dataSum">
                <div class="row">
                    <em>总卡路里</em>
                    <span>{{ ckRs.Cle }}</span>
                </div>
            </div>
            <div class="dataSum">
                <div class="row">
                    <em>CK（月度）</em>
                    <span>{{ ckRs.CkMonth }}</span>
                </div>
            </div>
            <div class="dataSum">
                <div class="row">
                    <em>总CK</em>
                    <span>{{ ckRs.Ck }}</span>
                </div>
            </div>
            <div class="btn_center">
                <span class="btn btn-md login_btn" @click="logoutBtn">退出</span>
            </div>
        </div>
        <bottomTab :curTab="thisTab"></bottomTab>
    </div>
</template>

<script>
    import axios from 'axios';
    import bottomTab from '../components/bottomTab'
    import {
        VipUserSelfQuery,
        OrderShopQuery,
        VipUserCleCkSum,
        MyShopQuery,
        testSelect,
        testTable,
    } from '../api/getApiRes.js'

    let qs = require('qs');
    import Global from '../Global.js'

    export default {
        data() {
            return {
                num: 0,
                thisTab: '我的',
                active: 0,
                sum: 0,
                openAlert: false,
                list: [],
                dialog: {
                    id: '',
                    name: '',
                    timeLong: '',
                },
                user: {
                    Ck: 0,
                    CKMonth: 0,
                    Cle: 0,
                    CleMonth: 0,
                    CalorieMonth: 0,
                    CalorieTotal: 0,
                    ClassFinish: 0,
                    ClassRemain: 0,
                    ClassTotal: 0,
                    ExpTime: 0,
                    Name: '',
                    Phone: '',
                    VipType: 0,
                },
                ckRs: {
                    Ck: 0,
                    CKMonth: 0,
                    Cle: 0,
                    CleMonth: 0,
                },
                schools: [],
            }
        },
        mounted() {
            this.getInfo();
            this.getOrderShopQuery();
            this.getCalorie()
        },
        methods: {
            // 获得卡路里
            getCalorie() {
                let that = this;
                let param = {
                    token: localStorage.token,
                };
                let postdata = qs.stringify(param);
                VipUserCleCkSum(postdata).then(res => {
                    let json = res;
                    if (json.Code == 0) {
                        that.ckRs = json;
                    } else {
                        that.$toast.message(json.Memo);
                    }
                })
            },
            getOrderShopQuery() {
                let that = this;
                let param = {
                    token: localStorage.token,
                };
                let postdata = qs.stringify(param);
                // OrderShopQuery(postdata).then(res => {
                MyShopQuery(postdata).then(res => {
                    let json = res;
                    if (json.Code == 0) {
                        that.schools = json.Rs;
                    } else {
                        that.$toast.message(json.Memo);
                    }
                })
            },
            logoutBtn() {
                let that = this;
                this.$confirm('是否退出账号？', '提示', {
                    type: 'warning'
                }).then(({result}) => {
                    if (result) {
                        localStorage.token = '';
                        that.$router.push({path: '/login'});
                    } else {
                        that.$toast.message('点击了取消');
                    }
                });
            },
            getInfo() {
                let that = this;
                let param = {
                    token: localStorage.token,
                    active: this.active
                };
                let postdata = qs.stringify(param);
                VipUserSelfQuery(postdata).then(res => {
                    let json = res;
                    if (json.Code == 0) {
                        that.user = json.Rs;
                    } else {
                        that.$toast.message(json.Memo);
                    }
                })
            },
        },
        filters: {
            hidePhone: function (val) {
                var str = String(val)
                var len = str.length;
                if (len >= 7) {
                    var reg = str.slice(-8, -4)
                    return str.replace(reg, "****")
                } else if (len < 7 && len >= 6) {
                    var reg = str.slice(-4, -2)
                    return str.replace(reg, "**")
                }
            },
            fmtTime: function (value) {
                if (!value) {
                    return 0
                } else {
                    // js默认使用毫秒
                    value = value * 1000
                    let date = new Date(value);
                    let y = date.getFullYear();
                    let MM = date.getMonth() + 1;
                    MM = MM < 10 ? ('0' + MM) : MM;
                    let d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    let h = date.getHours();
                    h = h < 10 ? ('0' + h) : h;
                    let m = date.getMinutes();
                    m = m < 10 ? ('0' + m) : m;
                    let s = date.getSeconds();
                    s = s < 10 ? ('0' + s) : s;
                    return y + '-' + MM + '-' + d;
                }
            },
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                //因为当钩子执行前，组件实例还没被创建
                // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
                if (to.name == 'mine') {
                    vm.getInfo();
                }
            });
        },
        watch: {
            'active'() {
                console.log(123);
                this.getList();
            }
        },
        components: {
            bottomTab
        }
    }
</script>

<style scoped>
    .pages {
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: #F2F2F2;
    }

    .num {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        font-family: "PingFang SC";
        font-weight: 300;
        font-size: 14px;
        text-align: center;
        color: #909090;
        padding: 13px 0;
    }

    .user {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        height: 58px;
        background: #fff;
        padding: 17px 3%;
        margin-bottom: 10px;
    }

    .user img {
        width: 26.29px;
        height: 26.29px;
        float: left;
        margin-right: 11px;
    }

    .user span {
        font-family: "PingFang SC";
        font-weight: 500;
        font-size: 18px;
        text-align: left;
        color: #3b3b3b;
    }

    .user em {
        font-family: "PingFang SC";
        font-weight: normal;
        font-size: 18px;
        text-align: left;
        color: #3b3b3b;
        float: right;
    }

    .user p {
        font-family: "PingFang SC";
        font-weight: normal;
        font-size: 14px;
        text-align: left;
        color: #ffb43c;
        float: right;
        padding: 0;
        margin: 0;
        margin-left: 3px;
        line-height: 26px;
    }

    .value {
        width: 100%;
        /*height: 131px;*/
        background: #fff;
        padding: 13px 0;
    }

    .value .vTitle {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;

        font-family: "PingFang SC";
        font-weight: 300;
        font-size: 15px;
    }

    .vTitle i {
        width: 8px;
        height: 8px;
        display: inline-block;
        border-radius: 250px;
        margin-right: 3px;
    }

    .vTitle.year {
        color: #E75296;
    }

    .vTitle.year i {
        background: #e75296;
    }

    .vTitle.price {
        color: #FFB43C;
    }

    .vTitle.price i {
        background: #FFB43C;
    }

    .vNum {
        width: 100%;
        /*height: 25px;*/
        overflow: hidden;
        display: block;
        margin: 5px auto;
        margin-bottom: 0;
    }

    .center {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
    }

    .vNum em {
        position: relative;
        float: right;
        bottom: 20px;
        font-family: "PingFang SC";
        font-weight: 500;
        font-size: 12px;
        color: #c9c9c9;
        padding-right: 3%;
    }

    /deep/ .linear-progress {
        width: 90%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        border-radius: 250px;
    }

    .limit {
        width: 90%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-top: 8px;
    }

    .limit em {
        font-family: "PingFang SC";
        font-weight: 300;
        font-size: 12px;
        text-align: right;
        color: #e75296;
        padding-left: 10px;
    }

    .limit span {
        font-family: "PingFang SC";
        font-weight: 300;
        font-size: 12px;
        text-align: right;
        color: #909090;
        float: right;
        text-align: right;
        padding-right: 10px;
    }

    .dataSum {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: #fff;
        margin-top: 10px;
    }

    .dataSum .row {
        width: 90%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        padding: 2% 0;
    }

    .dataSum .row em {
        float: left;
        font-family: "PingFang SC";
        font-weight: 300;
        font-size: 18px;
        text-align: right;
        color: #3b3b3b;
    }

    .dataSum .row span {
        font-family: "PingFang SC";
        font-weight: 500;
        font-size: 18px;
        text-align: right;
        color: #3b3b3b;
        float: right;
    }

    .row .mid {
        width: 66%;
        height: 0px;
        background: transparent;
        border: 1px dotted #e0e0e0;
        float: left;
        margin-top: 11px;
        margin-right: 5px;
        margin-left: 10px;
    }

    .row .midl {
        width: 54%;
        height: 0px;
    }

    .login_btn {
        width: 96%;
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-top: 10px;
        margin-bottom: 30px;
        padding-left: 3%;
        padding-right: 3%;
        background: #E75296;
        color: #fff;
        font-size: 14px;
        text-align: center;
        border: none;
        padding: 0;
        font-size: 24px;
    }

    /deep/ .mu-warning-text-color {
        float: left;
    }

    .vNum span {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
    }

    @media only screen and (max-width: 640px) {

    }

    @media only screen and (max-width: 480px) {

    }

    @media only screen and (max-width: 375px) {
        .vNum em {
            padding-right: 0 !important;
        }

        .row .mid {
            width: 49%;
        }

        .row .midl {
            width: 44%;
            height: 0px;
        }
    }

    @media only screen and (max-width: 360px) {
        .vNum em {
            padding-right: 0 !important;
        }

        .row .mid {
            width: 49%;
        }

        .row .midl {
            width: 44%;
            height: 0px;
        }
    }

    @media only screen and (max-width: 320px) {

    }

    @media only screen and (min-width: 641px) {

    }
</style>
