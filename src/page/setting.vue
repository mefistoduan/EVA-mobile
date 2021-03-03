<template>
    <div id="pages">
        <mu-appbar style="width: 100%;" color="primary" :title="$t('System setup')">
            <router-link to="/" slot="left">
                <mu-icon value="arrow_back"></mu-icon>
            </router-link>
        </mu-appbar>
        <div class="">
            <div class="row">
                <mu-list>
                    <mu-list-item button :ripple="false">
                        <mu-list-item-title>{{$t("Alarm sound")}}</mu-list-item-title>
                        <mu-list-item-action>
                            <mu-switch v-model="voiceState"></mu-switch>
                        </mu-list-item-action>
                    </mu-list-item>
                    <mu-divider></mu-divider>
                    <mu-list-item button :ripple="false">
                        <mu-list-item-title>{{$t("Alarm flicker")}}</mu-list-item-title>
                        <mu-list-item-action>
                            <mu-switch v-model="alertState"></mu-switch>
                        </mu-list-item-action>
                    </mu-list-item>
                    <div class="grip"></div>
                    <mu-list-item button :ripple="false" @click="openAlertDialog">
                        <mu-list-item-title>{{$t("Quit landing")}}</mu-list-item-title>
                    </mu-list-item>
                </mu-list>
            </div>
        </div>
        <mu-dialog width="600" max-width="80%" :esc-press-close="false"
                   :overlay-close="false" :open.sync="openAlert">
            {{$t("Confirm to exit the current account")}}?
            <mu-button slot="actions" flat color="info" @click="closeAlertDialog">{{$t("cancel")}}</mu-button>
            <mu-button slot="actions" flat color="warning" @click="logout">{{$t("confirm")}}</mu-button>
        </mu-dialog>
    </div>
</template>

<script>
    import axios from 'axios';

    let qs = require('qs');
    import Global from '../Global.js'

    export default {
        data() {
            return {
                lists: [],
                voiceState: false,
                alertState: false,
                openAlert: false
            }
        },
        mounted() {
            localStorage.voiceState = localStorage.voiceState || false;
            localStorage.alertState = localStorage.alertState || false;
            this.voiceState = JSON.parse(localStorage.voiceState);
            this.alertState = JSON.parse(localStorage.alertState);
        },
        watch: {
            voiceState: function (val) {
                localStorage.voiceState = val;
            },
            alertState: function (val) {
                localStorage.alertState = val;
            },
        },
        methods: {
            openAlertDialog() {
                this.openAlert = true;
            },
            closeAlertDialog() {
                this.openAlert = false;
            },
            // 退出
            logout() {
                this.openAlert = false;
                const that = this;
                localStorage.token = '';
                that.$router.push({path: '/login'});
            },
        },
    }
</script>

<style scoped>
    #pages {
        width: 100%;
        top: 0;
        bottom: 0;
        height: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: #f2f2f2;
    }

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

    .mu-button {
        display: block;
        margin: 0 auto;
    }

    .row {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .mu-switch-checked {
        color: #FFCC00;
    }

    .grip {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        height: 10px;
    }

    /deep/ .mu-item-wrapper {
        background: #fff;
        font-size: 16px;
        color: #000;
    }
</style>
