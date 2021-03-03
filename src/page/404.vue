<template>
    <div class="container">
        <p class="content">系统升级中
            <br>
            敬请期待</p>
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

   #app {
        background: cornflowerblue;
    }

    .container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background: cornflowerblue;
        background-image: url("../static/images/404/man.png");
        background-position: top center;
        background-repeat: no-repeat;
        background-size: 100%;
    }

    .container {
        width: 100%;
        overflow: hidden;
        margin: 0 auto;
        text-align: center;
        color: #fff;
        font-size: 36px;
    }

    .content {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-top: 27%;
    }
</style>
