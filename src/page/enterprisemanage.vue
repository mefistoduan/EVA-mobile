<template>
    <div id="pages">
        <mu-appbar style="width: 100%;" color="primary" :title="$t('Business management')">
            <router-link to="/" slot="left">
                <mu-icon value="arrow_back"></mu-icon>
            </router-link>
            <mu-button flat color="primary" slot="right" @click="showPanel">{{btnText}}</mu-button>
        </mu-appbar>
        <mu-bottom-sheet :open.sync="popupVisible" @close="whenClose">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="location">
                        <span>{{$t("query criteria")}}</span>
                        <cityPicker></cityPicker>
                        <span>{{$t("Keyword query")}}</span>
                        <input type="text" placeholder="" v-model="keywords">
                    </div>
                </div>
                <div class="modalBottom">
                    <div class="reset" @click="resetModal">
                        {{$t("Reset")}}
                    </div>
                    <div class="pullUp" @click="searchModal">
                        {{$t("query")}}
                    </div>
                </div>
            </div>
        </mu-bottom-sheet>
        <div class="listContainer">
            <ul class="deteUl">
                <li v-if="!lists.length">
                    <h4>{{$t("no use data")}}</h4>
                </li>
                <li v-for="list in stus" v-if="lists" @click="goPage(list)">
                    <div class="lt">
                        <div class="rowTop">
                            <h5>{{list.ComName}}</h5>
                            <span>{{list.stusType}}</span>
                            <!--<span>{{list.ComType | typeFileter}}</span>-->
                        </div>
                        <div class="rowDetail">
                            <span>{{list.ProvCode}}{{list.CityCode}}{{list.AreaCode}}</span>
                            <span class="pull-right" v-if="list.Orgs">{{list.Orgs[0].Orgname}}</span>
                        </div>
                    </div>
                    <div class="rt">
                        <mu-icon value="keyboard_arrow_right"></mu-icon>
                    </div>
                </li>
                <div class="tips" v-if="lists">{{$t("total")}}{{lists.length}} {{$t("enterprise")}}</div>
            </ul>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    let qs = require('qs');
    import Global from '../Global.js'
    import cityPicker from '../components/cityPicker'

    export default {
        data() {
            return {
                popupVisible: false,//true false
                keywords: '',
                btnText: this.$t("search"),
                lists: []
            }
        },
        mounted() {
            this.writeData();
        },
        computed: {
            stus() {
                let that = this;
                let text = '';
                /*es6写法 防止用不了this.type*/
                return this.lists.filter((v) => {
                    switch (parseInt(v.Status)) {
                        case 1:
                            text = that.$t('hotel');
                            break;
                        case 2:
                            text = that.$t('tavern');
                            break;
                        case 3:
                            text = 'KTV';
                            break;
                        case 4:
                            text = that.$t('Prison');
                            break;
                        default:
                            text = that.$t('other');
                            break;
                    }
                    return v.stusType = text;
                })
            }
        },
        methods: {
            // 重置
            resetModal() {
                this.keywords = '';
                localStorage.defaultProv = '';
                localStorage.defaultCity = '';
                localStorage.defaultArea = '';
            },
            showPanel() {
                this.popupVisible = true;
                this.btnText = this.$t("close");
            },
            whenClose() {
                this.popupVisible = false;
                this.btnText = this.$t("search");
            },
            // 查询
            searchModal() {
                this.writeData();
                this.popupVisible = false;
                this.Toast('已查询', 'success');
            },
            goPage(list) {
                this.$router.push({path: '/enterpriseDetail', query: {ComId: list.ComId}});
            },
            writeData() {
                const that = this;
                let url = headapi + 'v1/Company/GetComlist';
                let pageIndex = 1;
                let tableMax = 100;
                let prov = localStorage.defaultProv;
                let city = localStorage.defaultCity;
                let area = localStorage.defaultArea;
                let searchs = this.keywords;
                let param = {
                    token: localStorage.token,
                    prov: prov,
                    city: city,
                    area: area,
                    searchs: searchs,
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
        components: {
            cityPicker
        }
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

    /deep/ .mu-appbar .material-icons {
        color: #fff;
    }

    /deep/ .mu-appbar-title {
        text-align: center;
    }

    #pages {
        width: 100%;
        height: 100%;
        overflow: hidden;
        overflow-y: scroll;
        display: block;
        margin-top: 0px;
        padding-bottom: 20px;
        background: #f2f2f2;
    }

    .modalSkip {
        position: absolute;
        top: 60px;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        min-height: 736px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.35);
    }

    .listContainer {
        width: 100%;
        height: 100%;
        display: block;
        margin: 0 auto;
        overflow-y: scroll;
    }

    .listContainer ul {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        padding-bottom: 100px;
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

    .deteUl .lt {
        width: 88%;
        float: left;
    }

    .deteUl .rt {
        float: right;
    }

    .rt i {
        margin-top: 20px;
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

    /*mu-bottom-sheet*/
    .mu-bottom-sheet {
        top: 60px !important;
        bottom: 405px;
        background: none;
    }

    .location {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        /*padding-bottom: 40px;*/
    }

    .location span {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .location input {
        width: 95px;
        height: 30px;
        border: 1px solid #D5D5D5;
        float: left;
        text-indent: 10px;
    }

    .modal-content {
        width: 100%;
        display: block;
        margin: 0 auto;
        z-index: 99999;
        overflow: hidden;
    }

    .modal-body {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: #fff;
        padding-top: 20px;
        padding-left: 5%;
        padding-right: 5%;
        padding-bottom: 40px;
    }

    .modalBottom {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: #fff;
    }

    .modalBottom .reset {
        width: 50%;
        float: left;
        height: 40px;
        line-height: 40px;
        background: #FFF6CF;
        text-align: center;
    }

    .modalBottom .pullUp {
        width: 50%;
        float: right;
        height: 40px;
        line-height: 40px;
        background: #FFCC00;
        text-align: center;
    }
</style>
