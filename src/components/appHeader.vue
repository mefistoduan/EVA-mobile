<template>
    <div id="appHeader">
        <div id="headerContent">
            <mu-appbar style="width: 100%;" color="primary">
                <mu-button icon slot="left">
                    <mu-button ref="button" @click="open = !open">
                        <img src="../static/images/comm/list.png" alt="" class="listBtn">
                    </mu-button>
                    <mu-popover cover :open.sync="open" :trigger="trigger">
                        <mu-list>
                            <mu-list-item button :class="[{'active':t == curLi},'modalLi' ]"
                                          v-for="(panel,t) in panelData" :key="panel.tabs" @click="goPage(panel)">
                                <mu-list-item-title>
                                    <!--<span :class="panel.img"></span>-->
                                    <mu-icon :value="panel.img"></mu-icon>
                                    <s>{{panel.name}}</s>
                                </mu-list-item-title>
                            </mu-list-item>
                        </mu-list>
                    </mu-popover>
                </mu-button>
                {{curTitle}}
                <mu-menu slot="right">
                    <img src="../static/images/comm/user.png" alt="" class="userBtn">
                </mu-menu>
            </mu-appbar>
            <div class="alertRed" v-show="alertState && title == '系统首页'">
                <em>
                    <i class="curIcon yellowTri"></i>
                    发现危险设备{{dangerNum}} {{$t("item")}}
                </em>
                <span @click="goRuntime">{{$t("Suspicious device")}}MAC：{{mac}} 品牌：{{MacCom}} <i
                        @click="closeAlert">×</i></span>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    let qs = require('qs');
    export default {
        data() {
            return {
                open: false,
                trigger: null,
                curLi: 0,
                curTitle: this.title,
                alertState: false,
                dangerNum: 0,
                mac: '',
                MacCom: '',
                panelData: [
                    {name: this.$t('System home page'), path: '', img: 'home', tabs: 1},
                    {name: this.$t('User list'), path: 'usermanage', img: 'account_box', tabs: 2},
                    {name: this.$t('Enterprise list'), path: 'enterprisemanage', img: 'assignment', tabs: 3},
                    {name: this.$t('Detection equipment'), path: 'detector', img: 'laptop', tabs: 4},
                    {name: this.$t('Detection record'), path: 'record', img: 'reorder', tabs: 5},
                    {name: this.$t('Statistical report forms'), path: 'statis', img: 'receipt', tabs: 6},
                    {name: this.$t('System setup'), path: 'setting', img: 'settings', tabs: 7},
                    {name: this.$t('whiteList'), path: 'white', img: 'view_list', tabs: 8},
                    {name: this.$t('Real-time monitoring'), path: 'runtime', img: 'poll', tabs: 9},
                ]
            }
        },
        props: ['title'],
        mounted() {
            this.trigger = this.$refs.button.$el;
            this.timer = setInterval(() => {
                this.readAlert();
            }, 5000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
        methods: {
            goPage(panel) {
                console.log(panel);
                this.$emit('goNewpage', panel.path);
                this.open = false;
            },
            goRuntime() {
                this.alertState = false;
                this.$emit('goNewpage', 'runtime');
                this.open = false;
            },
            // 读取警告信息
            readAlert() {
                const that = this;
                let url = headapi + 'v1/Detector/DetectedMacs';
                // let url = headapi + 'v1/Detector/DetectedMacsTest';//test
                let param = {
                    token: localStorage.token,
                };
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        if (json.Rs) {
                            if (localStorage.alertState == true) {
                                that.alertState = true;
                            } else {
                                that.alertState = false;
                            }
                            that.dangerNum = json.Rs.length;
                            that.mac = json.Rs[0].Mac;
                            if (json.Rs[0].MacCom) {
                                that.MacCom = json.Rs[0].MacCom.substr(0, 9) + '...';
                            }

                        }
                    }
                    if (json.Code == 1010) {
                        that.$router.push({path: '/login'});
                    }
                }, function (response) {
                    that.$router.push({path: '/login'});
                    console.info(response);
                })
            },
            closeAlert() {
                this.alertState = false
            }
        },
    }
</script>

<style scoped>
    #appHeader {
        width: 100%;
        height: 55px;
        z-index: 99999;
    }
    #headerContent {
        width: 100%;
        position: absolute;
        z-index: 99999;
        top: 0;
    }
    /deep/ .mu-appbar-title {
        text-align: center;
    }

    .mu-raised-button {
        background: none;
        box-shadow: none;
    }

    .listBtn {
        width: 20px;
        height: 14px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-top: 0px;
    }

    .userBtn {
        width: 28px;
        height: 28px;
        margin-top: 15px;
        margin-right: 15px;
    }

    .mu-appbar {
        background: url("../static/images/comm/headerBg.png") top center no-repeat;
        background-size: 100%;
    }

    /*icon iconHome*/
    .iconHome {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconHome.png") top center no-repeat;
        background-size: 100%;
    }

    .active .iconHome {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconHome_a.png") top center no-repeat;
        background-size: 100%;
    }

    .iconUser {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconUser.png") top center no-repeat;
        background-size: 100%;
    }

    .active .iconUser {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconUser_a.png") top center no-repeat;
        background-size: 100%;
    }

    .iconProfile {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconProfile.png") top center no-repeat;
        background-size: 100%;
    }

    .active .iconProfile {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconProfile_a.png") top center no-repeat;
        background-size: 100%;
    }

    .iconEquipmanage {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconEquipmanage.png") top center no-repeat;
        background-size: 100%;
    }

    .active .iconEquipmanage {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconEquipmanage_a.png") top center no-repeat;
        background-size: 100%;
    }

    .iconRecord {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconRecord.png") top center no-repeat;
        background-size: 100%;
    }

    .active .iconRecord {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconRecord_a.png") top center no-repeat;
        background-size: 100%;
    }

    .iconStatis {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconStatis.png") top center no-repeat;
        background-size: 100%;
    }

    .active .iconStatis {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconStatis_a.png") top center no-repeat;
        background-size: 100%;
    }

    .iconMap {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconMap.png") top center no-repeat;
        background-size: 100%;
    }

    .active .iconMap {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconMap_a.png") top center no-repeat;
        background-size: 100%;
    }

    .iconRuntime {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconRuntime.png") top center no-repeat;
        background-size: 100%;
    }

    .active .iconRuntime {
        width: 20px;
        height: 20px;
        float: left;
        margin-right: 10px;
        background: url("../static/images/comm/iconRuntime_a.png") top center no-repeat;
        background-size: 100%;
    }

    .modalLi span {
        width: 20px;
        height: 20px;
        margin-right: 0px !important;
    }

    .modalLi s {
        text-decoration: none;
        font-size: 14px;
        line-height: 30px;
        padding-left: 10px;
        float: right;
    }

    .alertRed {
        position: absolute;
        width: 100%;
        overflow: visible;
        display: block;
        margin: 0 auto;
        background: #FFF8DB;
        padding-left: 2%;
        padding-right: 2%;
    }

    .alertRed em {
        position: relative;
        top: -10px;
        width: 139px;
        height: 18px;
        line-height: 18px;
        background: red;
        color: #fff;
        margin: 0 auto;
        display: block;
        border-radius: 9px;
        text-align: center;
        font-size: 12px;
    }

    .yellowTri {
        width: 9px;
        height: 8px;
        float: left;
        margin-left: 15px;
        margin-top: 4px;
        background: url("../static/images/icon/triIcon.png") top center no-repeat;
        background-size: 100%;
    }

    .alertRed span {
        width: 100%;
        height: 30px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
        color: red;
        font-size: 12px;
    }

    .alertRed span i {
        float: right;
        color: #ccc;
        font-size: 18px;
        line-height: 20px;
    }
    /deep/ .mu-item-title s {
        width: 65px;
        text-align: justify;
        text-align-last: justify;
    }
</style>
