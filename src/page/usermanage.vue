<template>
    <div id="pages">
        <appHeader @goNewpage="onGoNewPage" :title="this.pagetitle"></appHeader>
        <div class="listContainer">
            <ul class="deteUl">
                <li v-if="!lists.length">
                    <h4>{{$t("no use data")}}</h4>
                </li>
                <transition-group name="fade">
                <li v-for="list in stus" v-if="lists" @click="goPage(list)" v-bind:key="list.Id">
                    <div class="lt">
                        <div class="rowTop">
                            <h5>{{list.Name}}</h5>
                            <!--<span>{{list.Status | typeFileter}}</span>-->
                            <span>{{list.stusType}}</span>
                        </div>
                        <div class="rowDetail">
                            <span>{{list.Rolesname}}</span>
                            <span class="pull-right">{{list.Insname | filterContent}}</span>
                        </div>
                    </div>
                    <div class="rt">
                         <mu-icon value="keyboard_arrow_right"></mu-icon>
                    </div>
                </li>
                </transition-group>
                <div class="tips" v-if="lists">{{$t("total")}} {{lists.length}} {{$t("enterprise")}}</div>
            </ul>
        </div>
    </div>
</template>

<script>
    import appHeader from '../components/appHeader'
    import axios from 'axios';
    let qs = require('qs');
    import Global from '../Global.js'
    export default {
        data() {
            return {
                pagetitle:this.$t('user management'),
                lists: []
            }
        },
        mounted() {
            this.writeData();
        },
        computed:{
            stus(){
                let that = this;
                let text = '';
                /*es6写法 防止用不了this.type*/
                return this.lists.filter((v)=>{
                    console.log(v.Status);
                    switch (parseInt(v.Status)) {
                        case 1:
                            text = that.$t('disabled');
                            break;
                        default:
                            text = that.$t('Enabled');
                            break;
                    }
                    return v.stusType = text;
                })
            }
        },
        methods: {
            onGoNewPage(path) {
                this.$router.push({path: '/' + path});
            },
            goPage(list) {
                this.$router.push({path: '/userDetail', query: {detector: JSON.stringify(list)}});
            },
            writeData() {
                const that = this;
                let url = headapi + 'v1/User/UserListInfo';
                let pageIndex = 1;
                let tableMax = 100;
                let param = {
                    token: localStorage.token,
                    usertype: '0',
                    searchs: '',
                    pageIndex: pageIndex,
                    tableMax: tableMax
                };
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        that.lists = json.Rs;
                    } else {
                        that.Toast(that.TransMemo(json.Memo));
                    }
                }, function (response) {
                    console.info(response);
                })
            }
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
        },
        components: {
            appHeader
        }
    }
</script>

<style scoped>
    #pages {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: block;
        margin-top: 0px;
        padding-bottom: 20px;
        background: #f2f2f2;
        overflow-y: scroll;
    }

    .listContainer ul {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .listContainer li {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-bottom: 2px;
        padding: 10px 20px;
        background: #fff;
    }

    .listContainer .rowTop {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .rowTop .red {
        color: #FFA200;
    }

    .listContainer h5 {
        margin: 0;
        float: left;
        font-size: 16px;
    }

    .listContainer .rowTop span {
        float: right;
        font-size: 14px;
    }

    .listContainer .rowDetail {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        color: #999999;
        font-size: 14px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .deteUl .lt {
        width: 88%;
        float: left;
    }

    .deteUl .rt {
        float: right;
    }

    .rt i {
        margin-top: 20px;
    }
    .pull-right {
        float: right;
        text-align: right;
    }
    .tips {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        text-align: center;
        font-size: 12px;
        color: #999999;
        margin-top: 20px;
    }
</style>
