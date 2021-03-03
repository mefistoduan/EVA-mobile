<template>
    <div class="container">
        <div class="Chart">
            <div class="time">
                <span @click="changeTime(1)">
                    {{bt}}
                </span>
                <span @click="changeTime(2)">
                    {{et}}
                </span>
                <select name="" id="" v-model="selectVal">
                    <option value="1">总探测记录</option>
                </select>
                <mt-button size="small" type="primary" @click="getNewChart">查询</mt-button>
            </div>
            <Line-example
                    :width="414"
                    :height="200"
                    :dataLabels="dataLabels"
                    :datadatasets="datadatasets"
            />
        </div>
        <mt-datetime-picker
                ref="picker"
                type="date"
                v-model="pickerValue"
                @confirm="handleConfirm"
        >
        </mt-datetime-picker>
    </div>
</template>

<script>
    import {DatetimePicker} from 'mint-ui';
    import {Toast} from 'mint-ui';
    import LineExample from './LineExample'
    import Global from '../Global'
    import Vue from 'vue'

    let qs = require('qs');
    import axios from 'axios';

    Vue.component(DatetimePicker.name, DatetimePicker);
    export default {
        data() {
            return {
                bt: globaltime2StringNoMin(new Date() - 3 * 24 * 3600 * 1000),
                et: globaltime2StringNoMin(new Date()),
                pickerValue: '',
                selectVal: 1,
                pickerItem: 0,
                dataLabels: [],
                datadatasets: [],
            }
        },
        mounted() {
            this.getNewChart();
        },
        methods: {
            changeTime(val) {
                this.$refs.picker.open();
                this.pickerValue = val == 1 ? this.bt : this.et;
                this.pickerItem = val;
            },
            handleConfirm(e) {
                let that = this;
                console.log(this.pickerItem);
                if (this.pickerItem == 1) {
                    that.bt = globaltime2String(e)
                } else {
                    that.et = globaltime2String(e)
                }
                this.$refs.picker.close();
            },
            // 查询
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
                        // Toast(json.memo);
                        console.log(json.Memo);
                    }
                }, function (response) {
                    console.info(response);
                });
            }
        },
        components: {
            LineExample
        },
    }
</script>

<style>
    .container {
        width: 100%;
        height: 230px;
        margin: 0 auto;
    }

    .time {
        width: 96%;
        height: 48px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        padding-left: 2%;
        padding-right: 2%;
        padding-top: 15px;
        border-bottom: 1px solid #f2f2f2;
    }

    .time span {
        width: 96px;
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
</style>
