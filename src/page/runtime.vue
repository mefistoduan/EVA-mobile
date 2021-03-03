<template>
    <div id="pages">
        <appHeader @goNewpage="onGoNewPage" :title="this.pagetitle"></appHeader>
        <bottomTab :curTab="thisTab"></bottomTab>
        <div class="container">
            <div class="row">
                <mu-tabs :value.sync="active" inverse color="warning" full-width>
                    <mu-tab>{{$t("wireless device")}}</mu-tab>
                    <mu-tab> {{$t("phone signal")}}</mu-tab>
                </mu-tabs>
                <div class="demo-text" v-if="active === 0">
                    <ul class="deteUl">
                        <li v-if="!lists">
                            <h4>{{$t("no use data")}}</h4>
                        </li>
                        <transition-group name="fade">
                            <li v-for="(list,i) in lists" v-if="lists"  v-bind:key="i">
                                <div class="lt">
                                    <div class="rowTop">
                                        <h5>{{list.DetectorLocation}}</h5>
                                        <span v-if="list.DangerLevel == -1" class="green">{{$t("other")}}</span>
                                        <span v-if="list.DangerLevel == 0" class="green">{{$t("white")}}</span>
                                        <span v-if="list.DangerLevel == 2" class="yellow">{{$t("deal")}}</span>
                                        <span v-if="list.DangerLevel == 3" class="red">{{$t("warning")}}</span>
                                        <span v-if="list.DangerLevel == 4" class="red">{{$t("danger")}}</span>
                                    </div>
                                    <div class="rowDetail">
                                        <span>{{list.MacCom.length > 16 ? list.MacCom.slice(0, 16)+'...':list.MacCom}}</span>
                                        <span class="pull-right">{{list.Mac}}</span>
                                    </div>
                                </div>
                            </li>
                        </transition-group>
                        <s class="tips" v-if="lists"> {{$t("total")}}{{lists.length}}{{$t("item")}} {{$t("Record")}}</s>
                    </ul>
                </div>
                <div class="demo-text" v-if="active === 1">
                    <ul class="deteUl">
                        <li v-if="!phones">
                            <h4>{{$t("no use data")}}</h4>
                        </li>
                        <li v-for="phone in phones" v-if="phones">
                            <div class="lt">
                                <div class="rowTop">
                                    <h5>{{phone.DetectorName}}</h5>
                                    <span>{{phone.RegionName | filterContent}}</span>
                                </div>
                                <div class="rowDetail">
                                    <span>{{phone.ComName}}</span>
                                    <s :class="{'red':phone.Signalstr != ''}">{{phone.Signalstr | filterSignalstr}}</s>
                                </div>
                            </div>
                        </li>
                        <s class="tips" v-if="phones"> {{$t("total")}}{{phones.length}}{{$t("item")}}
                            {{$t("Record")}}</s>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import appHeader from '../components/appHeader'
    import bottomTab from '../components/bottomTab'
    import axios from 'axios';

    let qs = require('qs');
    import Global from '../Global.js'

    export default {
        data() {
            return {
                pagetitle: this.$t('Real-time'),
                thisTab: this.$t('Real-time'),
                active: 0,
                loading: true,
                lists: [],
                phones: [],
            }
        },
        mounted() {
            this.readList();
            this.readPhone();
        },
        filters: {
            filterContent: function (value) {
                if (value == '' || value == undefined) {
                    return '-'
                } else {
                    return value
                }
            },
            filterSignalstr: function (value) {
                switch (value) {
                    case "":
                        return '未检测到';
                        break;
                    default:
                        return value;
                        break;
                }
            }
        },
        watch: {
            active(val) {
                let that = this;
                console.log(val);
                if (val == 1) {
                    that.readList();
                } else {
                    that.readPhone();
                }
            }
        },
        methods: {
            onGoNewPage(path) {
                this.$router.push({path: '/' + path});
            },
            // 实时监测无线设备
            readList() {
                const that = this;
                let url = headapi + 'v1/Detector/DetectedMacs';
                // let url = headapi + 'v1/Detector/DetectedMacsTest';//test
                let param = {
                    token: localStorage.token,
                };
                this.lists = [];
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        that.lists = json.Rs;
                    } else {
                        that.Toast(that.TransMemo(json.Memo));
                    }
                }, function (response) {
                    console.info(response);
                })
            },
            readPhone() {
                const that = this;
                let url = headapi + 'v1/Detector/SignalDeviceList';
                let pageIndex = 1;
                let tableMax = 100;
                let param = {
                    token: localStorage.token,
                    pageIndex: pageIndex,
                    tableMax: tableMax
                };
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        that.phones = json.Rs;
                    } else {
                        that.Toast(that.TransMemo(json.Memo));
                    }
                }, function (response) {
                    console.info(response);
                })
            },
        },
        components: {
            appHeader, bottomTab
        }
    }
</script>

<style scoped>
    .mu-warning-text-color {
        color: #FFA200;
    }

    /deep/ .mu-tab-link-highlight {
        background-color: #FFA200 !important;
    }

    /deep/ .mu-tab {
        width: 50%;
    }

    #pages {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: block;
        margin-top: 0px;
        padding-bottom: 20px;
        background: #f2f2f2;
        overflow-y: scroll;
    }

    .demo-text {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .demo-text ul {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        border-top: 2px solid #f2f2f2;
    }

    .demo-text li {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        padding: 10px 20px;
        background: #fff;
        border-bottom: 2px solid #f2f2f2;
    }

    .deteUl h5 {
        margin: 0;
        float: left;
        font-size: 16px;
    }

    .deteUl .rowTop span {
        float: right;
        font-size: 14px;
    }

    .deteUl .rowDetail {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        color: #999999;
        font-size: 14px;
    }

    .rowDetail span {
        float: left;
    }

    .rowDetail s {
        float: right;
    }

    .rowBottom {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        font-size: 12px;
        color: #999999;
    }

    .tips {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
        font-size: 12px;
        color: #999999;
        margin-top: 10px;
    }

    .deteUl img {
        width: 8px;
        height: 14px;
        margin-top: 20px;
        float: right;
    }

    .deteUl .lt {
        width: 100%;
        float: left;
    }

    .deteUl .rt {
        float: right;
    }

    .row .pull-right {
        float: right;
        text-align: right;
    }

    .deteUl h4 {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
        font-weight: normal;
    }

    .rowDetail s {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: left;
    }

    .red {
        color: red;
    }
    .green {
        color: yellowgreen;
    }
    .yellow {
        color: rgb(255, 162, 0);
    }

    /deep/ .mu-tab-wrapper {
        font-size: 16px;
    }
</style>
