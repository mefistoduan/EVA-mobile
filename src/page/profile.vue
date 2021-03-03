<template>
    <div>
        <mu-appbar style="width: 100%;" color="primary" :title="$t('detail')">
            <router-link to="/map" slot="left">
                <mu-icon value="arrow_back"></mu-icon>
            </router-link>
        </mu-appbar>
        <div class="container">
            <div class="row">
                <div class="detail">
                    <h5>
                        <span>{{unite.ComName}}</span>
                        <em>{{unite.Legal}}</em>
                    </h5>
                    <p>
                        {{unite.Introduction}}
                    </p>
                </div>
                <div class="listContainer">
                    <ul>
                        <li v-if="!lists.length">
                            <h4>{{$t("no use data")}}</h4>
                        </li>
                        <li v-for="list in lists" v-if="lists" @click="goListDetail(list)">
                            <h5>{{list.Region}}</h5>
                            <div>
                                <mu-icon value="keyboard_arrow_right"></mu-icon>
                                <span>
                                    {{$t("Camera")}}：{{list.CamCount}}  {{$t("pcs")}} |
                                     {{$t("Detection")}} ：{{list.DetectorCount}} {{$t("pcs")}} |
                                     {{$t("Suspicious camera")}}：{{list.DangerCamCount}} {{$t("pcs")}}
                                </span>
                                <span>
                                      {{$t("phone")}}：{{list.Signalstr == ' '?  $t("No mobile signal detected"):list.Signalstr}}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
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
                RegionList: [],
                unite: {
                    ComName: '',
                    Legal: '',
                    Introduction: '',
                },
                lists: [],
            }
        },
        mounted() {
            this.readInfo();
            this.RegionDetectList();
        },
        methods: {
            // 基本信息
            readInfo() {
                const that = this;
                let url = headapi + 'v1/Company/ComInfoDetail';
                let comId = this.$route.query.ComId;
                let param = {
                    token: localStorage.token,
                    comId: comId
                };
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        that.unite.ComName = json.Rs.ComName;
                        that.unite.Legal = json.Rs.Legal;
                        that.unite.Introduction = json.Rs.Introduction;
                    } else {
                        this.Toast(that.TransMemo(json.Memo));
                    }
                }, function (response) {
                    console.info(response);
                })
            },
            // 读取楼栋信息
            RegionDetectList() {
                const that = this;
                let url = headapi + 'v1/Company/ComRegionDetectList';
                let comId = this.$route.query.ComId;
                let param = {
                    token: localStorage.token,
                    comId: comId
                };
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        that.RegionList = json.Rs;
                        if (json.Rs) {
                            that.selected = json.Rs[0].RegionId;
                            that.readList();
                        }
                    } else {
                        this.Toast(that.TransMemo(json.Memo));
                    }
                }, function (response) {
                    console.info(response);
                })
            },
            // 读取无线设备具体分布
            readList() {
                const that = this;
                let url = headapi + 'v1/Company/RegionDetectList';
                let param = {
                    token: localStorage.token,
                    regionId: this.selected
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
                let that = this;
                that.$router.push(
                    {
                        path: '/listDetail',
                        query: {
                            RegionId: list.RegionId,
                            Region: list.Region,
                            comName: that.unite.ComName
                        }
                    });
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
        display: block;
        margin-top: 0px;
        padding-bottom: 200px;
        background: #f2f2f2;
        overflow-y: scroll;
    }

    .detail {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: #fff;
        padding-top: 0px;
        padding-bottom: 20px;
        padding-left: 2%;
        padding-right: 2%;
        margin-bottom: 10px;
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
        margin-top: 10px;

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

    .listContainer li h5 {
        font-size: 14px;
        margin: 10px 0;
    }

    .listContainer li span {
        width: 80%;
        float: left;
        font-size: 12px;
        color: #606060;
        line-height: 20px;
    }

    .listContainer li img {
        width: 8px;
        height: 14px;
        float: right;
    }
</style>
