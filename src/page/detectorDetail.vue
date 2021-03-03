<template>
    <div id="pages">
        <mu-appbar style="width: 100%;" color="primary" :title="titletext">
            <router-link to="/detector" slot="left">
                <mu-icon value="arrow_back"></mu-icon>
            </router-link>
        </mu-appbar>
        <div class="row">
            <h5>{{detail.ComName}}</h5>
            <ul>
                <li><em>Mac：</em><span>{{detail.Mac}}</span></li>
                <li><em>{{$t("Affiliated Enterprises")}}：</em><span>{{detail.ComName  | filterContent}}</span></li>
                <li><em>{{$t("Tag name")}}：</em><span>{{detail.TagName  | filterContent}}</span></li>
                <li><em>{{$t("local")}}：</em><span>{{detail.Prov}}{{detail.City}}{{detail.Area}}{{detail.Name}}</span></li>
                <li><em>{{$t("memo")}}：</em><span>{{detail.Memo  | filterContent}}</span></li>
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
                detail: {},
                titletext:this.$t('Detection') + this.$t('detail'),
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
        filters: {
            filterContent: function (value) {
                if (value == '' || value == undefined) {
                    return '-'
                } else {
                    return value
                }
            },
        },
        components: {}
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        overflow: hidden;
        display: block;
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
