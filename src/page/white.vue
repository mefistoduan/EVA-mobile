<template>
    <div id="pages">
        <mu-appbar style="width: 100%;" color="primary" :title="curTitle">
            <router-link to="/" slot="left">
                <mu-icon value="arrow_back"></mu-icon>
            </router-link>
            <mu-button flat color="primary" slot="right" @click="showPanel">{{btnText}}</mu-button>
        </mu-appbar>
        <mu-bottom-sheet :open.sync="popupVisible">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="location">
                        <span>{{$t("query criteria")}}</span>
                        <div class="timePickerPart">
                            <span @click="changeTime(1)">{{bt}}</span> <em>{{$t("to")}}</em>
                            <span @click="changeTime(2)">{{et}}</span>
                        </div>
                        <div v-show="open">
                            <mu-flex justify-content="between" align-items="end" wrap="wrap">
                                <mu-paper :z-depth="1" class="demo-date-picker">
                                    <mu-date-picker :date.sync="date" color="#FFA200" :date-time-format="enDateFormat"
                                                    @change="confirmDay"></mu-date-picker>
                                </mu-paper>
                            </mu-flex>
                        </div>
                        <input type="text" placeholder="MAC" v-model="MAC" id="macInput">
                        <input type="text" :placeholder="$t('keyword')" v-model="keyWord" id="keyWordInput">
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
        <div class="container">
            <div class="row">
                <p class="tips" v-if="!lists">{{$t("no use data")}}</p>
                <mu-list textline="two-line" v-for="list in lists" :key="list.Id">
                    <mu-list-item avatar :ripple="false" button>
                        <mu-list-item-content>
                            <mu-list-item-title>{{list.Name}}</mu-list-item-title>
                            <mu-list-item-sub-title>{{list.Mac}}</mu-list-item-sub-title>
                            <mu-list-item-sub-title>{{list.Memo}}</mu-list-item-sub-title>
                        </mu-list-item-content>
                        <mu-list-item-action>
                            <mu-list-item-after-text>{{list.CreateTime | timeFileter}}</mu-list-item-after-text>
                            <mu-list-item-after-text>{{list.Regionname}}</mu-list-item-after-text>
                            <mu-list-item-after-text>{{$t("operator")}}： {{list.Usercode}}</mu-list-item-after-text>
                        </mu-list-item-action>
                    </mu-list-item>
                    <mu-divider></mu-divider>
                </mu-list>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    let qs = require('qs');
    import Global from '../Global.js'
    const enDateFormat = {
        formatDisplay (date) {
            return `${dayList[date.getDay()]}, ${monthList[date.getMonth()]} ${date.getDate()}`;
        },
        formatMonth (date) {
            return `${monthLongList[date.getMonth()]} ${date.getFullYear()}`;
        },
        getWeekDayArray (firstDayOfWeek) {
            let beforeArray = [];
            let afterArray = [];
            for (let i = 0; i < dayAbbreviation.length; i++) {
                if (i < firstDayOfWeek) {
                    afterArray.push(dayAbbreviation[i]);
                } else {
                    beforeArray.push(dayAbbreviation[i]);
                }
            }
            return beforeArray.concat(afterArray);
        },
        getMonthList () {
            return monthList;
        }
    };
    export default {
        data() {
            return {
                enDateFormat,
                curTitle:this.$t("whiteList"),
                lists: [],
                popupVisible:false,//true false
                open:false,//true false
                MAC:'',//
                keyWord:'',//
                bt: globaltime2StringNoMin(new Date() - 3 * 24 * 3600 * 1000),
                et: globaltime2StringNoMin(new Date()),
                date: new Date(),
                btnText: this.$t("search"),
            }
        },
        mounted() {
            this.writeData();
        },
        filters: {
            timeFileter: function (time) {
                return globalfmtDate(time, 10)
            },
        },
        methods: {
            changeTime(val) {
                this.open = true;
                let curVal = val == 1 ? new Date(this.bt) : new Date(this.et);
                this.selectTime = val;
                this.date = curVal;
            },
            showPanel() {
                this.popupVisible = true;
                this.btnText = this.$t("close");
            },
            whenClose(){
                this.popupVisible = false;
                this.btnText = this.$t("search");
            },
            confirmDay(date) {
                if (this.selectTime == 1) {
                    this.bt = globaltime2StringNoMin(date);
                } else {
                    this.et = globaltime2StringNoMin(date);
                }
                this.open = false;
            },
            // 重置
            resetModal() {
                this.MAC = '';
                this.keyWord = '';
                this.bt = globaltime2StringNoMin(new Date() - 3 * 24 * 3600 * 1000);
                this.et = globaltime2StringNoMin(new Date());
                this.Toast('已重置','success');
            },
            // 查询
            searchModal() {
                let that = this;
                this.popupVisible = false;
                this.writeData();
                this.Toast('已查询','success');
            },
            writeData() {
                const that = this;
                let url = headapi + 'v1/Detector/WhiteListQuery';
                let param = {
                    token: localStorage.token,
                    detectedmac:that.MAC,
                    keywords:that.keyWord,
                    bt:that.bt + ' 00:00:00',
                    et:that.et + ' 23:59:59',
                };
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
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        overflow-y: scroll;
        display: block;
        margin: 0 auto;
    }
    .modal-content {
        width: 100%;
        display: block;
        margin: 0 auto;
        z-index: 99999;
        overflow: hidden;
    }

    /*mu-bottom-sheet*/
    .mu-bottom-sheet {
        top: 60px !important;
        bottom: 410px;
        background: none;
    }

    .location {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
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

    .modal-body {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: #fff;
        padding-top: 20px;
        padding-left: 5%;
        padding-right: 5%;
        padding-bottom: 20px;
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

    .location select {
        width: 95px;
        height: 30px;
        border: 1px solid #D5D5D5;
        float: left;
        margin-right: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .location select#detector {
        margin-right: 0;
        float: left;
    }

    #macInput {
        width: 200px;
        margin-bottom: 10px;
    }
    #keyWordInput {
        width: 200px;
    }

    .timePickerPart {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .timePickerPart em {
        width: 25px;
        height: 30px;
        line-height: 50px;
        float: left;
    }

    .timePickerPart span {
        width: 135px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #D5D5D5;
        float: left;
        margin-right: 8px;
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: center;
    }
    .demo-date-picker {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        border: none;
        box-shadow: none;
    }
    .mu-datepicker {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }
    .mu-list {
        background: #fff;
    }
    .tips {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
        margin-top: 20px;
    }
</style>
