<template>
    <div>
        <mu-paper :z-depth="1" class="demo-loadmore-wrap">
            <mu-container ref="container" class="demo-loadmore-content">
                <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
                    <li v-for="i in list">
                        {{text}} Item {{i.ClassName}}
                    </li>

                </mu-load-more>
            </mu-container>
        </mu-paper>
    </div>
</template>

<script>
    import axios from 'axios';
    import {
        VipUserConsumeListQuery,
    } from '../api/getApiRes.js'

    let qs = require('qs');
    import Global from '../Global.js'

    export default {
        data() {
            return {
                num: 20,
                refreshing: false,
                loading: false,
                text: 'List',
                list: [],
                start: 1,
                tableMax: 5,
            }
        },
        mounted() {
            this.getVipUserConsumeListQuery();
        },
        methods: {
            refresh() {
            },
            load() {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.start =  this.start + 5;
                    this.getVipUserConsumeListQuery();
                }, 2000);
            },
            getVipUserConsumeListQuery() {
                let that = this;
                let param = {
                    token: localStorage.token,
                    start: this.start,
                    tableMax: this.tableMax,
                };
                let postdata = qs.stringify(param);
                VipUserConsumeListQuery(postdata).then(res => {
                    let json = res;
                    if (json.Code == 0) {
                        that.list =  that.list.concat(json.Rs);
                    } else {
                        that.Toast(json.Memo + ', 错误码：' + json.Code);
                    }
                })
            },
        }
    };
</script>

<style scoped>
    .demo-loadmore-wrap {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        overflow-y: scroll;
        flex-direction: column;
    }

    .mu-appbar {
        width: 100%;
    }

    .demo-loadmore-content {
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
    li {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        height: 160px;
        line-height: 160px;
        border: 1px solid #ccc;
        text-align: center;
    }
</style>