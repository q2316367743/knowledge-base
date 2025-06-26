import {App} from "@vue/runtime-core";
import {toArticleByRelation} from "@/components/ArticePreview/OpenArticle";

/**
 * 节点内容备注对话框
 */
export function handleNodeRemarkDialog() {
  const x = ref(0);
  const y = ref(0);
  const html = ref('');
  let app: App | null = null;

  const onHide = () => {
    if (app) app.unmount();
  }


  const div = document.createElement('div');
  div.id = 'mx-menu-default-container';
  div.classList.add('mx-menu-ghost-host');
  div.classList.add('fullscreen');
  div.classList.add('editor-common');
  div.style.zIndex = '100';
  document.addEventListener('click', onHide);
  document.body.appendChild(div);

  return {
    show(content: string, left: number, top: number) {
      html.value = content;
      x.value = left;
      y.value = top;
      onHide()
      app = createApp({
        render: () => <div class="mx-context-menu" data-type="ContextSubMenu" style={{
          maxWidth: '600px',
          minHeight: '100px',
          zIndex: "100",
          left: x.value + 'px',
          top: y.value + 'px',
          padding: '0 16px'
        }} innerHTML={html.value} onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          const target = e.target as HTMLElement;
          if (!target) return;
          if (target.tagName === 'SPAN' && target.dataset.type === 'mention') {
            toArticleByRelation(Number(target.dataset.id));
          }
        }}>
        </div>
      });
      app.mount(div);
    },
  }
}