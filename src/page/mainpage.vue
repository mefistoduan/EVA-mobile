<template>
  <div id="mainPage">
    <img src="../static/images/main/banner.png" width="100%"/>
    <span class="shopNum">
            俱乐部场馆共 {{ list.length }} 处
        </span>
    <ul class="list">
      <li v-for="l in list" @click="goAppoint(l)" v-if="parseInt(l.Status) == 1">
        <div class="lt">
          <img src="../static/images/main/shop2.jpg" width="100%" height="100%"
               v-show="parseInt(l.ShopID) == 3"/>
          <img src="../static/images/main/shop.jpg" width="100%" height="100%"
               v-show="parseInt(l.ShopID) == 4"/>
          <img src="../static/images/main/shop3.png" width="100%" height="100%"
               v-show="parseInt(l.ShopID) == 5"/>
          <img src="../static/images/main/shop6.png" width="100%" height="100%"
               v-show="parseInt(l.ShopID) == 6"/>
          <img src="../static/images/main/outdoor.png" width="100%" height="100%"
               v-show="parseInt(l.ShopID) == 7"/>
          <img src="../static/images/main/outdoor.png" width="100%" height="100%"
               v-show="parseInt(l.ShopID) == 8"/>
        </div>
        <div class="rt">
          <h4 style="background-color: #FFA310" v-if="l.ShopID == 3">{{ l.ShopName.substr(5, 12) }}</h4>
          <h4 style="background-color: #37CB00" v-if="l.ShopID == 4">{{ l.ShopName.substr(5, 12) }}</h4>
          <h4 style="background-color: #028FE1" v-if="l.ShopID == 5">{{ l.ShopName.substr(5, 12) }}</h4>
          <h4 style="background-color: #d624e1" v-if="l.ShopID == 6">{{ l.ShopName }}</h4>
          <h4 style="background-color: #13e15c" v-if="l.ShopID == 7">{{ l.ShopName }}</h4>
          <h4 style="background-color: #4a13e1" v-if="l.ShopID == 8">{{ l.ShopName }}</h4>
          <span>今日预约名额剩余
                        <i v-if="l.RemainOrdernum > 0">{{ l.RemainOrdernum }}</i>
                        <i v-if="l.RemainOrdernum == 0" class="red">{{ l.RemainOrdernum }}</i>
                        人</span>
          <span>地址：{{ l.Addr }}</span>
          <em class="green" v-if="l.WxStatus == 1 && l.IsJoin ==1">点击预约</em>
          <em class="red" v-else>不可预约</em>
        </div>
      </li>
      <div class="tips" v-if="list == ''">
        <p style="text-align: center">
          暂无可预约的门店
        </p>
      </div>
    </ul>
    <bottomTab :curTab="thisTab"></bottomTab>
    <alert ref="alertPart"></alert>
  </div>
</template>

<script>
import {
  ManagerSelfQuery,
  OrderShopQuery,
} from '../api/getApiRes.js'

import bottomTab from '../components/bottomTab'
import alert from '../components/alert'
import axios from 'axios';

let qs = require('qs');
import Global from '../Global.js'

export default {
  data() {
    return {
      thisTab: '预约课程',
      shopNum: 0,
      recordNum: 0,
      Dannum: 0,
      GetHotelCounts: 0,
      GetDetectorNum: 0,
      currShopId: 0,
      list: [],
    }
  },
  mounted() {
    this.getManagerSelfQuery();
  },
  destroyed() {
  },
  watch: {
    $route(to) {
      if (to.name == 'main') {
        this.getList();
      }
    },
    'active'() {
      this.getList();
    }
  },
  methods: {
    alertInfo(info) {
      this.$refs.alertPart.openSimpleDialog(info);
    },
    getManagerSelfQuery() {
      let that = this;
      let param = {
        token: localStorage.token,
      };
      let postdata = qs.stringify(param);
      ManagerSelfQuery(postdata).then(res => {
        let json = res;
        if (json.Code == 0) {
          this.currShopId = json.Rs.ShopId;
          this.getList();
        } else {
          that.alertInfo(json.Memo);
          if (json.Code == 1010) {
            localStorage.clear();
            console.log(1010);
            that.$router.push({path: '/login'});
          }
        }
      })
    },
    getList() {
      let that = this;
      let param = {
        token: localStorage.token,
      };
      let postdata = qs.stringify(param);
      OrderShopQuery(postdata).then(res => {
        let json = res;
        if (json.Code == 0) {
          that.list = json.Rs;
          if (that.list) {
            that.shopNum = json.Rs.length;
          }
        } else {
          that.alertInfo(json.Memo);
          // 权限失效后，删掉本地token
          if (json.Code == 1004) {
            localStorage.clear();
            console.log(1010);
            this.$router.push({path: '/login'});
          }
        }
      })
    },
    onGoNewPage(path) {
      this.$router.push({path: '/' + path});
    },
    goPage(pages) {
      this.$router.push({path: pages});
    },
    goAppoint(row) {
      let that = this;
      if (row.IsJoin == 0) {
        that.alertInfo('您不是该店会员，不可预约');
        return false
      }
      if (row.Status == 2) {
        that.alertInfo(row.name + '不可预约');
        return false
      } else {
        this.$router.push({
          path: '/appoint', query: {
            shopId: row.ShopID
          }
        });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      if (to.name == '') {
        vm.getList();
      }
    });
  },
  components: {
    bottomTab, alert
  }
}
</script>

<style lang="scss" scoped>
#mainPage {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: block;
  margin: 0 auto;
  background: #f2f2f2;
  overflow-y: scroll;

  .banner {
    width: 100%;
    overflow: hidden;
    display: block;
    margin: 0 auto;
  }
}

.goPage {
  overflow: hidden;
  display: block;
  margin: 0 auto;
  background: #fff;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  color: #333;
  font-size: 18px;
  border-bottom: 1px solid #f2f2f2;

  span {
    float: left;
  }

  i {
    float: right;
    margin-top: 12px;
  }

  img {
    overflow: hidden;
    display: block;
    width: 8px;
    height: 14px;
    float: right;
    margin-top: 16px;
    margin-right: 10px;
  }
}

.goTitle i {
  margin-top: 10px;
  float: right;
}

.mapContainer {
  width: 100%;
  overflow: hidden;
  display: block;
  margin: 0 auto;
  max-height: 317px;
}

.shopNum {
  width: 100%;
  overflow: hidden;
  display: block;
  margin: 0 auto;
  font-family: "PingFang SC";
  font-weight: 300;
  font-size: 14px;
  color: #909090;
  padding-top: 6px;
  text-align: center;
}

.list {
  width: 98%;
  overflow: hidden;
  display: block;
  margin: 0 auto;
  padding-left: 1%;
  padding-right: 1%;
  margin-top: 10px;
  padding-bottom: 40px;

  li {
    width: 100%;
    background: transparent;
    margin-bottom: 20px;
    border-radius: 13px;
    background: #fff;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    overflow: hidden;
  }

  img {
    height: 100%;
    float: left;
  }

  .lt {
    width: 33%;
    height: 100%;
    overflow: hidden;
    float: left;
  }

  .rt {
    /*width: 65%;*/
    float: left;
    padding-left: 15px;

    h5 {
      font-family: "PingFang SC";
      font-weight: normal;
      font-size: 16px;
      text-align: left;
      color: #3b3b3b;
      margin: 0;
      margin-top: 3px;
      margin-bottom: 0px;
    }

    h4 {
      width: auto;
      font-family: "PingFang SC";
      font-weight: normal;
      font-size: 16px;
      float: left;
      padding-left: 12px;
      padding-right: 12px;
      margin-top: 12px;
      margin-bottom: 12px;
      border-radius: 250px;
      color: #fff;
      text-align: center;
    }

    span {
      width: 100%;
      overflow: hidden;
      display: block;
      margin: 0 auto;
      font-family: "PingFang SC";
      font-weight: normal;
      font-size: 12px;
      text-align: left;
      color: #909090;
    }

    em {
      width: 100%;
      overflow: hidden;
      display: block;
      margin: 0 auto;
      font-family: "PingFang SC";
      font-weight: normal;
      font-size: 16px;
      padding-right: 1px;
      margin-top: 5px;
      float: right;
      text-align: right;
    }

    em.green {
      color: #37cb00;
    }

    em.red {
      color: #F8847F;
    }
  }
}

.red {
  color: #F8847F;
}

/*响应式调整*/
@media only screen and (max-width: 320px) {
  .list .rt {
    width: 50%;
  }

  .list .rt em {
    font-size: 14px;
  }
}

@media (min-width: 321px) and (max-width: 344px) {
  .list .rt {
    width: 50%;
  }

  .list .rt em {
    font-size: 14px;
  }
}

@media (min-width: 345px) and (max-width: 360px) {
  .list .rt {
    width: 57%;
  }
}

@media (min-width: 361px) and (max-width: 375px) {
  .list .rt {
    width: 60%;
    /*background-color: red;*/
  }
}

@media (min-width: 376px) and (max-width: 396px) {
  .list .rt {
    width: 61%;
  }
}

@media (min-width: 397px) and (max-width: 414px) {
  .list .rt {
    width: 61%;
  }
}

@media (min-width: 415px) and (max-width: 480px) {
  .list .rt {
    width: 61%;
  }
}

@media (min-width: 481px) and (max-width: 640px) {
}
</style>