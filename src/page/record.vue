<template>
  <div class="pages">
    <img src="../static/images/main/banner.png" width="100%"/>
    <div class="context">
      <span class="num"> 记录共 {{ num }} 条 </span>
      <mu-tabs
          :value.sync="active"
          color="#F2F2F2"
          indicator-color="#ffffff"
          center
      >
        <mu-tab>已预约</mu-tab>
        <mu-tab>预约记录</mu-tab>
        <mu-tab>消费记录</mu-tab>
      </mu-tabs>
      <!--      <div class="whiteCube"></div>-->
      <ul class="list">
        <mu-load-more
            @refresh="refresh"
            :refreshing="refreshing"
            :loading="loading"
            @load="load"
        >
          <li v-for="l in list">
            <div class="lt" v-if="active != 2">
              <h5>{{ l.CurrentDate }}</h5>
              <em>{{ l.CurrentDate | filterWeek }}</em>
              <span>{{ l.BeginStr }}-{{ l.EndStr }}</span>
            </div>
            <div class="lt" v-if="active == 2">
              <h5>{{ l.CreatedAt | filterTime }}</h5>
              <span>剩余课时 {{ l.AfterNormalhour + l.AfterGifthour }}</span>
            </div>
            <div class="md">
              <em>
								<span class="lessons" :style="{ background: l.ClassColor }">
									{{ l.ClassName }}
								</span>
              </em>
            </div>
            <div class="rt">
              <mu-button
                  color="error"
                  flat
                  v-if="l.Status == 0"
                  @click="cancleAppoint(l)"
              >取消预约
              </mu-button
              >
              <span v-if="l.Status == 1" class="isFinish">
								<!--                            已预约-->
								<mu-button color="error" flat @click="cancleAppoint(l)"
                >取消预约</mu-button
                >
							</span>
              <span class="red" v-if="l.Status == 2">
								已取消
							</span>
              <span class="red" v-if="l.Status == 3">
								预约未到
							</span>
              <span class="green" v-if="l.Status == 4">
								已完成
							</span>
              <em v-if="active == 2">
                - {{ l.NormalHour + l.GiftHour }}课时
              </em>
            </div>
          </li>
        </mu-load-more>
        <div class="tips">
          <p v-if="active == 0 && list == null">
            暂无已预约
          </p>
          <p v-if="active == 1 && list == null">
            暂无预约记录
          </p>
          <p v-if="active == 2 && list == ''">
            暂无消费记录
          </p>
        </div>
      </ul>
    </div>
    <bottomTab :curTab="thisTab"></bottomTab>
    <alert ref="alertPart"></alert>
  </div>
</template>

<script>
import axios from "axios";
import bottomTab from "../components/bottomTab";
import {
  OrderListQuery,
  VipUserConsumeListQuery,
  OderCancelByVipUser,
  testSelect,
  testTable,
} from "../api/getApiRes.js";
import alert from "../components/alert";

let qs = require("qs");
import Global from "../Global.js";

export default {
  data() {
    return {
      num: 0,
      thisTab: "预约记录",
      active: 0,
      sum: 0,
      openAlert: false,
      list: [],
      dialog: {
        id: "",
        name: "",
        timeLong: "",
      },
      refreshing: false,
      loading: false,
      start: 1,
      tableMax: 6,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    alertInfo(info) {
      this.$refs.alertPart.openSimpleDialog(info);
    },
    refresh() {
    },
    load() {
      if (this.active != 2) {
        return false;
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.start = this.start + 6;
        this.getVipUserConsumeListQuery();
      }, 2000);
    },
    cancleAppoint(row) {
      let that = this;
      this.$confirm("是否取消" + row.ClassName + "课程预约？", "提示", {
        type: "warning",
      }).then(({result}) => {
        if (result) {
          let param = {
            token: localStorage.token,
            orderId: row.OrderId,
          };
          let postdata = qs.stringify(param);
          OderCancelByVipUser(postdata).then((res) => {
            let json = res;
            if (json.Code == 0) {
              that.alertInfo("当前课程已取消预约", "success");
              that.getList();
            } else {
              that.alertInfo(json.Memo + " 错误码：" + json.Code);
            }
          });
        } else {
          this.alertInfo("点击了取消");
        }
      });
    },
    getOrderListQuery(statusList) {
      let that = this;
      let param = {
        token: localStorage.token,
        statusList: statusList,
        start: 1,
        tableMax: 299,
      };
      let postdata = qs.stringify(param);
      if (parseInt(this.active) == 0 || parseInt(this.active) == 1) {
        OrderListQuery(postdata).then((res) => {
          let json = res;
          if (json.Code == 0) {
            that.list = json.Rs;
            if (that.list) {
              that.num = json.Rs.length;
            } else {
              that.num = 0;
            }
          } else {
            that.alertInfo(json.Memo + " 错误码：" + json.Code);
          }
        });
      }
    },
    getVipUserConsumeListQuery() {
      let that = this;
      let param = {
        token: localStorage.token,
        start: this.start,
        tableMax: this.tableMax,
      };
      let postdata = qs.stringify(param);
      VipUserConsumeListQuery(postdata).then((res) => {
        let json = res;
        if (json.Code == 0) {
          // that.list = json.Rs;
          that.list = that.list.concat(json.Rs);
          if (that.list) {
            that.num = json.Rs.length;
          }
        } else {
          that.alertInfo(json.Memo);
        }
      });
    },
    getList() {
      let statusList = "";
      this.list = [];
      switch (parseInt(this.active)) {
          // 已预约
        case 0:
          statusList = 1;
          this.getOrderListQuery(statusList);
          break;
          // 预约记录
        case 1:
          statusList = "2,3,4";
          this.getOrderListQuery(statusList);
          break;
          // 消费记录
        case 2:
          statusList = 1;
          this.getVipUserConsumeListQuery(statusList);
          break;
      }
    },
    numberToWeek(val) {
      switch (parseInt(val)) {
        case 1:
          return "星期一";
          break;
        case 2:
          return "星期二";
          break;
        case 3:
          return "星期三";
          break;
        case 4:
          return "星期四";
          break;
        case 5:
          return "星期五";
          break;
        case 6:
          return "星期六";
          break;
        case 0:
          return "星期天";
          break;
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      if (to.name == "record") {
        vm.getList();
      }
    });
  },
  filters: {
    filterTime: function (value) {
      if (!value) {
        return 0;
      } else {
        return globalfmtDate(value);
      }
    },
    filterWeek: function (value) {
      if (!value) return false;
      let days = new Date(value).getDay();
      switch (parseInt(days)) {
        case 1:
          return "星期一";
          break;
        case 2:
          return "星期二";
          break;
        case 3:
          return "星期三";
          break;
        case 4:
          return "星期四";
          break;
        case 5:
          return "星期五";
          break;
        case 6:
          return "星期六";
          break;
        case 0:
          return "星期天";
          break;
      }
    },
  },
  watch: {
    $route(to) {
      if (to.name == "record") {
        this.getList();
      }
    },
    active() {
      this.start = 1;
      this.getList();
    },
  },
  components: {
    bottomTab,
    alert,
  },
};
</script>

<style lang="scss" scoped>

@mixin cube {
  width: 100%;
  overflow: hidden;
  display: block;
  margin: 0 auto;
}

.pages {
  overflow: hidden;
  display: block;
  margin: 0 auto;
  background: #f2f2f2;
}

.num {
  @include cube;
  font-family: "PingFang SC";
  font-weight: 300;
  font-size: 14px;
  text-align: center;
  color: #909090;
  padding: 13px 0;
}

/deep/ .mu-appbar-title {
  text-align: center;
}

/deep/ .mu-tab {
  width: 115px;
  height: 35px;
  margin-right: 6px;
}

/deep/ .mu-tab-wrapper {
  height: 35px;
  line-height: 25px;
  background: #f4f4f4;
  color: #363636;
  box-shadow: 1px 0px 6px rgba(0, 0, 0, 0.16);
  border-radius: 8px 8px 0px 0px;
  font-size: 16px;
  padding-top: 5px;

  em {
    font-size: 12px;
  }
}

/deep/ .mu-tab-active .mu-tab-wrapper {
  height: 35px;
  line-height: 25px;
  border-radius: 8px 8px 0px 0px;
  background: #ffffff;
  box-shadow: 1px 0px 6px rgba(0, 0, 0, 0.16);
  color: #000;
}


.list {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  @include cube;
  height: 100%;
  min-height: 410px;
  margin: 0 auto;
  padding-top: 0px;
  padding-bottom: 30px;
  background: #f2f2f2;

  li {
    @include cube;
    background: #fff;
    padding: 20px 3%;
    margin-bottom: 10px;

    .lt {
      width: 100px;
      float: left;
      overflow: visible;

      h5 {
        @include cube;
        font-family: "PingFang SC";
        font-weight: normal;
        font-size: 13px;
        text-align: center;
        color: #4e4e4e;
        margin: 0;
      }

      span {
        @include cube;
        font-family: "PingFang SC";
        font-weight: normal;
        font-size: 12px;
        text-align: center;
        color: #909090;
      }

      em {
        @include cube;
        font-size: 12px;
        text-align: center;
      }
    }

    .md {
      max-width: 200px;
      float: left;
      margin-left: 10%;
      padding-top: 14px;

      em {
        float: left;
        font-family: "PingFang SC";
        font-weight: normal;
        font-size: 18px;
        text-align: left;
        color: #3b3b3b;
        margin-right: 20px;
      }

      span {
        font-family: "PingFang SC";
        font-weight: normal;
        font-size: 14px;
        text-align: left;
        /*color: #37cb00;*/
        line-height: 30px;
      }
    }

    .rt {
      float: right;
      margin-right: 2%;
      overflow: hidden;
      display: block;
      margin: 0 auto;
      padding-top: 9px;

      span {
        float: right;
        line-height: 35px;
        font-family: "PingFang SC";
        font-weight: normal;
        font-size: 14px;
        text-align: left;
        color: #909090;
        overflow: hidden;
        padding-bottom: 6px;
      }

      .red {
        font-family: "PingFang SC";
        font-weight: normal;
        font-size: 14px;
        text-align: left;
        color: #f8847f;
      }

      .cancleBtn {
        width: 55px;
        height: 24px;
        border-radius: 12px;
        background: #ff453c;
        padding: 0;
        overflow: hidden;
        text-align: center;
        color: #fff;
        line-height: 24px;
        margin-top: 6px;
      }

      em {
        font-family: "PingFang SC";
        font-weight: normal;
        font-size: 14px;
        text-align: left;
        color: #909090;
        margin-top: 6px;
      }

    }
  }
}


.whiteCube {
  width: 100%;
  height: 6px;
  overflow: hidden;
  display: block;
  margin: 0 auto;
  background: #fff;
  border-bottom: 1px solid #ccc;
}

span.green {
  color: #37cb00;
}

span.red {
  color: #ff453c;
}

.tips {
  @include cube;
  p {
    @include cube;
    text-align: center;
    font-size: 14px;
    line-height: 35px;
  }
}

.green {
  color: #37cb00;
}

/deep/ .mu-raised-button.mu-button-small {
  width: 54px;
  min-width: 40px;
  float: right;
  padding-left: 3px;
  padding-right: 3px;
}

.lessons {
  width: 100%;
  overflow: hidden;
  padding: 1px 11px;
  border-radius: 250px;
  float: left;
  text-align: center;
  color: #333;
}

/deep/ .mu-button-wrapper {
  border: 1px solid #f8847f;
  color: #f8847f;
  background: #fff7f7;
  border-radius: 5px;
}

@media only screen and (max-width: 640px) {
}

@media only screen and (max-width: 480px) {
}

@media only screen and (max-width: 375px) {
}

@media only screen and (max-width: 360px) {
}

@media only screen and (max-width: 320px) {
  .list .lt {
    width: 80px;
  }

  .list .lt h5 {
    font-size: 12px;
  }

  .md em {
    margin-right: 3px;
  }
}

</style>
