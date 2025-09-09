<template>
    <div class="container_wapper">
        <BarTop />
        <div class="content_warper">
            <div class="content">

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BarTop from '../../../components/BarTop/index.vue'
import { version } from '../../../../../package.json'

console.log(version)
</script>

<style scoped lang="less">
.container_wapper {
    display: flex;
    flex-direction: column;

    .content_warper {
        flex: 1;
        box-sizing: border-box;
        padding:0 20px 20px 20px;

        .content {
            background: #EEF7F6;
            border-radius: 8px;
            height: 100%;
        }


    }
}
</style>