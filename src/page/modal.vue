<template>
    <div>
        <mu-appbar style="width: 100%;" color="primary" title="详情信息">
            <router-link to="/" slot="left">
                <mu-icon value="arrow_back"></mu-icon>
            </router-link>
        </mu-appbar>
    </div>
</template>

<script>
    import axios from 'axios';
    let qs = require('qs');
    import Global from '../Global.js'
    export default {
        data() {
            return {
                lists: []
            }
        },
        mounted() {
        },
        methods: {},
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
</style>
