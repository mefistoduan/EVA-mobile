<template>
    <div id="statischart">
        <div class="time">
    <span @click="changeTime(1)">
    {{bt}}
    </span>
            <span @click="changeTime(2)">
    {{et}}
    </span>
            <mu-select label="" v-model="selectVal">
                <mu-option v-for="option in options" :key="option.optionsVal" :label="option.name"
                           :value="option.optionsVal"></mu-option>
            </mu-select>
            <mu-button color="warning" @click="getNewChart" small>{{$t('search')}}</mu-button>
        </div>

        <Line-example
                :width="390"
                :height="200"
                :dataLabels="dataLabels"
                :datadatasets="datadatasets"
        />

        <mu-bottom-sheet :open.sync="open">
            <mu-flex justify-content="between" align-items="end" wrap="wrap">
                <mu-paper :z-depth="1" class="demo-date-picker">
                    <mu-date-picker :date.sync="date" color="#FFA200" :date-time-format="enDateFormat"
                                    @change="confirmDay"></mu-date-picker>
                </mu-paper>
            </mu-flex>
        </mu-bottom-sheet>
    </div>
</template>
<script>
    import Global from '../Global'
    import Vue from 'vue'
    import LineExample from './LineExample'

    let qs = require('qs');
    import axios from 'axios';

    const enDateFormat = {
        formatDisplay(date) {
            return `${dayList[date.getDay()]}, ${monthList[date.getMonth()]} ${date.getDate()}`;
        },
        formatMonth(date) {
            return `${monthLongList[date.getMonth()]} ${date.getFullYear()}`;
        },
        getWeekDayArray(firstDayOfWeek) {
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
        getMonthList() {
            return monthList;
        }
    };
    export default {
        data() {
            return {
                enDateFormat,
                bt: globaltime2StringNoMin(new Date() - 3 * 24 * 3600 * 1000),//test
                et: globaltime2StringNoMin(new Date()),
                date: new Date(),
                pickerValue: '',
                open: false,
                selectTime: 0,
                selectVal: 1,
                pickerItem: 0,
                dataLabels: [],
                datadatasets: [],
                options: [
                    {name: this.$t('Total detection record'), optionsVal: 1},
                ]
            }
        },
        mounted() {
            this.getNewChart()
        },
        methods: {
            changeTime(val) {
                this.open = true;
                let curVal = val == 1 ? new Date(this.bt) : new Date(this.et);
                this.selectTime = val;
                this.date = curVal;
            },
            confirmDay(date) {
                if (this.selectTime == 1) {
                    this.bt = globaltime2StringNoMin(date);
                } else {
                    this.et = globaltime2StringNoMin(date);
                }
                this.open = false;
            },
            getNewChart() {
                const that = this;
                let url = headapi + 'v1/Detector/GetCtNumStatisticByday';
                let param = {
                    token: localStorage.token,
                    bt: that.bt + ' 00:00:00',
                    et: that.et + ' 23:59:59',
                    dailytype: that.selectVal,
                };
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        let detectorArr = json.Rs;
                        that.dataLabels = detectorArr.RsX;
                        that.datadatasets = detectorArr.RsY;
                    } else {
                        if (!localStorage.token) { //未登录状态
                            console.log(json.Memo);
                        } else { //已登录状态
                            that.Toast(that.TransMemo(json.Memo));
                        }
                    }
                }, function (response) {
                    console.info(response);
                });
            },
        },
        components: {
            LineExample
        },
    }
</script>

<style scoped>
    .container {
        width: 100%;
        height: 230px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    #statischart {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-bottom: 10px;
    }

    .time {
        width: 100%;
        height: 48px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        padding-left: 2%;
        padding-right: 2%;
        padding-top: 15px;
        margin-bottom: 15px;
        border-bottom: 1px solid #f2f2f2;
    }

    .time span {
        width: 80px;
        height: 27px;
        float: left;
        border: 1px solid #DEDEDE;
        text-align: center;
        line-height: 27px;
        font-size: 12px;
        margin-right: 10px;
    }

    .time select {
        width: 96px;
        height: 27px;
        float: left;
        border: 1px solid #DEDEDE;
        text-align: center;
        line-height: 27px;
        font-size: 12px;
        margin-right: 10px;
    }

    .time .mint-button {
        height: 27px;
        border-radius: 0;
    }

    .mu-input {
        width: 100px;
        float: left;
        padding: 0;
        margin: 0;
    }

    /deep/ .mu-select-input {
        font-size: 12px !important;
    }

    .mu-button {
        float: left;
        min-width: 66px;
    }

    .demo-date-picker {
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    /deep/ .mu-button-wrapper {
        color: #000 !important;
    }
</style>
