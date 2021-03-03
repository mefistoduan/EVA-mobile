<template>
    <div id="pages">
        <mu-appbar style="width: 100%;" color="primary" :title="$t('Plane details')">
            <router-link to="/map" slot="left">
                <mu-icon value="arrow_back"></mu-icon>
            </router-link>
        </mu-appbar>
        <mu-tabs :value.sync="active" inverse color="warning" full-width>
            <mu-tab :id="Region.RegionId" v-for="(Region,index) in RegionList" :key="Region.RegionId">
                {{Region.Region}}
            </mu-tab>
        </mu-tabs>
        <div class="planeContainer">
            <ul>
                <li v-if="!lists.length">
                    <h4>{{$t("no use data")}}</h4>
                </li>
                <li v-for="(list,index) in lists" v-if="lists">
                    <div class="basic">
                        <h5>{{list.Region}}</h5>
                        <span>
                                 {{$t("Detection")}} ：{{list.DetectorCount}}台|
                                {{$t("Dangerous equipment found")}} ：{{list.DangerCamCount}}台|
                                {{$t("phone")}}：{{list.Signalstr == ' '? $t("No mobile signal detected"):list.Signalstr}}
                            </span>
                        <div v-if="imgSrc[index]" class="imgSrcContainer">
                            <img :src="imgSrc[index]" alt="">
                            <span class="imgContainer">
                                <em :class="[{'green':pointStates[index].DetectorType == 0},{'red':pointStates[index].DetectorType != 0}]"
                                    v-for="(point,index) in points[index]"
                                    :style="{left:point.Width*0.30+'px',top:point.Height * -0.4+'px'}"
                                ></em>
                            </span>
                        </div>
                        <div v-else>
                            <p class="tips">{{$t("No records found")}}</p>
                        </div>
                    </div>
                </li>
            </ul>
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
                active: 0,
                selected: 0,
                RegionList: [],
                lists: [],
                imgSrc: [],
                points: [],
                pointStates: [],
            }
        },
        mounted() {
            this.RegionDetectList();
        },
        watch: {
            active(val) {
                this.readList(this.RegionList[val]['RegionId']);
            }
        },
        methods: {
            // 读取楼栋信息
            RegionDetectList() {
                const that = this;
                let url = headapi + 'v1/Company/ComRegionDetectList';
                let comId = this.$route.query.ComId;
                let param = {
                    token: localStorage.token,
                    comId: comId
                };
                that.RegionList = [];
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        that.RegionList = json.Rs;
                        if (json.Rs) {
                            // that.selected = json.Rs[0].RegionId;
                            that.selected = parseInt(that.$route.query.Regionid);
                            that.readList( that.selected);
                        }
                    } else {
                        that.Toast(that.TransMemo(json.Memo));
                    }
                }, function (response) {
                    console.info(response);
                })
            },
            readList(regionId) {
                const that = this;
                let url = headapi + 'v1/Company/RegionDetectList';
                let param = {
                    token: localStorage.token,
                    regionId: regionId // regionId
                };
                that.lists = [];
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        that.lists = json.Rs;
                        that.imgFileter(json.Rs);
                        that.DetectListByRegionID(json.Rs)
                    } else {
                        that.Toast(that.TransMemo(json.Memo));
                    }
                }, function (response) {
                    console.info(response);
                })
            },
            imgFileter(Rs) {
                const that = this;
                let url = headapi + 'v1/Company/RegionPictureGetByRegionId';
                that.imgSrc = [];
                for (var i = 0; i < Rs.length; i++) {
                    let param = {
                        token: localStorage.token,
                        regionID: Rs[i].RegionId// regionId
                    };
                    let postdata = qs.stringify(param);
                    axios.post(url, postdata).then(function (data) {
                        let json = data.data;
                        if (json.Code == 0) {
                            that.imgSrc.push(json.EncodeString);
                        }
                    }, function (response) {
                        console.info(response);
                    })
                }
            },
            DetectListByRegionID(Rs) {
                const that = this;
                let url = headapi + 'v1/Company/DetectListByRegionID';
                let comId = this.$route.query.ComId;
                for (var i = 0; i < Rs.length; i++) {
                    let param = {
                        token: localStorage.token,
                        comId: comId, // regionId
                        regionId: Rs[i].RegionId// regionId
                    };
                    let postdata = qs.stringify(param);
                    axios.post(url, postdata).then(function (data) {
                        let json = data.data;
                        if (json.Code == 0) {
                            if (json.Rs) {
                                that.points.push(json.Rs);
                                console.log(that.points);
                            } else {
                                that.points = [];
                            }
                            if (json.DetectorType != undefined && json.DetectorType != null) {
                                that.pointStates = json.DetectorType;
                            } else {
                                that.pointStates = [];
                                return false
                            }
                        }
                    }, function (response) {
                        console.info(response);
                    })
                }
            },
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

    .mu-warning-text-color {
        color: #FFA200;
    }

    /deep/ .mu-tab-link-highlight {
        background-color: #FFA200 !important;
    }

    #pages {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        display: block;
        margin: 0 auto;
        background-color: #f2f2f2;
        top: 0;
        bottom: 0;
    }

    .info {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: #fff;
        margin-bottom: 10px;
        padding-left: 20px;
    }

    .planeContainer li {
        width: 100%;
        height: 360px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .basic {
        width: 100%;
        height: 360px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        border-bottom: 1px solid #f2f2f2;
        background: #fff;
        padding: 5px 0px;
    }

    .basic h5 {
        border: 2px solid #f2f2f2;
        border-left: 0;
        border-right: 0;
        padding: 10px 0;
        padding-left: 20px;
        font-size: 14px;
    }

    .basic > span {
        width: 88%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        font-size: 12px;
    }

    .basic img {
        width: 96%;
        height: 200px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-top: 15px;
        margin-bottom: 5px;
    }

    .red {
        width: 20px;
        height: 20px;
        border-radius: 250px !important;
        float: left;
        margin: 0;
        padding: 0;
        background-color: red;
        color: red;
    }

    .green {
        width: 20px;
        height: 20px;
        border-radius: 250px !important;
        float: left;
        margin: 0;
        padding: 0;
        background-color: yellowgreen;
        color: yellowgreen;
    }
    .imgSrcContainer {
        width: 100%;
        height: 220px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .imgContainer {
        position: relative;
        bottom: 200px;
        width: 96%;
        height: 200px;
        display: block;
        margin: 0 auto;
    }
    .imgContainer em {
        position: relative;
    }

    .tips {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    ul li h4 {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
    }
</style>
