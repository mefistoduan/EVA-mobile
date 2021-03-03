<template>
    <div id="pages">
            <h5>404</h5>
            <span @click="$router.back(-1)">{{$t("Back to previous page")}}</span>
    </div>
</template>

<script>
export default {
    data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #pages {
        position: absolute;
        top:0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        background:#2c2e2f
    }
    h5 {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        font-size: 160px;
        text-align: center;
        margin-top: 10%;
        color: #fff;
        font-weight: normal;
    }
    span {
        width: 200px;
        height: 45px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-top: 10%;
        background:#FFA200 ;
        color: #fff;
        font-size: 18px;
        text-align: center;
        border-radius: 250px;
        line-height: 45px;
        cursor: pointer;
    }
    span:hover {
        background: #FFA200;
    }
</style>
