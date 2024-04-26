// uno.config.ts
import {defineConfig} from 'unocss'

export default defineConfig({
    // ...UnoCSS options
    rules: [
        [/^m-([.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })],
        [/^p-([.\d]+)$/, ([_, num]) => ({ padding: `${num}px` })],
        [/^mt-([.\d]+)$/, ([_, num]) => ({marginTop: `${num}px`})],
        [/^mb-([.\d]+)$/, ([_, num]) => ({marginBottom: `${num}px`})],
        [/^color-(.*$)/, ([_, rgb]) => ({ color: `${rgb}` })],
        [/^abs-([.\d]+)$/, ([_, num]) => ({ position: 'absolute', top: `${num}px`, left: `${num}px`, right: `${num}px`, bottom: `${num}px` })],
    ],
})
