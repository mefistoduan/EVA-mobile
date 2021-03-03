<template>
    <div>
        <mu-appbar style="width: 100%;" color="primary" :title="$t('User details')">
            <router-link to="/usermanage" slot="left">
                <mu-icon value="arrow_back"></mu-icon>
            </router-link>
        </mu-appbar>
        <div class="container">
            <div class="row">
                <h5>{{detail.Name}}</h5>
                <ul>
                    <li><em>{{$t("usercode")}}：</em><span>{{detail.Usercode}}</span></li>
                    <li><em>Email：</em><span>{{detail.Email | filterContent}}</span></li>
                    <li><em>{{$t("phone")}}：</em><span>{{detail.Phone}}</span></li>
                    <!--<li><em>{{$t("state")}}：</em><span>{{detail.Status | typeFileter}}</span></li>-->
                    <li><em>{{$t("state")}}：</em><span>{{Status}}</span></li>
                    <li><em>{{$t("User roles")}}：</em><span>{{detail.Rolesname | filterContent}}</span></li>
                    <li><em>{{$t("memo")}}：</em><span>{{detail.Memo | filterContent}}</span></li>
                </ul>
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
                detail: {}
            }
        },
        mounted() {
            this.writeData();
        },
        methods: {
            writeData() {
                let content = this.$route.query.detector;
                this.detail = JSON.parse(content);
                console.log(this.detail);
            }
        },
        computed:{
            Status() {
                switch (this.detail.Status) {
                    case 1:
                        return this.$t('disabled');
                        break;
                    default:
                        return this.$t('Enabled');
                        break;
                }
            },
        },
        filters: {
            typeFileter: function (value) {
                switch (parseInt(value)) {
                    case 1:
                        return '已禁用';
                        break;
                    default:
                        return '已启用';
                        break;
                }
            },
            filterContent: function (value) {
                if (value == '' || value == undefined) {
                    return '-'
                } else {
                    return value
                }
            },
        }
    }
</script>

<style scoped>
    /*mu-header*/
    /deep/ .mu-primary-color {
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
    }

    .row {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: #fff;
    }

    .row h5 {
        width: 80%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
        font-size: 20px;
        color: #FFA200;
        padding: 20px;
        border-bottom: 1px solid rgba(112, 112, 112, 0.14);
        margin-bottom: 20px;
    }

    .row ul {
        width: 80%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-top: 10px;
    }

    .row li {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-bottom: 10px;
        font-size: 16px;
    }

    .row li em {
        float: left;
        min-width: 80px;
    }

    .row li span {
        color: #6E6E6E;
    }
</style>
