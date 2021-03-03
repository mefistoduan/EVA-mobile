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
        <div id="js-container" class="map">
            <h5 style="text-align: center">{{$t("Loading data")}} ...</h5>
        </div>
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
                    let map = new AMap.Map('js-container', mapConfig);
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
            addMarker(map, lng, lat, content, imgState) {
                let marker = new AMap.Marker({
                    position: [lng, lat],
                    offset: new AMap.Pixel(-13, -30),
                    content: imgState,
                });
                marker.setMap(map);

                // 弹窗偏移度
                let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(14, -20)});

                marker.on('click', function (e) {
                    infoWindow.setContent(content);
                    infoWindow.open(map, e.target.getPosition());
                });
            },
            // 获取所有的点位置
            getPoint(map) {
                const that = this;
                let lnglats = [];
                let url = '';
                if (localStorage.userLevel == this.$t('单位管理员')) {
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
                    if (json) {
                        // 单个企业
                        map.setCenter([json.Rs[0].Lng, json.Rs[0].Lat]);
                        // todo 使用数学中心计算显示点中心
                        localStorage.lnglats = JSON.stringify(json.Rs);
                        if (localStorage.lnglats != JSON.stringify(lnglats)) {
                            that.wirtePoint(map, json);
                        }
                        map.setFitView();
                    }
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
                        var state = '';
                        switch (parseInt(lnglats[i].Detstatus)) {
                            // 0 safe 1 warning 2 danger
                            case 0:
                                state = this.$t('normal');
                                break;
                            case 1:
                                state = '<span style="color:#ffe943">' + this.$t('abnormal') + '</span>';
                                break;
                            case 2:
                                state = '<span style="color:#ff0000">' + this.$t('danger') + '</span>';
                                break;
                        }

                        let DecList = !json.Rs[i].DecList ? that.$t('not found') : json.Rs[i].DecList;
                        content =
                            '<span class="map_a" href="profile.html?hotelid=' + localStorage.comId + '&Regionid=' + json.Rs[i].Regionid + '">' +
                            this.$t('region') + json.Rs[i].RegionName
                            + '<br>' + this.$t('state') + ':' + state
                            + '<br>' + this.$t('Detection') + ':' + json.Rs[i].DectorNum
                            + '<br>' + this.$t('phone signal') + ':' + DecList
                            + '<br>' + json.Rs[i].Wifiname + '：' + json.Rs[i].CamNum
                            + '<br>' + this.$t('Suspicious') + json.Rs[i].Wifiname + '：' + json.Rs[i].DancapNum
                            + '</span><em class="jumper" Regionid=' + json.Rs[i].Regionid + '>' +
                            '<i class="icon iconProfile"  href="profile.html?hotelid=' + localStorage.comId + '&Regionid=' + json.Rs[i].Regionid + '"></i>' +
                            '<i class="icon iconPlane" href="plane.html?hotelid=' + localStorage.comId + '&Regionid=' + json.Rs[i].Regionid + '"></i></em>';

                    that.addMarker(map, json.Rs[i].Lng, json.Rs[i].Lat, content, imgState);
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
</style>
