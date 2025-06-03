import {AiChatGroupWrap} from "@/entity/ai/AiChat";
import {Col, DialogPlugin, Link, Row, Space, Textarea} from 'tdesign-vue-next';
import {ChevronRightIcon} from 'tdesign-icons-vue-next';
import AiPrompt from '@/global/AIPrompt.json';

interface AiPromptType {
  label: string;
  value: string;
  desc: string;
}

const list = (AiPrompt as Array<AiPromptType>).slice(0, 3);

export function openAiGroupPrompt(group: AiChatGroupWrap): Promise<string> {
  const prompt = ref(group.prompt);

  const onClick = (data: AiPromptType) => {
    prompt.value = data.value;
  }
  const onPrompt = () => {
    openPrompt().then(p => prompt.value = p);
  }

  return new Promise<string>(resolve => {
    const dp = DialogPlugin({
      header: '编辑指令',
      placement: "center",
      draggable: true,
      width: "500px",
      confirmBtn: '使用',
      default: () => <div>
        <Textarea placeholder={"请输入指令"} autosize={{minRows: 8, maxRows: 8}} v-model={prompt.value}/>
        <Space class={"mt-16px"}>
          <span>指令参考</span>
          {list.map(e => <Link theme={"primary"} onClick={() => onClick(e)}>{e.label}</Link>)}
          <span> | </span>
          <Link theme={"primary"} onClick={onPrompt}>{{
            default: () => <span>更多</span>,
            suffixIcon: () => <ChevronRightIcon/>
          }}</Link>
        </Space>
      </div>,
      onConfirm: () => {
        resolve(prompt.value.trim());
        dp.destroy();
      }
    })
  })
}

export function openPrompt(): Promise<string> {
  return new Promise<string>(resolve => {
    const dp = DialogPlugin({
      header: '指令库',
      placement: "center",
      draggable: true,
      width: "550px",
      footer: false,
      default: () => <div style={{width: 'calc(100% - 16px)'}}>
        <Row gutter={[16, 16]}>
          {AiPrompt.map(e => <Col span={6}>
            <div style={{
              backgroundColor: 'var(--td-bg-color-component)',
              padding: '16px',
              borderRadius: 'var(--td-radius-medium)',
              cursor: 'pointer'
            }} onClick={() => {
              resolve(e.value);
              dp.destroy();
            }}>
              <div style={{color: 'var(--td-text-color-primary)', fontWeight: 'bold'}}>{e.label}</div>
              <div style={{
                color: 'var(--td-text-color-placeholder)',
                fontSize: 'var(--td-font-size-body-small)'
              }}>{e.desc}</div>
            </div>
          </Col>)}
        </Row>
      </div>
    })
  })
}