<!--
  描述：拖放地图组件，默认尺寸是 500 * 300
  接收属性参数：
    lat: 纬度
    lng: 经度
  自定义事件：
    drag: 拖放完成事件
  示例：
    <mapDrag @drag="dragMap" lat="22.574405" lng="114.095388"></mapDrag>
-->
<template>
    <div class="m-map" :style="{ height: curheight + 'px' }">
        <div id="js-containerPage" class="map">
            <h5 style="text-align: center">{{$t("Loading data")}} ...</h5>
        </div>
        <mu-bottom-sheet :open.sync="detailState">
            <div class="detailContianer">
                <h5>
                    <span class="name">{{row.RegionName}}</span>
                </h5>
                <ul>
                    <li class="lt">{{$t("state")}}：<em
                            :class="{'red':row.Detstatus != '正常','green':row.Detstatus == '正常'}">{{row.Detstatus}}</em>
                    </li>
                    <li class="lt">{{$t("Detection equipment")}}：{{row.DectorNum}} {{$t("pcs")}}</li>
                    <li class="lt">{{$t("phone signal")}}：{{row.DecList}}</li>
                    <li class="lt">{{$t("Camera")}}：{{row.CamNum}} {{$t("pcs")}}</li>
                    <li class="lt">{{$t("Suspicious camera")}}：{{row.DancapNum}} {{$t("pcs")}}</li>
                </ul>
                <div class="btnContainer">
                    <button class="goPlane" @click="goPlane">{{$t("Plane details")}}</button>
                    <button class="goProfile" @click="goProfile">{{$t("Company details")}}</button>
                </div>
            </div>
        </mu-bottom-sheet>
    </div>
</template>

<script>
    import remoteLoad from '../utils/remoteLoad.js'
    import {MapKey, MapCityName} from '../tools/map'

    let qs = require('qs');
    import axios from 'axios';
    import Global from '../../src/Global.js'

    export default {
        data() {
            return {
                searchKey: '',
                placeSearch: null,
                dragStatus: false,
                AMapUI: null,
                AMap: null,
                ComId: 0,
                detailState: false,
                row: {
                    RegionName: '',
                    Detstatus: '',
                    DectorNum: '',
                    CamNum: '',
                    DecList: '',
                    DancapNum: '',
                    Regionid: '',
                },
            }
        },
        props: {
            curheight: {
                default: 310,
                type: Number
            }
        },
        watch: {
            searchKey() {
                if (this.searchKey === '') {
                    this.placeSearch.clear()
                }
            },
        },
        beforeDestroy() {
            clearInterval(this.getPoint);
        },
        methods: {
            goPlane() {
                let that = this;
                that.$router.push({path: '/plane', query: {Regionid: that.row.Regionid, ComId: that.ComId}});
            },
            goProfile() {
                let that = this;
                that.$router.push({path: '/profile', query: {Regionid: that.row.Regionid, ComId: that.ComId}});
            },
            // 实例化地图
            initMap() {
                let AMapUI = this.AMapUI = window.AMapUI;
                let AMap = this.AMap = window.AMap;
                let timeInterval = 5000;
                let lang = localStorage.language == 'zh' ? 'zh' : 'en';
                AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
                    let mapConfig = {
                        resizeEnable: true, //是否监控地图容器尺寸变化
                        // mapStyle: mapStyle,//地图颜色风格
                        zoom: 16,
                        cityName: MapCityName,
                        lang: lang
                    };
                    let map = new AMap.Map('js-containerPage', mapConfig);
                    // 获取点位置
                    this.getPoint(map);

                    setInterval(this.getPoint(map), 5000);
                    // 获取围栏信息
                    this.getFenceInfo(map);
                    // 启用工具条
                    AMap.plugin(['AMap.ToolBar'], function () {
                        map.addControl(new AMap.ToolBar({
                            position: 'RB'
                        }))
                    });
                })
            },

            // 实例化点标记
            addMarker(map, lng, lat, content, imgState, row) {
                let that = this;
                let marker = new AMap.Marker({
                    position: [lng, lat],
                    offset: new AMap.Pixel(-13, -30),
                    content: imgState,
                });
                marker.setMap(map);

                // 弹窗偏移度
                let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(14, -20)});
                marker.on('click', function (e) {
                    // 自定义的弹窗
                        that.detailState = true;
                        that.row.RegionName = row.RegionName;
                        that.row.Detstatus = row.Detstatus == 1 ? that.$t('normal') : that.$t('abnormal');
                        that.row.DecList = !row.DecList ? that.$t('Not found') : row.DecList;
                        that.row.DectorNum = row.DectorNum;
                        that.row.CamNum = row.CamNum;
                        that.row.DancapNum = row.DancapNum;
                        that.row.Regionid = row.Regionid;
                        // 原生的弹窗
                        // infoWindow.setContent(content);
                        // infoWindow.open(map, e.target.getPosition());
                });
            },
            // 获取所有的点位置
            getPoint(map) {
                const that = this;
                let lnglats = [];
                let url = '';
                if (localStorage.userLevel == '单位管理员') {
                    url = headapi + 'v1/Company/GetRegionMapinfo';//获取 单个企业获取
                } else {
                    url = headapi + 'v1/Company/GetMapinfo';//获取
                }
                let param = {
                    token: localStorage.token
                };
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Rs) {
                        map.setCenter([json.Rs[0].Lng, json.Rs[0].Lat]);
                        // todo 使用数学中心计算显示点中心
                        if (localStorage.lnglats != JSON.stringify(lnglats)) {
                            that.wirtePoint(map, json);
                        }
                        localStorage.lnglats = JSON.stringify(json.Rs)
                    }
                    map.setFitView();
                }, function (response) {
                    console.info(response);
                })
            },
            // 画点
            wirtePoint(map, json) {
                let that = this;
                let markers = [];
                let curPointName = '';
                let lnglats = json.Rs;
                map.remove(markers);
                // 根据状态判断图标显示颜色
                for (var i = 0; i < lnglats.length; i++) {
                    let imgState = '';
                    curPointName = !lnglats[i].RegionName ? lnglats[i].ComName : lnglats[i].RegionName;
                    switch (parseInt(lnglats[i].Detstatus)) {
                        // 0 safe 1 warning 2 danger
                        case 0:
                            imgState = '<i class="green_point"></i> <span class="point_name">' + curPointName + '</span>';
                            break;
                        case 1:
                            imgState = '<i class="green_point"></i> <span class="point_name">' + curPointName + '</span>';
                            break;
                        case 2:
                            imgState = '<i class="red_point"></i> <span class="point_name">' + curPointName + '</span>';
                            break;
                    }
                    var position;
                    position = [json.Rs[i].Lng, json.Rs[i].Lat];

                    let content = '';
                    if (localStorage.userLevel == '单位管理员') {
                        let state = json.Rs[i].Detstatus == 1 ? this.$t("normal") : '<span style="color:#ff0000">this.$t("abnormal")</span>';
                        let DecList = !json.Rs[i].DecList ? this.$t("Not found") : json.Rs[i].DecList;
                        content =
                            '<span class="map_a" href="profile.html?hotelid=' + localStorage.comId + '&Regionid=' + json.Rs[i].Regionid + '">' +
                            +this.$t("region") + '：' + json.Rs[i].RegionName
                            + '<br>' + this.$t("state") + '：' + state
                            + '<br>' + this.$t("Detection equipment") + '：' + json.Rs[i].DectorNum
                            + '<br>' + this.$t("phone signal") + '：' + DecList
                            + '<br>' + json.Rs[i].Wifiname + '：' + json.Rs[i].CamNum
                            + '<br>可疑' + json.Rs[i].Wifiname + '：' + json.Rs[i].DancapNum
                            + '</span><em class="jumper" Regionid=' + json.Rs[i].Regionid + '>' +
                            '<i class="icon iconProfile"  href="profile.html?hotelid=' + localStorage.comId + '&Regionid=' + json.Rs[i].Regionid + '"></i>' +
                            '<i class="icon iconPlane" href="plane.html?hotelid=' + localStorage.comId + '&Regionid=' + json.Rs[i].Regionid + '"></i></em>';
                    } else {
                        let state = json.Rs[i][3] == 1 ? '正常' : '<span style="color:#ff0000">异常</span>';
                        let macAddr = !json.Rs[i][7] ? '无' : json.Rs[i][7];
                        content =
                            '<span class="map_a" href="profile.html?hotelid=' + json.Rs[i][8] + '">' +
                            '企业：' + json.Rs[i][5]
                            + '<br>' + this.$t("state") + '：' + state
                            + '<br>' + this.$t("Detection equipment") + '：' + json.Rs[i][4]
                            + '<br>' + this.$t("phone signal") + '：' + json.Rs[i][2]
                            + '<br>可疑' + json.Rs[i][9] + '：' + json.Rs[i][6]
                            + '<br>可疑MAC地址：' + macAddr
                            + '</span><em class="jumper" Regionid=' + json.Rs[i][9] + '>' +
                            '<i class="icon iconProfile"  href="profile.html?hotelid=' + json.Rs[i][8] + '"></i>' +
                            '<i class="icon iconPlane" href="plane.html?hotelid=' + json.Rs[i][8] + '"></i></em>';
                    }
                    that.addMarker(map, json.Rs[i].Lng, json.Rs[i].Lat, content, imgState, json.Rs[i]);
                }
            },
            // 给总管理员的画点
            wirtePointForAdmin(map, json) {
                let that = this;
                let markers = [];
                map.remove(markers);
                // 根据状态判断图标显示颜色
                for (var i = 0; i < json.length; i++) {
                    let imgState = '';
                    switch (parseInt(json[i][3])) {
                        case 1:
                            imgState = '<i class="green_point"></i> <span class="point_name">' + json[i][5] + '</span>';
                            break;
                        case 2:
                            imgState = '<i class="yellow_point"></i> <span class="point_name">' + json[i][5] + '</span>';
                            break;
                        case 0:
                            imgState = '<i class="red_point"></i> <span class="point_name">' + json[i][5] + '</span>';
                            break
                    }
                    var position = json[i];
                    let content = '';
                    let state = json[i][3] == 1 ? this.$t('normal') : '<span style="color:#ff0000">' + this.$t('abnormal') + '</span>';
                    let macAddr = !json[i][7] ? this.$t('nothing') : json[i][7];
                    content = '<span class="map_a" href="profile.html?hotelid=' + json[i][8] + '">' +
                        '企业：' + json[i][5]
                        + '<br>状态：' + state
                        + '<br>探测设备：' + json[i][4]
                        + '<br>' + json[i][9] + '：' + json[i][2]
                        + '<br>可疑' + json[i][9] + '：' + json[i][6]
                        + '<br>可疑MAC地址：' + macAddr
                        + '</span><em class="jumper" Regionid=' + json[i][9] + '>' +
                        '<i class="icon iconProfile"  href="profile.html?hotelid=' + json[i][8] + '"></i>' +
                        '<i class="icon iconPlane" href="plane.html?hotelid=' + json[i][8] + '"></i></em>';
                    that.addMarker(map, json[i][0], json[i][1], content, imgState,json[i]);
                }
            },
            // 获取围栏信息
            getFenceInfo(map) {
                const that = this;
                let url = headapi + 'v1/Company/GetComfencelist';
                let param = {
                    token: localStorage.token,
                    comid: localStorage.comId
                };
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        that.ComId = json.Rs.ComId;
                        let fence = json.Rs.Fence;
                        let fenceArr = fence.split(",");
                        let path = [];
                        for (var i = 0; i < fenceArr.length; i++) {
                            if (i % 2 == 0) {
                                path.push([fenceArr[i], fenceArr[i + 1]]);
                            }
                        }
                        let polygon = new AMap.Polygon({
                            path: path,
                            strokeColor: "#6496FF",
                            strokeWeight: 6,
                            strokeOpacity: 0.15,
                            fillOpacity: 0.4,
                            fillColor: '#6496FF',
                            zIndex: 50,
                        });

                        map.add(polygon);

                        // 缩放地图到合适的视野级别
                        map.setFitView([polygon]);
                    }
                }, function (response) {
                    console.info(response);
                })
            },
            // 计算点中心
            calcCenterBySingle(data) {
                var total = data.length;
                var lat = 0, lon = 0;
                for (var i = 0; i < total; i++) {
                    lat += data[i].Lat * Math.PI / 180;
                    lon += data[i].Lng * Math.PI / 180;
                }
                lat /= total;
                lon /= total;
                return [lon * 180 / Math.PI, lat * 180 / Math.PI];
            },
            // 计算多点的数学圆心
            calcCenter(data) {
                var total = data.length;
                var lat = 0, lon = 0;
                for (var i = 0; i < total; i++) {
                    lat += data[i][0] * Math.PI / 180;
                    lon += data[i][1] * Math.PI / 180;
                }
                lat /= total;
                lon /= total;
                return [lat * 180 / Math.PI, lon * 180 / Math.PI];
            }
        },
        async created() {
            // 已载入高德地图API，则直接初始化地图
            if (window.AMap && window.AMapUI) {
                this.initMap()
                // 未载入高德地图API，则先载入API再初始化
            } else {
                await remoteLoad(`http://webapi.amap.com/maps?v=1.3&key=${MapKey}`);
                await remoteLoad('http://webapi.amap.com/ui/1.0/main.js');
                this.initMap()
            }
        }
    }
</script>

<style scoped>
    .m-map {
        width: 100%;
        /*max-height: 317px;*/
        /*height: 317px;*/
        position: relative;
    }

    .m-map .map {
        width: 100%;
        height: 100%;
    }

    .m-map .search {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 285px;
        z-index: 1;
    }

    .m-map .search input {
        width: 180px;
        border: 1px solid #ccc;
        line-height: 20px;
        padding: 5px;
        outline: none;
    }

    .m-map .search button {
        line-height: 26px;
        background: #fff;
        border: 1px solid #ccc;
        width: 50px;
        text-align: center;
    }

    .m-map .result {
        max-height: 300px;
        overflow: auto;
        margin-top: 10px;
    }

    /deep/ .green_point {
        margin: 16px;
        height: 16px;
        width: 16px;
        border-radius: 50% !important;
        display: inline-block;
        background-color: #1eff30;
    }

    /deep/ .yellow_point {
        margin: 16px;
        height: 16px;
        width: 16px;
        border-radius: 50% !important;
        display: inline-block;
        background-color: #f2ff24;
    }

    /deep/ .red_point {
        margin: 16px;
        height: 16px;
        width: 16px;
        border-radius: 50% !important;
        display: inline-block;
        transform: scale(0.5);
        animation: bulge 2s infinite ease-in-out;
        background-color: #ff0000;
        animation-delay: 0s;
    }

    /deep/ .red_point::after {
        position: absolute;
        display: inline-block;
        content: '';
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: inherit;
        top: 0;
        left: 0;
        z-index: -1;
        transform: scale(1);
        animation: blow 2s infinite ease-in-out;
    }

    /deep/ .point_name {
        position: relative;
        left: -30px;
        top: -15px;
        width: 100%;
        min-width: 90px;
        padding: 1px;
        text-align: center;
        background-color: rgb(26, 34, 41);
        border: 1px solid #060D16;
        border-radius: 10px !important;
        color: #eeeeee;
        display: block;
        overflow: hidden;
        opacity: 0.9;
        font-size: 12px;
    }

    .red {
        color: red;
    }

    .green {
        color: greenyellow;
    }

    @keyframes bulge {
        50% {
            transform: scale(1);
        }
    }


    @keyframes blow {
        25% {
            opacity: 0.4;
        }
        50% {
            opacity: 0.1;
        }
        90% {
            opacity: 0;
        }
        100% {
            transform: scale(9);
            opacity: 0;
        }
    }

    .detailContianer {
        position: absolute;
        bottom: 85px;
        left: 0;
        right: 0;
        width: 96%;
        height: 257px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: #fff;
        box-shadow: #333333 0 0 7px;
        z-index: 9999;
        border-radius: 8px;
        padding: 18px 10px;
    }

    .detailContianer h5 {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        font-size: 16px;
    }

    .detailContianer h5 .name {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
    }

    .detailContianer h5 .state {
        float: right;
    }

    .detailContianer ul {
        width: 88%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-top: 15px;
        margin-bottom: 10px;
        border-top: 1px solid #EBEBEB;
        border-bottom: 1px solid #EBEBEB;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .detailContianer li {
        width: 100%;
        float: left;
        margin-bottom: 3px;
    }

    .detailContianer .rt {
        text-align: right;
    }

    .detailContianer .btnContainer {
        width: 88%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .btnContainer button {
        width: 120px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-radius: 250px;
        outline: none;
        border: none;
    }

    .btnContainer .goPlane {
        border: 1px solid #FFCC00;
        background: #fff;
    }

    .btnContainer .goProfile {
        border: 1px solid #FFCC00;
        background: #FFCC00;
        float: right;
    }

    /deep/ .amap-zoomcontrol {
        bottom: 10px !important;
    }
</style>
