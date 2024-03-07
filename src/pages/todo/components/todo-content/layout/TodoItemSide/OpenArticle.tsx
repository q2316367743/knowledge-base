import {ArticleIndex} from "@/entity/article";
import {Drawer} from "@arco-design/web-vue";
import EditorContentContainer from "@/pages/home/layout/editor-content/layout/EditorContentContainer.vue";
import {useWindowSize} from "@vueuse/core";

export function openArticle(articleIndex: ArticleIndex) {
    const size = useWindowSize();
    Drawer.open({
        title: articleIndex.name,
        width: '80vw',
        footer: false,
        content: () => <div style={{height: (size.height.value - 72) + 'px', width: '100%'}}>
            <EditorContentContainer articleIndex={{
                ...articleIndex,
                preview: true
            }}/>
        </div>
    })
}
