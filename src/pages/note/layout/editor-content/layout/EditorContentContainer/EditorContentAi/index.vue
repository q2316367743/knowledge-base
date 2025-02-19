<template>
  <div class="editor-content-ai">
    <t-chat
      ref="chatRef"
      layout="single"
      style="height: calc(100vh - 57px)"
      :clear-history="chatList.length > 0 && !isStreamLoad"
      @clear="clearConfirm"
    >
      <template v-for="(item, index) in chatList" :key="index">
        <t-chat-item
          :name="item.name"
          :role="item.role"
          :content="item.content"
          :text-loading="index === 0 && loading"
        >
          <template v-if="!isStreamLoad" #actions>
            <t-chat-action
              :is-good="isGood"
              :is-bad="isBad"
              :content="item.content"
              @operation="(type, { e }) => handleOperation(type, { e, index })"
            />
          </template>
        </t-chat-item>
      </template>
      <template #footer>
        <t-chat-input :stop-disabled="isStreamLoad" @send="inputEnter" @stop="onStop"></t-chat-input>
      </template>
    </t-chat>
  </div>
</template>
<script lang="ts" setup>
import {
  Chat as TChat,
  ChatAction as TChatAction,
  ChatInput as TChatInput,
  ChatItem as TChatItem,
} from '@tdesign-vue-next/chat';
import {ArticleIndex} from "@/entity/article";
import {MockSSEResponse} from './sseRequest';

const props = defineProps({
  articleIndex: Object as PropType<ArticleIndex>
});
const emits = defineEmits(['insertToArticle']);
defineExpose({
  sendToChat() {

  }
});


const fetchCancel = ref(null);
const loading = ref(false);
const isStreamLoad = ref(false);
const isGood = ref(false);
const isBad = ref(false);
const chatRef = ref(null);
// 滚动到底部
const backBottom = () => {
  chatRef.value.scrollToBottom({
    behavior: 'smooth',
  });
};
// 倒序渲染
const chatList = ref([
  {
    content: `模型由 <span>hunyuan</span> 变为 <span>GPT4</span>`,
    role: 'model-change',
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    name: 'TD&AI',
    datetime: '今天16:38',
    content: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
    role: 'assistant',
  },
  {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    name: '自己',
    datetime: '今天16:38',
    content: '南极的自动提款机叫什么名字？',
    role: 'user',
  },
]);
const clearConfirm = function () {
  chatList.value = [];
};
const onStop = function () {
  if (fetchCancel.value) {
    fetchCancel.value.controller.close();
    loading.value = false;
  }
};
const handleOperation = function (type, options) {
  console.log('handleOperation', type, options);
  const {index} = options;
  if (type === 'good') {
    isGood.value = !isGood.value;
    isBad.value = false;
  } else if (type === 'bad') {
    isBad.value = !isBad.value;
    isGood.value = false;
  } else if (type === 'replay') {
    const userQuery = chatList.value[index + 1].content;
    inputEnter(userQuery);
  }
};
const inputEnter = function (inputValue: string) {
  if (isStreamLoad.value) {
    return;
  }
  if (!inputValue) return;
  const params = {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    name: '自己',
    datetime: new Date().toDateString(),
    content: inputValue,
    role: 'user',
  };
  chatList.value.unshift(params);
  // 空消息占位
  const params2 = {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    name: 'TD&AI',
    datetime: new Date().toDateString(),
    content: '',
    role: 'assistant',
  };
  chatList.value.unshift(params2);
  handleData(inputValue);
};
const fetchSSE = async (fetchFn, options) => {
  const response = await fetchFn();
  const {success, fail, complete} = options;
  // 如果不 ok 说明有请求错误
  if (!response.ok) {
    complete?.(false, response.statusText);
    fail?.();
    return;
  }
  const reader = response?.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;
  const bufferArr = [];
  let dataText = ''; // 记录数据
  const event = {data: null};

  reader.read().then(function processText({done, value}) {
    if (done) {
      // 正常的返回
      complete?.(true);
      return;
    }
    const chunk = decoder.decode(value, {stream: true});
    const buffers = chunk.toString().split(/\r?\n/);
    bufferArr.push(...buffers);
    const i = 0;
    while (i < bufferArr.length) {
      const line = bufferArr[i];
      if (line) {
        dataText = dataText + line;
        event.data = dataText;
      }
      if (event.data) {
        const jsonData = JSON.parse(JSON.stringify(event));
        success(jsonData);
        event.data = null;
      }
      bufferArr.splice(i, 1);
    }
    reader.read().then(processText);
  });
};
const handleData = async () => {
  loading.value = true;
  isStreamLoad.value = true;
  const lastItem = chatList.value[0];
  const mockedData = `这是一段模拟的流式字符串数据。`;
  const mockResponse = new MockSSEResponse(mockedData);
  fetchCancel.value = mockResponse;
  await fetchSSE(
    () => {
      return mockResponse.getResponse();
    },
    {
      success(result) {
        loading.value = false;
        const {data} = result;
        lastItem.content += data;
      },
      complete(isOk, msg) {
        if (!isOk || !lastItem.content) {
          lastItem.role = 'error';
          lastItem.content = msg;
        }
        // 控制终止按钮
        isStreamLoad.value = false;
        loading.value = false;
      },
    },
  );
};
</script>
<style scoped lang="less">
.editor-content-ai {
  padding: 8px;
}
</style>
