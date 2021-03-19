<template>
  <div id="skin-blur-violate">
    <section id="login">
      <header>
        <img src="../static/images/login/logo.png" height="59" width="59" id="logo" />
        <img src="../static/images/login/title.png" width="274px" />
      </header>
      <div class="clearfix"></div>
      <!-- Login -->
      <form class="box tile animated active" id="box-login">
        <h2 class="m-t-0 m-b-15"></h2>
        <div class="rowHeight">
          <input type="text" class="login-control login_account" placeholder="输入手机号" v-model="login.phone">
        </div>
        <div class="rowHeight">
          <input type="number" class="login-control login_valid" placeholder="输入右侧图形码" v-model="login.uservalid">
          <img id="imgValidcode" :src="valImgSrc" :title="InvisibilityGiveitatry" @click="getValImgSrc">
        </div>
        <div class="rowHeight">
          <input type="number" class="login-control login_pwd" placeholder="输入验证码" v-model="login.userpwd"
            @keyup.enter="pwdLoginBtn">
          <mu-button id="getValidSms" :disabled="getValidSmsState" color="success" @click="getValidSmsBtn">
            {{ btnText }}
          </mu-button>
        </div>
        <div class="btn_center">
          <span class="btn btn-md login_btn" @click="pwdLoginBtn">登 录</span>
        </div>
      </form>
    </section>
    <mu-snackbar :position="normal.position" :open.sync="normal.open" :color="normal.color">
      {{ normal.message }}
      <mu-button flat slot="action" color="secondary" @click="normal.open = false">{{ "close" }}</mu-button>
    </mu-snackbar>
  </div>
</template>

<script>
  import {
    SignIn,
    GenVerifyPic,
    GetPhoneVFCode,
    PhoneSignIn,
    WXBind,
    testSelect
  } from '../api/getApiRes.js'

  let qs = require('qs');

  export default {
    data() {
      let samepass = (rule, value, callback) => {
        if (value !== this.form.newpwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let pwdPass = (rule, value, callback) => {
        let re = /^[0-9a-zA-Z_]{1,}$/;
        if (value.search(re) == -1) {
          callback(new Error('错了哦，密码只能由字母、数字及下划线组成'));
        } else {
          callback()
        }
      };
      let phonetest = (rule, value, callback) => {
        let re = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
        if (value.search(re) == -1) {
          callback(new Error('错了哦，手机号码格式不正确'));
        } else {
          callback()
        }
      };
      return {
        Password: "Password",
        VerificationCode: "Verification Code",
        InvisibilityGiveitatry: "无效?再点一下试试吧!",
        valImgSrc: '',//
        picId: '',//
        getValidSmsState: false,//
        overtime: '',
        btnText: '获取验证码',
        normal: normal,
        login: {
          phone: '15253135600',
          userpwd: '152531',
          uservalid: '1234',
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { min: 11, max: 12, message: '手机号长度是11位', trigger: 'blur' },
            { validator: phonetest, trigger: 'blur' }
          ],
          re_phonevalid: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { min: 4, max: 4, message: '长度在 4 个字符', trigger: 'blur' },
          ],
          newpwd: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' },
            { validator: pwdPass, trigger: 'blur' }
          ],
          again: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' },
            { validator: pwdPass, trigger: 'blur' },
            { validator: samepass, trigger: 'blur' },
          ],
        }
      }
    },
    mounted() {
      // 入口状态有 3 种
      // 1.全新登入，拿weixinId 拿验证码 ，绑定 ，登陆
      // 2.token 未失效用户，直接进入内页，继续凭token使用
      // 3.token 已失效用户，删掉本地token ，重新按照1的模式登陆
      if (localStorage.token) {
        // 凭借旧token直接登陆
        this.$router.push({ path: '/' });
      } else {
        // 获取图形验证码
        this.getValImgSrc();
        this.overtime = new Date();
        let from = this.$route.query.from;//获取来源
        let userAgent = navigator.userAgent;
        let host = window.location.host;
        // if (from == 'app' || host == '192.168.0.162:8184') {//判断是否微信浏览器
        //   // 浏览器测试
        //   console.log('from app & brower');
        // } else {
        //   console.log('form wx');
        //   this.checkcode();
        // }
      }
    },
    methods: {
      // 获取CODE
      checkcode() {
        // 0213tIFa1fBjAz0OVDIa1LfXwc03tIFK
        if (this.getUrlKey('state') == 123) {
          // 取到值了
          localStorage.code = this.getUrlKey('code');
          // console.log('code:' + localStorage.code);
        } else {
          // 第一次加载
          this.GetOpenId();
        }
      },
      // 获取公众号ID
      GetOpenId() {
        let origin = location.href;
        // let origin = 'http://wx.xfeilong.com';
        let urlNow = encodeURIComponent(origin);
        let scope = 'snsapi_userinfo';    //snsapi_userinfo   //静默授权 用户无感知
        let appid = '000000';//正式
        let state = '123';
        let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + urlNow + '&response_type=code&scope=' + scope + '&state=' + state + '#wechat_redirect';
        self.location = url;
      },
      getUrlKey(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
      },
      // 获取验证码
      getValidSmsBtn() {
        let that = this;
        let phone = that.login.phone;
        let uservalid = that.login.uservalid;
        if (!phone) {
          that.Toast('手机号不能为空');
          return false
        }
        if (phone.length != 11) {
          that.Toast('手机号只能是11位');
          return false
        }
        if (!globalCheckPhone(phone)) {
          that.Toast('手机号格式不正确');
          return false
        }
        if (!uservalid) {
          that.Toast('图形验证码不能为空');
          return false
        }
        if (uservalid.length != 4) {
          that.Toast('图形验证码只能是4位');
          return false
        }
        let param = {
          token: localStorage.token,
          phone: phone,
          codeType: 1,
          picId: this.valImgId,
          picCode: uservalid,
        };
        let postdata = qs.stringify(param);
        GetPhoneVFCode(postdata).then(res => {
          let json = res;
          if (json.Code == 0) {
            that.Toast('短信验证码已发送', 'success');
            that.calcTime();
          } else {
            that.Toast(json.Memo);
          }
        })
      },
      calcTime() {
        // 短信倒数计时
        let countdown = 60;
        let that = this;
        //设置button效果，开始计时
        that.getValidSmsState = true;
        that.btnText = countdown + "S"
        //启动计时器，1秒执行一次
        let timer = setInterval(function () {
          if (countdown == 0) {
            clearInterval(timer);//停止计时器
            that.getValidSmsState = false;
            that.btnText = "重新发送"
          } else {
            countdown--;
            that.btnText = countdown + "S"
          }
        }, 1000);
      },
      clearLogin() {
        this.login.username = '';
        this.login.userpwd = '';
        this.login.uservalid = '';
        this.getValImgSrc();
      },
      // 点击验证码切换
      getValImgSrc() {
        let that = this;
        let param = {
          token: localStorage.token,
          width: 100,
          height: 30,
          noiseCount: 1,
          length: 4,
          source: 123456789,
        };
        let postdata = qs.stringify(param);
        GenVerifyPic(postdata).then(res => {
          let json = res;
          that.valImgSrc = json.Pic;
          that.valImgId = json.Id;
          that.Toast('图形验证码已更新','success');
        })
      },
      // pwd登录
      pwdLoginBtn() {
        let that = this;
        let phone = this.login.phone;
        let userpwd = this.login.userpwd;
        // 重置验证码超时
        that.overtime = new Date();
        if (!that.globalValid(phone, 10, 12, '手机号', that)) return;
        if (!that.globalValid(userpwd, 5, 7, '短信验证码', that)) return;
        this.loginInfo();
      },
      // 校验内容长度
      globalValid(data, mins, maxs, text, that) {
        let thisVal = data;
        let thisLeng = thisVal.length;
        let min = parseInt(mins);
        let max = parseInt(maxs);
        let dispalyMin = min + 1;
        if (thisVal == '') {
          this.Toast(text + ' ' + '不能为空');
          return false
        } else if (thisLeng <= min) {
          this.Toast(text + '最少' + dispalyMin + '字符');
          return false
        } else if (thisLeng > max) {
          this.Toast(text + '超过限制长度');
          return false
        } else {
          return true
        }
      },
      // pwd登陆
      loginInfo: function () {
        const that = this;
        let current = new Date();
        let betweenTime = current - that.overtime;
        let s = 120;
        if (betweenTime > s * 1000) {
          that.changeValImg();
          that.$toast.message('验证码已超时，请重新输入');
          return false
        }
        let param = {
          phone: that.login.phone,
          code: that.login.userpwd,
          channel: 3
        };
        let postdata = qs.stringify(param);
        PhoneSignIn(postdata).then(res => {
          if (res.Code == 0) {
            that.res = res.Rs;
            // 使用token做免校验登陆
            localStorage.token = res.Rs.token;
            // 如果是wx登陆就执行绑定操作
            let from = this.$route.query.from;//获取来源
            if (from != 'app') {
              that.bindWx();
            }

            // 607862e8828013be90c2ccb78468b43a
            // test
            that.$router.push({ path: '/' });
          } else {
            this.getValImgSrc();
            if (res.Code == 10005) {
              that.$refs.userpwd.value = '';
              that.Toast('密码错误，请重新输入');
            } else {
              that.Toast(res.Memo + ',错误代码：' + res.Code);
              that.form.valid = '';
            }
          }
        })
      },
      bindWx() {
        let that = this;
        let param = {
          token: localStorage.token,
          code: localStorage.code,
        };
        let postdata = qs.stringify(param);
        WXBind(postdata).then(res => {
          let json = res;
          if (json.Code == 0) {
            // that.$router.push({path: '/'});
          } else {
            // that.Toast(res.Memo + ',错误代码：' + res.Code);
          }
        })
      },
      getUserInfo(token) {
        let that = this;
        let param = {
          token: token,
        };
        let postdata = qs.stringify(param);
        testSelect(postdata).then(res => {
          let json = res;
          if (json.Code == 0) {
            var userLevel = json.Rs.Rolesname;
            localStorage.userLevel = userLevel;
            localStorage.comId = json.Rs.Comid;
            localStorage.Insname = json.Rs.Insname;
            that.$router.push({ path: '/' });
          } else {
            that.$toast.message(json.Memo);
          }
        })
      }
    },
    components: {}
  }
</script>

<style lang="scss" scoped>
@mixin cube {
  width: 100%;
  overflow: hidden;
  display: block;
  margin: 0 auto;
}

  #skin-blur-violate {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    @include cube;
    height: 100%;
    background: #3B3B3B;
    background: url("../static/images/login/bg.png") top center no-repeat;
    background-size: 100% 100%;
  }

  #login {
    width: 90%;
    overflow: hidden;
    display: block;
    margin: 0 auto;
    overflow-y: scroll;
    .box {
      margin: 0 auto;
      position: inherit;
      margin-top: 0px;
      border-radius: 9px;
      padding: 0px 20px;
    }
    h1 {
      color: #FFA200;
      font-size: 30px;
    }
    header {
      text-align: center;
      margin-top: 5%;
      p {
        font-size: 14px;
        color: #7B7B7B;
      }
    }
    .login_valid {
      width: 65%;
      float: left;
    }
    .login-control {
      width: 100%;
      height: 50px;
      line-height: 50px;
      background: rgba(255, 255, 255, 0.4);
      margin-bottom: 3px;
      text-indent: 10px;
      border: none;
    }
  }

  #box-login h2 {
    width: 100%;
    overflow: hidden;
    display: block;
    margin: 0 auto;
    margin-bottom: 2px;
    text-align: center;
    font-size: 24px;
    color: #fff;
  }

  #tableBordered {
    margin: 0;
    padding: 0;
  }

  #tableBordered h5 {
    margin: 0;
    text-align: center;
    padding: 0;
  }

  #login .box {
    margin: 0 auto;
    position: inherit;
    margin-top: 4px;
    border-radius: 9px !important;
  }

  #login header {
    text-align: center;
    margin-top: 5%;
  }

  #tableBordered {
    margin: 0;
    padding: 0;
  }

  #tableBordered h5 {
    margin: 0;
    text-align: center;
    padding: 0;
  }

  #imgValidcode {
    position: relative;
    float: right;
    /*bottom: 54px;*/
    /*width: 100px;*/
    width: 30%;
    height: 50px;
    background: #eee;
  }

  .login_btn {
    width: 100%;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    display: block;
    margin: 0 auto;
    margin-top: 12px;
    background: #E75296;
    color: #fff;
    font-size: 14px;
    text-align: center;
    border: none;
    padding: 0;
    font-size: 24px;
    margin-bottom: 3%;
  }

  .clear_btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    display: block;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.32);
    color: #FFCC00;
    font-size: 14px;
    text-align: center;
    border: none;
    padding: 0;
  }



  #login .login-control::placeholder {
    color: #000000;
    font-size: 16px;
  }

  #logo {
    overflow: hidden;
    display: block;
    margin: 0 auto;
    margin-top: 10%;
    margin-bottom: 10px;
  }

  .rowHeight {
    width: 100%;
    overflow: hidden;
    display: block;
    margin: 0 auto;
    height: 50px;
    margin-bottom: 3px;
  }

  #getValidSms {
    width: 30%;
    height: 50px;
    background: #fff;
    border: 1px solid #fff;
    opacity: 0.6;
    position: relative;
    float: right;
    text-align: center;
    color: #E75296;
    line-height: 20px;
    font-size: 12px;
    min-width: 30px;
  }


  #login .login_pwd {
    width: 173px;
    float: left;
  }

  @media only screen and (max-width: 640px) {}

  @media only screen and (max-width: 480px) {
    #login .login_valid {
      /*width: 195px;*/
      width: 65%;
    }

    #login .login_pwd {
      /*width: 195px;*/
      width: 65%;
    }
  }

  @media only screen and (max-width: 414px) {
    #login .login_valid {
      width: 65%;
      /*width: 223px;*/
    }

    #login .login_pwd {
      /*width: 223px;*/
      width: 65%;
    }
  }

  @media only screen and (max-width: 400px) {

    #login .login_valid {
      width: 65%;
      /*width: 218px;*/
    }

    #login .login_pwd {
      /*width: 218px;*/
      width: 65%;
    }

    #getValidSms {
      font-size: 13px;
    }
  }

  @media only screen and (max-width: 375px) {
    #login .login_valid {
      /*width: 190px;*/
      width: 65%;
    }

    #login .login_pwd {
      /*width: 190px;*/
      width: 65%;
    }

    #getValidSms {
      font-size: 14px;
    }
  }

  @media only screen and (max-width: 360px) {
    #login .login_valid {
      /*width: 160px;*/
      width: 65%;
    }

    #login .login_pwd {
      /*width: 160px;*/
      width: 65%;
    }

    #getValidSms {
      font-size: 14px;
    }
  }

  @media only screen and (max-width: 320px) {
    #login .login_valid {
      /*width: 144px;*/
      width: 65%;
    }

    #login .login_pwd {
      width: 65%;
      /*width: 144px;*/
    }

    #getValidSms {
      font-size: 12px;
    }
  }
</style>