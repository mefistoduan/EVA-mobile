<template>
    <div class="">
        <appHeader @goNewpage="onGoNewPage" :title="this.pagetitle"></appHeader>
        <bottomTab :curTab="thisTab"></bottomTab>
        <div class="listContainer">
            <ul class="deteUl">
                <li v-if="!lists.length">
                    <h4>{{$t("no use data")}}</h4>
                </li>
                <transition-group name="fade">
                    <li v-for="list in stus" v-if="lists" @click="goPage(list)" v-bind:key="list.Id">
                        <div class="lt">
                            <div class="rowTop">
                                <h5>{{list.TagName}}</h5>
                                <!--<span>{{list.Status | typeFileter}}</span>-->
                                <span>{{list.stusType}}</span>
                            </div>
                            <div class="rowDetail">
                                <span>{{list.Mac}}</span>
                                <span class="pull-right">{{list.Memo}}</span>
                            </div>
                            <div class="rowDetail">
                                <span>{{list.RegisterTime  | timeFileter}}</span>
                                <span class="pull-right">{{list.ComName}}{{list.Name}}</span>
                            </div>
                        </div>
                        <div class="rt">
                            <mu-icon value="keyboard_arrow_right"></mu-icon>
                        </div>
                    </li>
                </transition-group>
                <div class="tips" v-if="lists">
                    {{$t("total")}}{{lists.length}}{{$t("pcs")}} {{$t("Detection equipment")}}
                </div>
            </ul>
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
                pagetitle: this.$t('Detection'),
                thisTab: this.$t('Detection'),
                lists: [],
                show: true
            }
        },
        mounted() {
            this.writeData();
        },
        methods: {
            onGoNewPage(path) {
                this.$router.push({path: '/' + path});
            },
            goPage(list) {
                this.$router.push({path: '/detectorDetail', query: {detector: JSON.stringify(list)}});
            },
            writeData() {
                const that = this;
                let url = headapi + 'v1/Detector/DetectorQuery';
                let pageIndex = 1;
                let tableMax = 100;
                let prov = localStorage.defaultProv;
                let city = localStorage.defaultCity;
                let area = localStorage.defaultArea;
                let comid = localStorage.Comid;
                let searchs = '';
                let param = {
                    token: localStorage.token,
                    prov: prov,
                    city: city,
                    area: area,
                    supregionid: 0,
                    regionid: 0,
                    comid: 48,
                    keyword: '',
                    pageIndex: pageIndex,
                    tableMax: tableMax
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
            }
        },
        computed: {
            stus() {
                let that = this;
                let text = '';
                /*es6写法 防止用不了this.type*/
                return this.lists.filter((v) => {
                    switch (parseInt(v.Status)) {
                        case 0:
                            text = that.$t('Prohibit');
                            break;
                        case 1:
                            text = that.$t('normal');
                            break;
                        case 2:
                            text = that.$t('Off-line');
                            break;
                        case 3:
                            text = that.$t('fault');
                            break;
                        case 9:
                            text = that.$t('delete');
                            break;
                        default:
                            text = that.$t('other');
                            break;
                    }
                    return v.stusType = text;
                })
            }
        },
        filters: {
            timeFileter: function (time) {
                return globalfmtDate(time, 10)
            },
        },
        components: {
            appHeader, bottomTab
        }
    }
</script>

<style scoped>
    #pages {
        width: 100%;
        overflow: hidden;
        display: block;
        margin-top: 0px;
        padding-bottom: 10px;
        background: #f2f2f2;
    }

    /*!*index mu-header*!*/
    /deep/ .mint-header {
        line-height: 60px;
        height: 60px;
        background: url("../static/images/comm/headerBg.png") top center no-repeat;
        background-size: 100%;
    }

    /deep/ .mint-button--default {
        background: none;
        color: #fff;
        font-size: 14px;
    }

    /deep/ .mint-header-title {
        padding-top: 0 !important;
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
        padding: 10px 20px;
        border-bottom: 2px solid #f2f2f2;
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

    .listContainer .rowTop {
        margin-bottom: 10px;
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
    }

    .deteUl .lt {
        width: 95%;
        float: left;
    }

    .deteUl .rt {
        float: right;
    }

    .rt i {
        width: 8px;
        height: 14px;
        margin-top: 20px;
        margin-right: 5px;
        color: #ccc;
    }

    .pull-right {
        float: right;
        text-align: right;
    }

    .tips {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
        font-size: 12px;
        color: #999999;
        margin-top: 20px;
    }


</style>
