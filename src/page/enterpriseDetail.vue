<template>
    <div id="pages">
        <mu-appbar style="width: 100%;" color="primary" :title="$t('Company details')">
            <router-link to="/enterprisemanage" slot="left">
                <mu-icon value="arrow_back"></mu-icon>
            </router-link>
        </mu-appbar>
        <div class="container">
            <div class="row">
                <h5>{{detail.ComName}}</h5>
                <ul>
                    <li><em>{{$t("Enterprise name")}}：</em><span>{{detail.ComName}}</span></li>
                    <li><em>{{$t("Enterprise types")}}：</em><span>{{ComType}}</span></li>
                    <li>
                        <em>{{$t("Enterprise address")}}：</em><span>{{detail.ProvCode}}{{detail.CityCode}}{{detail.AreaCode}}{{detail.Addr}}</span>
                    </li>
                    <li><em>{{$t("Subordinate supervision")}}：</em><span>
                        <em v-for="(org,index) in detail.Orgs">{{org.Orgname}} <i
                                v-if="detail.Orgs.length-1 != index">、</i></em>
                    </span></li>
                    <li><em>{{$t("Contacts")}}：</em><span>{{Legal}}</span></li>
                    <li><em>{{$t("phone")}}：</em><span>{{Phone}}</span></li>
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
                detail: {},
                // Legal:'',
                // Phone:'',
                // ComType:'',
            }
        },
        mounted() {
            this.writeData();
        },
        computed: {
            Legal() {
                if (this.detail.Legal == '' || this.detail.Legal == undefined) {
                    return this.$t('nothing')
                } else {
                    return this.detail.Legal
                }
            },
            Phone() {
                if (this.detail.Phone == '' || this.detail.Phone == undefined) {
                    return this.$t('nothing')
                } else {
                    return this.detail.Legal
                }
            },
            ComType() {
                if (this.detail.ComType == '' || this.detail.ComType == undefined) {
                    return this.$t('nothing')
                } else {
                    return this.detail.Legal
                }
            },
        },
        methods: {
            writeData() {
                const that = this;
                let url = headapi + 'v1/Company/ComInfoDetail';
                let param = {
                    token: localStorage.token,
                    comId: that.$route.query.ComId
                };
                let postdata = qs.stringify(param);
                axios.post(url, postdata).then(function (data) {
                    let json = data.data;
                    if (json.Code == 0) {
                        that.detail = json.Rs;
                    } else {
                        this.Toast(that.TransMemo(json.Memo));
                    }
                }, function (response) {
                    console.info(response);
                })
            }
        },
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

    #pages {
        position: absolute;
        width: 100%;
        overflow: hidden;
        display: block;
        margin-top: 0px;
        top: 0;
        bottom: 0;
        padding-bottom: 200px;
        background: #f2f2f2;
    }

    .row {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        margin-top: 10px;
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
