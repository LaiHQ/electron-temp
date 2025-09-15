<template>
  <div class="update_warper">
    <div class="update_header">
      <div class="update_version">
        版本：v{{ state.updateAvailable.version }}
      </div>
    </div>
    <div class="update_content">
      <div class="content_title">更新日志</div>
      <div class="content_list">
        <div
          class="content_item"
          v-for="(text, idx) in releaseNotesList"
          :key="idx"
        >
          {{ text }}
        </div>
      </div>
    </div>
    <div class="update_footer">
      <a-button
        v-if="state.status !== 'updateProgress'"
        @click="handleUpdate('noUpdate')"
        style="margin-right: 24px"
        >暂不更新</a-button
      >
      <a-button
        type="primary"
        v-if="state.status == 'updateDownloaded'"
        @click="handleUpdate('downloaded')"
      >
        立即下载
      </a-button>
      <div style="flex: 1" v-if="state.status == 'updateProgress'">
        <div style="font-size: 12px; text-align: center; color: #ff7875">
          <span
            style="
              display: inline-block;
              border: 1px solid #ff7875;
              border-radius: 50%;
              width: 15px;
              height: 15px;
              text-align: center;
              line-height: 13px;
            "
            >!</span
          >
          更新过程中请不要关闭应用
        </div>
        <div style="display: flex; align-items: center; padding: 4px 0 0 16px">
          <span style="width: 100px; display: block">正在下载：</span>
          <a-progress
            :stroke-color="{
              '0%': '#87d068',
              '100%': '#108ee9',
            }"
            :percent="state.updateProgress.percent.toFixed(2)"
          />
        </div>
        <div
          style="
            font-size: 12px;
            text-align: center;
            margin-left: 20px;
            padding-top: 12px;
          "
        >
          [{{ transferred }}/{{ total }}]，速度：{{
            bytesPerSecond
          }}/秒，剩余时间（预计）：{{ minute || 0 }}
        </div>
      </div>
      <a-button
        type="primary"
        v-if="
          state.updateProgress.percent == 100 ||
          state.status == 'updateDownloadedEnd'
        "
        @click="handleUpdate('update')"
        >立即更新</a-button
      >
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue';
import { ipcRenderer } from 'electron';
import { dialogReady } from '../../common/dialog';

const state = reactive({
  updateAvailable: {
    files: [],
    version: '1.0.0',
    releaseDate: '',
    releaseNotes:
      '1.修复了一些已知问题。\r\n2.优化部分交互体验。',
  },
  updateProgress: {
    percent: 0,
    bytesPerSecond: 0,
    transferred: 0,
    total: 0,
  },
  status: 'updateDownloaded',
  updateDownloadedEnd: {},
});

function transformToMb(num = 0) {
  return (num / 1024 / 1024).toFixed(2) + 'MB';
}

const total = computed(() =>
  transformToMb(state.updateAvailable.files[0]?.size)
);

const transferred = computed(() =>
  transformToMb(state.updateProgress.transferred)
);

const bytesPerSecond = computed(() =>
  transformToMb(state.updateProgress.bytesPerSecond)
);

const minute = computed(() => {
  const surplus = state.updateProgress.total - state.updateProgress.transferred;
  const result = surplus / state.updateProgress.bytesPerSecond;

  const unit =
    result < 60 ? `${result.toFixed(0)}秒` : `${(result / 60).toFixed(0)}分`;
  return unit;
});

const releaseNotesList = computed(() =>
  state.updateAvailable.releaseNotes?.split('\r\n')
);

function handleUpdate(operate) {
  if (operate == 'noUpdate') {
    ipcRenderer.invoke('closeWindow');
  }
  if (operate == 'update') {
    ipcRenderer.invoke('update-version');
  }
  if (operate == 'downloaded') {
    ipcRenderer.invoke('update-downloaded');
  }
}

function msgHandler({ type, data }) {
  console.log('updateApp___', type);
  console.log('versionData', data);

  //目前都为强制更新， 下载完成直接安装
  // if (state.updateProgress.percent == 100) {
  //   handleUpdate('update');
  // }

  if (data.type !== 'updateAvailable') {
    state.status = data.type;
  }
  state[data.type] = data.data;
}

onMounted(() => {  
  window.addEventListener('message', msgHandler);
  dialogReady();  
});
</script>

<style lang="less" scoped>
.update_warper {
  flex: 1;
  border-radius: 4px;  
  .update_header {
    color: #fff;
    position: relative;
    height: 160px;
    width: 100%;
    background-size: 100% auto;
    background: url(https://file.1d1j.cn/fsse_update_bg.png) no-repeat;

    .update_version {
      position: absolute;
      left: 116px;
      top: 69px;
      font-size: 14px;
    }
  }
  .update_content {
    padding: 0px 40px;
    .content_title {      
      color: #fff;
      font-size: 14px;
      padding-bottom: 4px;
    }
    .content_item {
      padding-top: 8px;
      color: #fff;
      font-size: 14px;
    }
  }
  .update_footer {
    display: flex;
    justify-content: end;
    padding: 8px 40px 0 0;
    font-size: 14px;
    user-select: none;
  }
}
</style>
