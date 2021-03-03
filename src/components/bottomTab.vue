<template>
    <div id="bottomTab">
        <mu-container style="width: 100%;" color="primary">
            <mu-bottom-nav :value="nowTab" color="#E75296">
                <mu-bottom-nav-item v-for="tab in tabs" :title="tab.name" :icon="tab.src" :to="tab.class" :key="tab.tabindex"
                                    :value="tab.name"></mu-bottom-nav-item>
            </mu-bottom-nav>
        </mu-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                nowTab: this.curTab,
                tabs: [
                    {name: '预约课程', class: '/', src: ' ', tabindex: 1},
                    {name: '预约记录', class: 'record', src: ' ', tabindex: 2},
                    {name: '我的', class: 'mine', src: ' ', tabindex: 3},
                    //laptop
                ]
            }
        },
        props: ['curTab'],
        methods: {},
        watch: {
            '$route': function (e) {
                this.nowTab = e.meta.title;
            }
        },
    }
</script>

<style scoped>
    #bottomTab {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: #fff;
        border-top: 1px solid #eee;
        z-index: 9999;
    }

    .container {
        padding: 0;
    }

    /*非选中态图标 */
    /deep/ a:nth-child(1) .mu-bottom-item-icon {
        background-image: url(../static/images/bottom/Calendar@2x.png);
        background-repeat: no-repeat;
        width: 24px;
        height: 24px;
        background-size: auto 24px;
    }

    /deep/ a:nth-child(2) .mu-bottom-item-icon {
        background-image: url(../static/images/bottom/Newspaper@2x.png);
        background-repeat: no-repeat;
        width: 24px;
        height: 24px;
        background-size: auto 24px;
    }

    /deep/ a:nth-child(3) .mu-bottom-item-icon {
        background-image: url(../static/images/bottom/User@2x.png);
        background-repeat: no-repeat;
        width: 24px;
        height: 24px;
        background-size: auto 24px;
    }

    /*选中态图标*/
    /deep/ a:nth-child(1).mu-bottom-item-active .mu-bottom-item-icon {
        background-image: url(../static/images/bottom/CalendarRed@2x.png);
        background-repeat: no-repeat;
        width: 24px;
        height: 24px;
        background-size: auto 24px;
    }

    /deep/ a:nth-child(2).mu-bottom-item-active .mu-bottom-item-icon {
        background-image: url(../static/images/bottom/NewspaperRed@2x.png);
        background-repeat: no-repeat;
        width: 24px;
        height: 24px;
        background-size: auto 24px;
    }

    /deep/  a:nth-child(3).mu-bottom-item-active .mu-bottom-item-icon {
        background-image: url(../static/images/bottom/UserRed@2x.png);
        background-repeat: no-repeat;
        width: 24px;
        height: 24px;
        background-size: auto 24px;
    }

     .mu-bottom-item-text {
        color: #999999
    }

    .mu-bottom-item-active .mu-bottom-item-text {
        color: #2b2b2b;
    }
</style>
