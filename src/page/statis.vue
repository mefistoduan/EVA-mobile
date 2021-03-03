<template>
    <div>
        <appHeader @goNewpage="onGoNewPage" :title="this.pagetitle"></appHeader>
        <div class="container">
            <div class="row">
                <statischart></statischart>
            </div>
        </div>
    </div>
</template>

<script>
    import appHeader from '../components/appHeader'
    import axios from 'axios';
    let qs = require('qs');
    import Global from '../Global.js'
    import statischart from '../components/statischart'
    export default {
        data() {
            return {
                pagetitle:this.$t('Statistical report forms'),
                lists: []
            }
        },
        mounted() {
        },
        methods: {
            onGoNewPage(path) {
                this.$router.push({path: '/' + path});
            },
        },
        components: {
            statischart,appHeader
        }
    }
</script>

<style scoped>
    .container {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }
    /deep/ #statischart {
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }
</style>
