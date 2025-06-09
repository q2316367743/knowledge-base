import {DialogPlugin, Input, List, ListItem} from "tdesign-vue-next";
import {ChatDoubleIcon, SearchIcon} from "tdesign-icons-vue-next";
import {useFuse} from "@vueuse/integrations/useFuse";
import {AiChatList} from "@/entity/ai/AiChat";
import {useAiChatListStore} from "@/store";
import {activeKey, autoHideCollapsed} from "@/pages/home/model";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import './HomeChatSearch.less';


export function openHomeChatSearch() {
  const keyword = ref('');

  const items = computed(() => useAiChatListStore().lists);
  const {results} = useFuse<AiChatList>(keyword, items, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
      keys: ['name']
    }
  });

  function onChatClick(data: AiChatList) {
    activeKey.value = `/home/chat/0/${data.id}`;
    autoHideCollapsed();
    dp.destroy();
  }
  function onChatCreate() {
    activeKey.value = `/home/welcome`;
    autoHideCollapsed();
    dp.destroy();
  }

  const dp = DialogPlugin({
    header: () => <Input v-model={keyword.value} placeholder={"搜索对话"}>{{
      prefixIcon: () => <SearchIcon/>
    }}</Input>,
    footer: false,
    closeOnEscKeydown: false,
    placement: "center",
    default: () => <div>
      <div class="home-chat-search-item"  style={{marginTop: "8px"}} onClick={onChatCreate}>
        <div class="left">
          <ChatDoubleIcon size={'16px'}/>
          <div class="title">新建聊天</div>
        </div>
      </div>
      <List size={"small"} scroll={{ type: 'virtual', rowHeight: 46, bufferSize: 5, threshold: 5 }}>
        {results.value.map(({item}, i) => <ListItem key={item.id}>
          <div class="home-chat-search-item" onClick={() => onChatClick(item)}>
            <div class="left">
              <div class="title">{item.name}</div>
            </div>
            <div class="right">
              {toDateTimeString(item.createBy)}
            </div>
          </div>
        </ListItem>)}
      </List>
    </div>
  })
}