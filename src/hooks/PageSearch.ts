import {computed, onMounted, onUnmounted, ref, watch} from "vue";

export function usePageSearch(placeholder = '在页面中搜索', isFocus?: boolean) {
    const keyword = ref('');

    const available = computed(() => keyword.value.trim() !== '');


    watch(keyword, text => {
        if (text) {
            utools.findInPage(text, {
                matchCase: false,
                wordStart: true
            });
        } else {
            utools.stopFindInPage('clearSelection')
        }
    });

    function forward() {
        if (keyword.value) {
            utools.findInPage(keyword.value, {
                matchCase: false,
                forward: false,
                findNext: true
            });
        }
    }

    function findNext() {
        if (keyword.value) {
            utools.findInPage(keyword.value, {
                matchCase: false,
                forward: true,
                findNext: false,
            });
        }
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            if (keyword.value) {
                if (e.shiftKey) {
                    forward();
                } else {
                    findNext();
                }
            }
        }
    }

    onMounted(() => {
        // 使用定时器，确保一定注册成功
        const interval = setInterval(() => {
            let res = utools.setSubInput(({text}) => keyword.value = text, placeholder, isFocus);
            // 如果注册成功
            if (res) {
                // 清除定时器
                clearInterval(interval)
            }
        }, 100);

        window.addEventListener('keydown', onKeyDown)
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', onKeyDown);
        utools.removeSubInput()
    });

    function close() {
        utools.setSubInputValue('')
    }

    return {keyword, available, forward, findNext, close}


}
