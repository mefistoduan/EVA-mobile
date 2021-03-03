<template>
    <div id="map">
        <appHeader @goNewpage="onGoNewPage" :title="this.pagetitle"></appHeader>
        <bottomTab :curTab="thisTab"></bottomTab>
        <mapPage @drag="dragMap" :curheight="curheight" :divcontainer="'js-container2'"></mapPage>
    </div>
</template>

<script>
    import appHeader from '../components/appHeader'
    import bottomTab from '../components/bottomTab'
    import mapPage from '../components/mapPage'
    export default {
        data() {
            return {
                pagetitle: this.$t('Map'),
                thisTab:  this.$t('Map'),
                curheight:  window.screen.height,
            }
        },
        mounted(){
            console.log(window.screen.height);
        },
        methods: {
            onGoNewPage(path) {
                this.$router.push({path: '/' + path});
            },
            dragMap() {
            },
        },
      components: {
          mapPage,appHeader,bottomTab
      }
    }
</script>

<style scoped>
    #map {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        overflow: hidden;
        display: block;
        margin-top: 0px;
        padding-bottom: 0px;
        background: #f2f2f2;
    }
</style>
