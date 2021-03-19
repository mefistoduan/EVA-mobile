<template>
  <div class="container">
    <p class="content">系统升级中
      <br>
      敬请期待</p>
  </div>
</template>

<script>
import axios from 'axios';

let qs = require('qs');
import Global from '../Global.js'

export default {
  data() {
    return {
      lists: []
    }
  },
  mounted() {
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
@mixin cube {
  width: 100%;
  overflow: hidden;
  display: block;
  margin: 0 auto;
}

.container {
  @include cube;
  height: 100%;
  background: cornflowerblue;
  background-image: url("../static/images/404/man.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100%;
  text-align: center;
  color: #fff;
  padding-top: 50px;
  font-size: 36px;
}

.content {
  @include cube;
  margin-top: 27%;
}
</style>
