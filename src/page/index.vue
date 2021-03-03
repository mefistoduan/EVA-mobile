<template>
    <div id="index">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
    }
</script>
<style>
    #index {
        height: 100%;
        padding-bottom: 40px;
        overflow-y: scroll;
    }
</style>
