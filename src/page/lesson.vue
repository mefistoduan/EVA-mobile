<template>
  <div class="pages">
    <img src="../static/images/main/banner.png" width="100%"/>
    <h5 class="lessonName">
      {{ lessonName }}
    </h5>
    <!--<mu-tabs :value.sync="active" color="#F2F2F2" indicator-color="#33CAF7" v-if="reFresh">-->
    <!--<mu-tab v-for="(day,i) in weeks">{{ day.name }} <br> <em>{{ day.data }}</em></mu-tab>-->
    <!--</mu-tabs>-->
    <div class="tabs">
      <div :class="[{'tab':true},{'activeTab':i == active}]" v-for="(day,i) in weeks" @click="changeActive(i)">
        {{ day.name }} <br> <em>{{ day.data }}</em>
      </div>
    </div>
    <bottomTab :curTab="thisTab"></bottomTab>
    <div class="context">
      <ul class="list">
        <li v-for="(l,index) in previewDate"
            :style="{background:l.ClassColor}"
        >
          <em>
            {{ l.BeginStr }} - {{ l.EndStr }}
          </em>
          <span>
                         {{ l.ClassName }}
                    </span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import bottomTab from '../components/bottomTab'
import {
  SchoolTimeQueryByDate,
  QueryNextWeek,
} from '../api/getApiRes.js'

let qs = require('qs');
import Global from '../Global.js'

export default {
  data() {
    return {
      lessonName: '本周课程表',
      num: 0,
      thisTab: '预约课程',
      active: 0,
      sum: 0,
      openAlert: false,
      reFresh: true,
      list: [],
      previewDate: [],
      weeks: [],
      dialog: {
        id: '',
        name: '',
        timeLong: '',
      },
    }
  },
  mounted() {
    this.getQueryNextWeek();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      if (to.name == 'appoint') {
        this.getQueryNextWeek();
      }
    });
  },
  watch: {
    '$route'(to) {
      if (to.name == 'lesson') {
        this.getQueryNextWeek();
      }
    },
    'active'() {
      this.getList();
    }
  },
  methods: {
    changeActive(i) {
      this.active = i;
    },
    getQueryNextWeek() {
      console.log(333);
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
          this.getFurtherDays(json.Rs);
        } else {
          that.list = [];
          that.$message.error(json.Memo);
        }
      })
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
    getList() {
      let that = this;
      let param = {
        token: localStorage.token,
        shopId: this.$route.query.shopId,
        queryDate: that.weeks[that.active].orderDate,//(字符串 年-月-日  格式)
      };
      let postdata = qs.stringify(param);
      that.previewDate = [];
      SchoolTimeQueryByDate(postdata).then(res => {
        let json = res;
        if (json.Code == 0) {
          // that.BigTitle = row.Name;
          // that.smallTitle = row.BeginDate + '至' + row.EndDate;
          that.previewDate = json.Rs;
          // 前台排序
          that.previewDate.sort((a, b) => a.ClassIndex - b.ClassIndex);//升序
          that.previewShow = true;
        } else {
          that.$message.error(json.Memo);
        }
      })
    },
  },
  components: {
    bottomTab
  }
}
</script>


<style scoped>
.pages {
  overflow: hidden;
  display: block;
  margin: 0 auto;
}

.lessonName {
  width: 100%;
  height: 40px;
  overflow: hidden;
  display: block;
  margin: 0 auto;
  text-align: center;
  font-size: 18px;
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
  display: flex;
  overflow-x: scroll;
  float: left;
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
  background: #fff;
  color: #363636;
  box-shadow: 1px 0px 6px rgba(0, 0, 0, 0.16);
  border-radius: 8px 8px 0px 0px;
  font-size: 14px;
}

/deep/ .mu-tab-active .mu-tab-wrapper {
  height: 56px;
  border-radius: 8px 8px 0px 0px;
  background: #33caf7;
  box-shadow: 1px 0px 6px rgba(0, 0, 0, 0.16);
  color: #fff;
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
  border-top: 5px solid #fff;
}

.list li {
  width: 100%;
  height: 50px;
  margin: 0;
  border-bottom: 1px solid #fff;
  list-style: none;
  line-height: 50px;
  /*padding-top: 16px;*/
  /*padding-bottom: 16px;*/
}

li em {
  width: 50%;
  float: left;
  padding-left: 10%;
  /*height: 40px;*/
  /*line-height: 40px;*/
  overflow: hidden;
  border-right: 1px solid #fff;
  color: #333;
  /*font-size: 16px;*/
}

li span {
  width: 45%;
  float: right;
  padding-left: 3px;
  /*height: 40px;*/
  /*line-height: 40px;*/
  overflow: hidden;
  text-align: center;
  color: #333;
  /*font-size: 16px;*/
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
  width: 90px;
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
  bottom: 10%;
  float: right;
  right: 10%;
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

@media only screen and (max-width: 640px) {

}

@media only screen and (max-width: 480px) {

}

@media only screen and (max-width: 375px) {

}

@media only screen and (max-width: 360px) {

}

@media only screen and (max-width: 320px) {
  .list .dotContainer {
    width: 20px;
    padding-left: 5px;
  }

  .list li .title {
    width: 85px;
  }
}

@media only screen and (min-width: 641px) {

}
</style>
