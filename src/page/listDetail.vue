<template>
    <div id="pages">
        <mu-appbar style="width: 100%;" color="primary" :title="$t('detail')">
                <span @click="$router.back(-1)" slot="left">
                       <mu-icon value="arrow_back"></mu-icon>
                </span>
        </mu-appbar>
        <div class="container listContainer">
            <div class="row ">
                <ul class="deteUl" v-if="selected == 1">
                    <li v-if="!lists.length">
                        <h4>{{$t("no use data")}}</h4>
                    </li>
                    <li v-for="list in lists" v-if="lists">
                        <div class="rowTop"><h5>{{list.Name}}</h5>
                            <span v-if="list.DangerLevel == -1" class="green">{{$t("other")}}</span>
                            <span v-if="list.DangerLevel == 0" class="green">{{$t("white")}}</span>
                            <span v-if="list.DangerLevel == 2" class="yellow">{{$t("deal")}}</span>
                            <span v-if="list.DangerLevel == 3" class="red">{{$t("warning")}}</span>
                            <span v-if="list.DangerLevel == 4" class="red">{{$t("danger")}}</span>
                        </div>
                        <div class="rowDetail">
                            <span>{{list.MacCom.length > 16 ? list.MacCom.slice(0, 16)+'...':list.MacCom}}</span>
                            <s>{{list.Mac}}</s>
                        </div>
                        <div class="rowBottom">
                            {{list.Memo}}
                        </div>
                    </li>
                    <s class="tips" v-if="lists"> {{$t("total")}} {{lists.length}} {{$t("pcs")}} {{$t("wireless device")}}</s>
                </ul>
                <ul class="phoneUl" v-if="selected == 2">
                    <li v-if="!phones">
                        <h4>{{$t("no use data")}}</h4>
                    </li>
                    <li v-for="phone in phones" v-if="phones">
                        <div class="peTop">
                            {{phone.DetectorName}} <span>{{phone.RegionName}}</span>
                        </div>
                        <div class="peMemo">
                            {{phone.Signalstr == ''?$t('No mobile signal detected'):phone.Signalstr}}
                        </div>
                    </li>
                    <s class="tips" v-if="phones">  {{$t("total")}}{{phones.length}} {{$t("pcs")}} {{$t("Detection")}}</s>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    let qs = require('qs');
    import Global from '../Global.js'

    export default {
        data() {
            return {
                selected: "1",
                location: {
                    ComName: this.$route.query.comName,
                    Region: this.$route.query.Region,
                },
                RegionList: [],
                unite: {
                    ComName: '',
                    Legal: '',
                    Introduction: '',
                },
                lists: [],
                phones: [],
            }
        },
        mounted() {
            this.readList();
        },
        methods: {
            // 读取无线设备具体分布
            readList() {
                const that = this;
                let url = headapi + 'v1/Company/RegionDetectDeviceDetailList';
                let param = {
                    token: localStorage.token,
                    regionId: this.$route.query.RegionId
                };
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        that.lists = json.Rs;
                    } else {
                        this.Toast(that.TransMemo(json.Memo));
                    }
                }, function (response) {
                    console.info(response);
                })
            },
            goListDetail(list) {
                this.$router.push({path: '/list', query: {RegionId: list.RegionId}});
            },
            readPhone() {
                const that = this;
                let url = headapi + 'v1/Detector/SignalDeviceByregion';
                let param = {
                    token: localStorage.token,
                    regionid: this.$route.query.RegionId
                };
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        that.phones = json.Rs;
                    } else {
                        this.Toast(that.TransMemo(json.Memo));
                    }
                }, function (response) {
                    console.info(response);
                })
            }
        },
    }
</script>

<style scoped>
    /*mu-header*/
    .mu-primary-color {
        line-height: 60px;
        height: 60px;
        background: url("../static/images/comm/headerBg.png") top center no-repeat;
        background-size: 100%;
    }

    /deep/ .mu-appbar-left {
        padding-top: 15px;
    }

    /deep/ .material-icons {
        color: #fff;
    }

    /deep/ .mu-appbar-title {
        text-align: center;
    }
 #pages {
     width: 100%;
     overflow: hidden;
     overflow-y: scroll;
     display: block;
     margin: 0 auto;
     height: 100%;
     position: absolute;
     top: 0;
     bottom: 0;
     background: #f2f2f2;
     padding-bottom: 20px;
 }
    .detail {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        padding-top: 0px;
        padding-bottom: 20px;
        padding-left: 2%;
        padding-right: 2%;
        margin-bottom: 10px;
        background: #fff;
    }
    .detail ul {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        padding-left: 2%;
        padding-right: 2%;
    }

    .detail h5 span {
        font-size: 16px;
    }

    .detail h5 em {
        float: right;
        color: #666666;
        font-size: 12px;
        font-weight: normal;
        text-align: right;
    }

    .detail p {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        font-size: 12px;
        color: #666666;
        line-height: 16px;
    }

    /deep/ .mint-navbar .mint-tab-item.is-selected {
        border-bottom: 3px solid #FFA200;
        color: #FFA200;
    }

    /deep/ .mint-navbar .mint-tab-item.is-selected .mint-tab-item-label {
        color: #FFA200;
    }

    .listContainer ul {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .listContainer li {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-bottom: 2px;
        padding: 10px 20px;
        background: #fff;
    }

    .listContainer .rowTop {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .rowTop .red {
        color: #FFA200;
    }

    .listContainer h5 {
        margin: 0;
        float: left;
        font-size: 16px;
    }

    .listContainer .rowTop span {
        float: right;
        font-size: 14px;
    }

    .listContainer .rowDetail {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        color: #999999;
        font-size: 14px;
        margin-top: 10px;
        margin-bottom: 10px;
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


    .location {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        padding: 11px 4%;
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

    .phoneUl {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .phoneUl li {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-bottom: 2px;
        padding: 10px 20px;
        background: #fff;
    }

    .phoneUl .peTop {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        font-size: 16px;
        margin-bottom: 10px;
    }

    .peTop span {
        float: right;
        text-align: right;
        font-size: 14px;
    }

    .peMemo {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        font-size: 14px;
        color: #999999;
    }
    .deteUl {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }
    .deteUl li h4 {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
        font-weight: normal;
        line-height: 30px;
    }
</style>
