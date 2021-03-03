<template>
  <div>
    <mu-dialog title="通知" width="360" :open.sync="openSimple">
       {{text}}
      <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">关闭</mu-button>
    </mu-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      openSimple: false,
      text:''
    };
  },
  methods: {
    openSimpleDialog(info) {
      this.openSimple = true;
      this.text = info;
    },
    closeSimpleDialog() {
      this.openSimple = false;
    }
  }
}
</script>

<style scoped>

</style>
