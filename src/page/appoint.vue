<template>
  <div class="pages">

    <div class="as">
      <img src="../static/images/main/banner.png" width="100%"/>
      <!--<mu-tabs :value.sync="active" color="#F2F2F2" indicator-color="#ffffff" @change="getIndex" v-if="reFresh">-->
      <!--<mu-tab v-for="day in weeks">{{ day.data }} <br> <em>{{ day.name }}</em></mu-tab>-->
      <!--</mu-tabs>-->
      <div class="tabs">
        <div :class="[{'tab':true},{'activeTab':i == active}]" v-for="(day,i) in weeks" @click="changeActive(i)">
          {{ day.name }} <br> <em>{{ day.data }}</em>
        </div>
      </div>
      <span class="sum">
        {{ today }} 预约名额剩余
        <em class="green" v-if="num > 0">{{ num }}</em>
        <em class="red" v-else>{{ num }}</em>
        人
      </span>
    </div>
    <div class="context">
      <ul class="list">
        <li v-for="l in list" 
          :class="[{'greenLi':l.remain > 0},{'redLi':l.Status == 1},{'yellowLi':l.remain == 0},{'whiteLi':l.WxOrder == 0},{'whiteLi':l.IsAllowSelect == 0}]">
          <div class="dotContainer">
            <div v-if="l.IsAllowSelect > 0">
              <!--正常-->
              <i class="dot" v-if="l.remain>0 && l.WxOrder != 0"></i>
              <i class="cubes" v-if="l.Status==1"></i>
              <!--满员-->
              <i class="tri" v-if="l.remain == 0 && l.remain == 0"></i>
              <!--不可约-->
              <i class="x" v-if="l.WxOrder==0"></i>
            </div>
            <!-- 不可匹配课程 -->
            <div v-else>
              <i class="x" v-if="l.OrderId == 0"></i>
            </div>
          </div>
          <div class="title">
            <h5><span class="lessons" :style="{ background:l.ClassColor }">{{ l.ClassName }}</span></h5>
            <span>{{ l.BeginStr }} - {{ l.EndStr }}</span>
          </div>
          <div class="current">
            <h5>剩余
              <em class="green" v-if="l.remain > 0">{{ l.remain }}</em>
              <em class="red" v-else>{{ l.remain }}</em>
              人
            </h5>
            <span>总名额 {{ l.OrderToplimit }} 人</span>
          </div>
          <!-- 可匹配课程 -->
          <div v-if="l.IsAllowSelect > 0">
            <mu-button class="appointBtn greenBtn" v-if="l.remain > 0 && l.OrderId == 0 && l.WxOrder != 0"
              @click="appointNow(l)">
              预约
            </mu-button>
            <mu-button class="appointBtn redBtn" v-if="l.remain == 0 && l.OrderId == 0" @click="isFulled">满员
            </mu-button>
            <mu-button class="appointBtn yellowBtn" v-if="l.OrderId != 0" @click="isAppointed(l)">已约</mu-button>
            <mu-button class="appointBtn disableBtn" v-if="l.WxOrder == 0 && l.OrderId == 0" @click="isDisable">不可约</mu-button>
          </div>
          <!-- 不可匹配课程 -->
          <div v-else>
            <mu-button class="appointBtn disableBtn" @click="isDisable" v-if="l.OrderId == 0">不可约</mu-button>
          </div>
        </li>
        <div class="tips" v-if="list == ''">
          <p style="text-align: center">
            暂无可预约的课程
          </p>
        </div>
      </ul>
      <!-- 课程表入口 -->
      <!-- <mu-avatar color="rgb(231, 82, 150)" @click.native="goPage('lesson')">
        <mu-icon value="reorder"></mu-icon>
      </mu-avatar> -->
    </div>
    <bottomTab :curTab="thisTab"></bottomTab>
    <div class="doalog">
      <mu-dialog title="预约课程" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false"
        :open.sync="openAlert">
        <p>
          是否预约 课程：{{ dialog.ClassName }} ，时间：{{ dialog.BeginStr }} - {{ dialog.EndStr }}
          <br>
        </p>
        <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">取消</mu-button>
        <mu-button slot="actions" flat color="primary" @click="confirmAppoint">确定</mu-button>
      </mu-dialog>
    </div>
    <alert ref="alertPart"></alert>
  </div>
</template>

<script>
  import axios from 'axios';
  import bottomTab from '../components/bottomTab'
  import {
    CanOrderSchoolTimeTableListQuery,
    OderAddByVipUser,
    OderCancelByVipUser,
    QueryNextWeek,
    testSelect,
    testTable,
  } from '../api/getApiRes.js'

  import alert from '../components/alert'

  let qs = require('qs');
  import Global from '../Global.js'

  export default {
    data() {
      return {
        num: 0,
        thisTab: '预约课程',
        active: 0,
        sum: 0,
        HaveDays: 0,
        openAlert: false,
        reFresh: true,
        list: [],
        weeks: [],
        today: '',
        dialog: {
          id: '',
          name: '',
          timeLong: '',
        },
      }
    },
    mounted() {
      this.getQueryNextWeek();
      // this.alertInfo(document.body.clientWidth);
      // this.alertInfo( window.screen.height);
    },
    watch: {
      '$route'(to) {
        if (to.name == 'appoint') {
          this.getList();
        }
      },
      'active'(to) {
        this.getList();
      }
    },
    activated() {
      this.active = 0;
      this.reFresh = false;
      this.$nextTick(() => {
        this.reFresh = true;
        this.getQueryNextWeek();
      });

    },
    methods: {
      changeActive(i) {
        this.active = i;
      },
      getIndex(val) {
        console.log(val);
      },
      getQueryNextWeek() {
        let that = this;
        let param = {
          token: localStorage.token,
          shopId: this.$route.query.shopId,
        };
        let postdata = qs.stringify(param);
        this.weeks = [];
        QueryNextWeek(postdata).then(res => {
          let json = res;
          if (json.Code == 0) {
            this.HaveDays = json.Rs;
            this.getFurtherDays(this.HaveDays);
          } else {
            that.list = [];
            that.$message.error(json.Memo);
          }
        })
      },
      alertInfo(info) {
        this.$refs.alertPart.openSimpleDialog(info);
      },
      goPage(url) {
        this.$router.push({
          path: '/' + url, query: {
            shopId: this.$route.query.shopId
          }
        });
      },
      // 获取未来7天的
      getFurtherDays(HaveDays) {
        let now = new Date();
        let nowTime = now.getTime();
        let oneDayTime = 24 * 60 * 60 * 1000;
        let days = '';
        let item = [];
        let month = 0;
        let day = 0;
        this.weeks = [];
        for (let i = 0; i < HaveDays; i++) {
          days = new Date(nowTime + (i) * oneDayTime);//显示周日
          month = days.getMonth() + 1;
          day = days.getDate();
          month = month < 10 ? '0' + month : month;
          day = day < 10 ? '0' + day : day;
          item = {
            name: this.numberToWeek(days.getDay()),
            data: days.getMonth() + 1 + '月' + days.getDate() + '日',
            orderDate: days.getFullYear() + '-' + month + '-' + day
          };
          this.weeks.push(item);
        }
        this.today = this.weeks[0].name;
        this.getList();
      },
      numberToWeek(val) {
        switch (parseInt(val)) {
          case 1:
            return '星期一';
            break;
          case 2:
            return '星期二';
            break;
          case 3:
            return '星期三';
            break;
          case 4:
            return '星期四';
            break;
          case 5:
            return '星期五';
            break;
          case 6:
            return '星期六';
            break;
          case 0:
            return '星期天';
            break;
        }
      },
      confirmAppoint() {
        let that = this;
        that.openAlert = false;
        let param = {
          token: localStorage.token,
          stdId: that.dialog.StdId
        };
        let postdata = qs.stringify(param);
        OderAddByVipUser(postdata).then(res => {
          let json = res;
          if (json.Code == 0) {
            that.alertInfo('已成功预约', 'success');
            that.getList();
          } else {
            that.alertInfo(json.Memo + ' 错误码：' + json.Code);
          }
        })
      },
      closeAlertDialog() {
        this.openAlert = false;
      },
      appointNow(row) {
        this.dialog = row;
        this.openAlert = true;
      },
      isFulled() {
        let that = this;
        that.$alert('当前课程满员，请选择其他课程或其他时间预约', '提示', {
          okLabel: '知道了'
        }).then(() => {
          that.getList();
        });
      },
      isAppointed(row) {
        let that = this;
        this.$confirm('是否取消前课程预约？', '提示', {
          type: 'warning'
        }).then(({ result }) => {
          if (result) {
            let param = {
              token: localStorage.token,
              orderId: row.OrderId,
            };
            let postdata = qs.stringify(param);
            OderCancelByVipUser(postdata).then(res => {
              let json = res;
              if (json.Code == 0) {
                that.alertInfo('当前课程已取消预约', 'success');
                that.getList();
              } else {
                that.alertInfo(json.Memo + ' 错误码：' + json.Code);
              }
            })
          } else {
            this.alertInfo('点击了取消');
          }
        });
      },
      isDisable(row) {
        this.alertInfo('课程不可预约，请选择其他课程或其他时间预约', 'info');
      },
      getList() {
        let that = this;
        this.today = this.weeks[this.active].name;
        let curDay = this.weeks[this.active].orderDate;
        let param = {
          token: localStorage.token,
          orderDate: curDay,
          shopId: this.$route.query.shopId,
        };
        let postdata = qs.stringify(param);
        that.list = [];
        that.num = 0;
        CanOrderSchoolTimeTableListQuery(postdata).then(res => {
          let json = res;
          if (json.Code == 0) {
            that.list = json.Rs;
            if (that.list) {
              // 计算剩余
              that.num = 0;
              that.list.map(function (item) {
                item.remain = parseInt(item.OrderToplimit) - parseInt(item.OrderCount);
                that.num = that.num + item.remain
                console.log(that.num);
              })
            }
          } else {
            that.alertInfo(json.Memo + ' 错误码：' + json.Code);
          }
        })
      },
    },
    components: {
      bottomTab, alert
    }
  }
</script>

<style scoped>
  .pages {
    overflow: hidden;
    display: block;
    margin: 0 auto;
  }

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

  /deep/ .mu-tabs {
    /*display: flex;*/
    /*width: 414px;*/
    overflow-x: scroll;
    overflow-y: hidden;
    /*display:inline;*/
    /*float: left;*/
  }

  /deep/ .mu-tab {
    width: 85px;
    min-width: 85px;
    float: left;
    height: 51px;
    margin-right: 6px;
  }

  /*/deep/ .mu-tab:nth-child(5) {*/
  /*    margin-right: 0px;*/
  /*}*/

  /deep/ .mu-tab-wrapper {
    height: 51px;
    background: #f4f4f4;
    color: #363636;
    box-shadow: 1px 0px 6px rgba(0, 0, 0, 0.16);
    border-radius: 8px 8px 0px 0px;
    font-size: 14px;
  }

  /deep/ .mu-tab-active .mu-tab-wrapper {
    height: 56px;
    border-radius: 8px 8px 0px 0px;
    background: #ffffff;
    box-shadow: 1px 0px 6px rgba(0, 0, 0, 0.16);
    color: #000;
  }

  /deep/ .mu-tab-wrapper em {
    font-size: 12px;
  }

  .sum {
    width: 100%;
    height: 55px;
    line-height: 55px;
    background: #fff;
    font-family: "PingFang SC";
    font-weight: 300;
    font-size: 16px;
    text-align: center;
    color: #909090;
    overflow: hidden;
    display: block;
    margin: 0 auto;
  }

  .green {
    color: #37CB00;
  }

  .red {
    color: #F8847F;
  }

  .list {
    width: 100%;
    overflow: hidden;
    display: block;
    margin: 0 auto;
    margin-top: 8px;
    padding-bottom: 30px;
  }

  .list li {
    width: 100%;
    height: 70px;
    margin-bottom: 8px;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .list .dotContainer {
    width: 50px;
    float: left;
    height: 60px;
    padding-left: 22px;
    padding-top: 10px;
  }

  .dotContainer .dot {
    width: 12px;
    height: 12px;
    background: #37cb00;
    border-radius: 250px;
    float: left;
  }

  .cubes {
    width: 12px;
    height: 12px;
    background: #f8847f;
    float: left;
  }

  .tri {
    width: 12px;
    height: 12px;
    background: url("../static/images/appoint/tri.png") top center no-repeat;
    background-size: 100% 100%;
    float: left;
  }

  .x {
    width: 12px;
    height: 12px;
    background: url("../static/images/appoint/x.png") top center no-repeat;
    background-size: 100% 100%;
    float: left;
  }


  .yellowLi {
    background: #FFFBED;
  }

  .redLi {
    background: #FFF7F7;
  }

  .greenLi {
    background: #F7FFF4;
  }

  .whiteLi {
    background: #fff;
  }

  .list li .title {
    /*width: 90px;*/
    width: 27%;
    height: 60px;
    float: left;
  }

  li .title h5 {
    width: 100%;
    overflow: hidden;
    display: block;
    margin: 0 auto;
    font-weight: normal;
    font-size: 14px;
    text-align: left;
    color: #3b3b3b;
  }

  li .title span {
    width: 100%;
    overflow: hidden;
    display: block;
    margin: 0 auto;
    font-weight: normal;
    font-size: 12px;
    text-align: left;
    color: #909090;
  }

  .list li .current {
    width: 120px;
    height: 60px;
    float: left;
  }

  li .current h5 {
    width: 100%;
    overflow: hidden;
    display: block;
    margin: 0 auto;
    font-family: "PingFang SC";
    font-weight: normal;
    font-size: 14px;
    text-align: left;
    color: #3b3b3b;
  }

  .current h5 em {
    font-family: "PingFang SC";
    font-weight: normal;
    font-size: 14px;
    text-align: left;
  }

  .current span {
    font-family: "PingFang SC";
    font-weight: normal;
    font-size: 12px;
    text-align: left;
    color: #909090;
  }

  .appointBtn {
    width: 79px;
    height: 37px;
    border-radius: 18.5px;
    background: #fff;
    float: right;
    font-family: "PingFang SC";
    font-weight: normal;
    font-size: 18px;
    margin-right: 2%;
  }

  .greenBtn {
    border: 1px solid #37cb00;
    color: #37cb00;
  }

  .redBtn {
    border: 1px solid #F8847F;
    color: #F8847F;
  }

  .yellowBtn {
    border: 1px solid #FFB43C;
    color: #fff;
    background: #FFB43C;
  }

  .disableBtn {
    border: 1px solid #C9C9C9;
    color: #C9C9C9;
  }

  /deep/ .mu-tabs-center {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
  }

  /deep/ .mu-tabs-center::-webkit-scrollbar {
    display: none;
  }

  /deep/ .mu-modal-inner {
    width: 90%;
    float: left;
  }

  /deep/ .mu-tab-link-highlight {
    display: none !important;
  }

  li .title span.lessons {
    width: auto;
    padding: 1px 11px;
    border-radius: 250px;
    float: left;
    text-align: center;
    color: #000;
    font-size: 14px;
  }

  /deep/ .mu-avatar {
    position: fixed;
    bottom: 9%;
    float: left;
    left: 1%;
  }

  .context {
    position: absolute;
    left: 0;
    right: 0;
    top: 30%;
    bottom: 0;
    overflow-y: scroll;
    padding-bottom: 50px;
  }

  .as {
    position: fixed;
    width: 100%;
    overflow: hidden;
    display: block;
    margin: 0 auto;
    z-index: 222;
    background: #F2F2F2;
  }

  /deep/ .mu-raised-button {
    box-shadow: none;
  }

  .tabs {
    width: 100%;
    justify-content: space-between;
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: scroll;
    display: flex;
    border-bottom: 1px solid #ccc;
  }

  .tab {
    font-size: 14px;
    min-width: 72px;
    max-width: 264px;
    background: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    text-decoration: none;
    border: none;
    outline: none;
    color: inherit;
    position: relative;
    line-height: normal;
    -webkit-transition: all .45s cubic-bezier(.445, .05, .55, .95);
    transition: all .45s cubic-bezier(.445, .05, .55, .95);
    width: 85px;
    float: left;
    height: 51px;
    margin-right: 6px;
    cursor: pointer;
    line-height: 20px;
    padding-top: 4px;
    text-align: center;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border: 1px solid #ccc;
    border-bottom: 0;
  }

  .tab.activeTab {
    color: #fff;
    background-color: #2196f3;
    color: hsla(0, 0%, 100%, .7);
  }

  /*响应式调整*/
  @media only screen and (max-width: 320px) {
    .list .dotContainer {
      width: 20px;
      padding-left: 5px;
    }

    .list li .title {
      width: 30%;
    }

    .list li .current {
      width: 29%;
    }

    .context {
      top: 227px;
    }
  }

  @media (min-width: 321px) and (max-width: 344px) {
    .list li .current {
      width: 28%;
    }

    .context {
      top: 227px;
    }
  }

  @media (min-width: 345px) and (max-width: 360px) {
    .list li .current {
      width: 30%;
    }

    .context {
      top: 230px;
    }
  }

  @media (min-width: 361px) and (max-width: 375px) {
    .list li .current {
      width: 30%;
    }

    .context {
      top: 230px;
    }
  }

  @media (min-width: 376px) and (max-width: 396px) {
    .list li .current {
      width: 30%;
    }

    .context {
      top: 230px;
    }
  }

  @media (min-width: 397px) and (max-width: 414px) {
    .list li .current {
      width: 30%;
    }

    .context {
      top: 230px;
    }
  }

  @media (min-width: 415px) and (max-width: 480px) {
    .list li .current {
      width: 30%;
    }

    .context {
      top: 230px;
    }
  }

  @media (min-width: 481px) and (max-width: 640px) {
    .context {
      top: 230px;
    }
  }
</style>