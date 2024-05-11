import {Log, LogItemEnum} from "@/components/update-check/domain";

// 数学笔记-公式对话框增加目录
// 编辑器标签栏右键增加预览切换
// 新增快捷键：Ctrl/Alt + Q（预览），Ctrl/Alt + P（打印）
// 支持更加细致的文件名自定义
// 新增markdown模板，在创建markdown笔记的时候，根据名字正则匹配markdown模板（重要功能）

export default [
    {
        version: '2.2.2',
        sign: 222,
        time: '2024-05-11',
        items: [{
            label: LogItemEnum.REPAIR,
            content: "【文章】新建文章不再校验文件名是否重复"
        }, {
            label: LogItemEnum.UPDATE,
            content: "【插件】修复系统bug，维护系统稳定性"
        }],
    },
    {
        version: '2.2.1',
        sign: 221,
        time: '2024-05-08',
        items: [{
            label: LogItemEnum.REPAIR,
            content: "【markdown编辑器】修复预览区点击回调事件失效的问题; 增加点击toc页面目录不更新location hash的特性"
        }, {
            label: LogItemEnum.UPDATE,
            content: "【插件】修复系统bug，维护系统稳定性"
        }],
        url: 'https://txc.qq.com/products/612648/post/171517376866657157'
    },
    {
        version: '2.2.0',
        sign: 220,
        time: '2024-05-06',
        items: [{
            label: LogItemEnum.ADD,
            content: "【编辑器】数学笔记-公式对话框增加目录"
        }, {
            label: LogItemEnum.ADD,
            content: "【编辑器】编辑器标签栏右键增加预览切换"
        },{
            label: LogItemEnum.ADD,
            content: "【插件】新增快捷键：Ctrl/Alt + Q（预览），Ctrl/Alt + P（打印）"
        },{
            label: LogItemEnum.ADD,
            content: "【设置】支持更加细致的文件名自定义"
        },{
            label: LogItemEnum.MAJOR,
            content: "【编辑器】新增markdown模板，在创建markdown笔记的时候，根据名字正则匹配markdown模板"
        }],
        url: 'https://txc.qq.com/products/612648/post/171492015824131371'
    },
    {
        version: '2.1.1',
        sign: 211,
        time: '2024-04-30',
        items: [{
            label: LogItemEnum.ADD,
            content: "【编辑器】表格笔记新增排序和过滤"
        }],
        url: 'https://txc.qq.com/products/612648/post/171446212110000020'
    },
    {
        version: '2.1.0',
        sign: 210,
        time: '2024-04-29',
        items: [{
            label: LogItemEnum.MAJOR,
            content: "【编辑器】新增表格笔记"
        }, {
            label: LogItemEnum.UPDATE,
            content: "【待办】日历布局新增已完成"
        }],
        remark: "此次主要新增了一个表格笔记，可以记录一些二维数据，并且配合自定义列，还可以设置列属性。表格笔记还属于预览",
        url: 'https://txc.qq.com/products/612648/post/171438499593252185'
    },
    {
        version: '2.0.2',
        sign: 202,
        time: '2024-04-24',
        items: [{
            label: LogItemEnum.ADD,
            content: "【编辑器】标签页新增右键菜单，可以关闭当前标签页、关闭其他标签页、关闭全部标签页，还可以修改、删除当前标签页的文章"
        }, {
            label: LogItemEnum.UPDATE,
            content: "【备份】修复备份路径错误的问题"
        }],
        remark: "新增的标签页右键菜单，不仅可以快速对标签页进行操作，还可以对当前标签页的文章进行操作",
        url: 'https://txc.qq.com/products/612648/post/171395053315590872'
    },
    {
        version: '2.0.1',
        sign: 201,
        time: '2024-04-18',
        items: [{
            label: LogItemEnum.ADD,
            content: "【编辑器】AI问答新增问答提示词，可以快速输入相同的问题"
        }, {
            label: LogItemEnum.UPDATE,
            content: "【工具】搜索内容升级，现在可以在markdown、富文本、代码笔记和思维导图中搜索内容了"
        }],
        remark: "首页新增快捷键Ctrl/Alt+Shift+F进行快速内容搜索，可以以弹窗的形式进行搜索",
        url: 'https://txc.qq.com/products/612648/post/171343242781378813'
    },
    {
        version: '2.0.0',
        sign: 200,
        time: '2024-04-06',
        items: [{
            label: LogItemEnum.ADD,
            content: "【编辑器】新增主体与插件"
        }],
        remark: '此处新增了主题与插件，可以自定义主题，自己修改markdown预览样式。也可以自己新增markdown菜单，实现自定义功能，比如文字替换、插入自定义内容等等。主题与插件的使用方法请查看文档'
    },
    {
        version: '1.9.8',
        sign: 198,
        time: '2024-04-01',
        items: [{
            label: LogItemEnum.UPDATE,
            content: "【编辑器】delete删除快捷键改为：（ctrl/alt + Delete）"
        }, {
            label: LogItemEnum.UPDATE,
            content: '【富文本】富文本现在上传图片会将图片转为base64存在文章中，但由于文章最大1m，请谨慎使用'
        }, {
            label: LogItemEnum.ADD,
            content: "【富文本】富文本导出新增Word格式"
        }]
    },
    {
        version: '1.9.7',
        sign: 197,
        time: '2024-03-29',
        items: [{
            label: LogItemEnum.UPDATE,
            content: "【编辑器】现在可以在设置中设置，新建笔记时是否自动根据规则命名，如果选择否，则在创建笔记时需要手动命名。"
        }, {
            label: LogItemEnum.UPDATE,
            content: '【待办】在卡片布局和日历布局中，左键点击待办是查看详情，右键点击待办才是编辑'
        }, {
            label: LogItemEnum.ADD,
            content: "【插件】新增两个快捷键：（ctrl/alt + n）=> 新建笔记，Delete => 删除当前笔记"
        }, {
            label: LogItemEnum.UPDATE,
            content: "【画板】新增箭头、文章，修复实线，虚线，文字模式不是很稳定"
        }]
    },
    {
        version: '1.9.6',
        sign: 196,
        time: '2024-03-27',
        items: [{
            label: LogItemEnum.MAJOR,
            content: "【markdown】现在markdown笔记的右上角单独markdown文件导出，如果笔记中含有存放在utools中的图片，导出的时候会自动将图片进行解析，之后会下载一个包含图片的压缩包。"
        }, {
            label: LogItemEnum.ADD,
            content: '【编辑器】现在可以记住侧边栏展开的目录了'
        }, {
            label: LogItemEnum.ADD,
            content: "【富文本】由于富文本本身的问题，导致图片无法进行渲染，目前采取折中方案，会将图片保存到本地磁盘，以本地文件形式加载，但是这样图片就没办法进行utools同步了。"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【富文本】修复了富文本中链接无法打开的问题。"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【markdown】修复了暗黑模式下，目录颜色问题。"
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: "【插件】一些细节样式优化"
        }],
    },
    {
        version: '1.9.5',
        sign: 195,
        time: '2024-03-26',
        items: [{
            label: LogItemEnum.ADD,
            content: '【AI】增加你问我答，可以根据文章进行提问'
        }, {
            label: LogItemEnum.REPAIR,
            content: "【待办】修复卡片布局和日历布局中，布局错位问题"
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: "【待办】默认布局增加设置"
        }],
    },
    {
        version: '1.9.4',
        sign: 194,
        time: '2024-03-24',
        items: [{
            label: LogItemEnum.ADD,
            content: '【编辑器】加了个AI问答的功能，但需要自己配置api和token'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: "【编辑器】插入图片时，自动拼接#100%"
        }],
    },
    {
        version: '1.9.3',
        sign: 193,
        time: '2024-03-21',
        items: [{
            label: LogItemEnum.ADD,
            content: '【思维导图】新增右键菜单，如果存在链接，可以在菜单中打开链接'
        }, {
            label: LogItemEnum.ADD,
            content: "【思维导图】节点可拖拽"
        }, {
            label: LogItemEnum.ADD,
            content: "【待办】待办中预览关联的文章，可以直接点击编辑接口进行跳转标记"
        }],
    },
    {
        version: '1.9.2',
        sign: 192,
        time: '2024-03-15',
        items: [{
            label: LogItemEnum.ADD,
            content: '【笔记】新增画板'
        }, {
            label: LogItemEnum.ADD,
            content: "【待办】新增模板导出，可以自定义导出格式"
        }, {
            label: LogItemEnum.ADD,
            content: "【markdown笔记】支持关联文章"
        }, {
            label: LogItemEnum.ADD,
            content: "【思维导图】支持插入图标"
        }, {
            label: LogItemEnum.ADD,
            content: "【思维导图】标签共享，可以相互引用"
        }, {
            label: LogItemEnum.ADD,
            content: "【编辑器】支持文章移动和文章批量移动"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【编辑器】修复从预览模式切换为编辑模式，工具栏重置问题"
        }, {
            label: LogItemEnum.UPDATE,
            content: "【编辑器】已删除表格笔记"
        }],
        remark: "已删除表格笔记，如果还没有迁移的，可以下载1.9.2之前的版本，将数据保存"
    },
    {
        version: '1.9.1',
        sign: 191,
        time: '2024-03-14',
        items: [{
            label: LogItemEnum.REPAIR,
            content: '【待办】只有待办状态才显示置顶'
        }, {
            label: LogItemEnum.REPAIR,
            content: "【待办】默认视图优化，不会因为滚动导致工具栏丢失"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【编辑器】点击文件夹，如果已展开则关闭"
        }],
        remark: "下个版本将会彻底删除表格笔记，大家注意数据迁移！！！"
    },
    {
        version: '1.9.0',
        sign: 190,
        time: '2024-03-13',
        items: [{
            label: LogItemEnum.MAJOR,
            content: '【待办】新增日历布局'
        }, {
            label: LogItemEnum.REPAIR,
            content: "【笔记】修复了笔记样式错误问题"
        }],
        remark: "此次版本新增了日历布局，但是自我感觉操作不是很流畅。" +
            "我是一般只使用卡片布局，很少使用日历布局的。" +
            "如果有更多的想法或更好的建议，可以去兔小巢，如果可能的话，有图片标注一下就更好了。"
    },
    {
        version: '1.8.0',
        sign: 180,
        time: '2024-03-10',
        items: [{
            label: LogItemEnum.MAJOR,
            content: "【待办】新增卡片布局，卡片布局更加直观，操作更加方便"
        }, {
            label: LogItemEnum.MAJOR,
            content: "【笔记】文章导入全新改版，导入方式更加直观，更加方便"
        }, {
            label: LogItemEnum.ADD,
            content: '【思维导图】新增导入功能，新增关联线，新增布局和主题设置'
        }, {
            label: LogItemEnum.ADD,
            content: "【表格笔记】保存内容需要手动保存，预览模式无法保存内容"
        }, {
            label: LogItemEnum.ADD,
            content: "【笔记】markdown编辑模式增加仅预览选项"
        }, {
            label: LogItemEnum.ADD,
            content: "【笔记】新增批量删除的功能，支持删除文件夹下全部笔记"
        }, {
            label: LogItemEnum.ADD,
            content: "【笔记】新增清空回收站的功能"
        }, {
            label: LogItemEnum.ADD,
            content: "【笔记】支持全选功能，可以批量删除"
        }, {
            label: LogItemEnum.ADD,
            content: "【设置】增加待办中点击关联文章跳转方式，可以设置直接侧边预览"
        }, {
            label: LogItemEnum.ADD,
            content: "【待办】可以直接删除已完成的待办"
        }, {
            label: LogItemEnum.ADD,
            content: "【待办】新增待办进度条，显示清单中待办完成进度"
        }],
        remark: "此次重点更新待办的卡片视图，显示更加直观。" +
            "新增待办进度条，显示清单中待办完成进度。" +
            "之后的版本中会删除掉表格笔记，请大家不要使用。"
    },
    {
        version: '1.7.1',
        sign: 171,
        time: '2024-03-06',
        items: [{
            label: LogItemEnum.ADD,
            content: '【笔记】新增思维导图'
        }, {
            label: LogItemEnum.ADD,
            content: "【笔记】增加排序功能"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【笔记】修复导出无效问题"
        }, {
            label: LogItemEnum.REPAIR,
            content: "【笔记】多个富文本编辑器无法使用问题"
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: "【笔记】选中笔记时，自动展开文件夹"
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: "【笔记】点击文件夹展开文件夹"
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: "【笔记】思维导图增加快捷键"
        }]
    },
    {
        version: '1.6.0',
        sign: 160,
        time: '2024-02-29',
        items: [{
            label: LogItemEnum.ADD,
            content: '【笔记】新增表格笔记'
        }, {
            label: LogItemEnum.ADD,
            content: "【笔记】新增标签栏，可以同时编辑多个笔记"
        }],
        url: 'https://blog.esion.xyz/index.php/2024/03/01/知识库-1-6-0更新/'
    },
    {
        version: '1.5.4',
        sign: 154,
        time: '2024-02-28',
        items: [{
            label: LogItemEnum.UPDATE,
            content: '【空间】去除空间功能，空间功能已下线，已合并到新的插件【卡片笔记】中，可以在设置中导出空间数据，在卡片笔记中导入数据。'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: "【设置】优化设置页面，备份移动到【更多】中"
        }],
    },
    {
        version: '1.5.3',
        sign: 153,
        time: '2024-01-24',
        items: [{
            label: LogItemEnum.UPDATE,
            content: '【设置】增加编辑器编辑模式设置'
        }, {
            label: LogItemEnum.UPDATE,
            content: "【动态】优化颜色秀按时"
        }, {
            label: LogItemEnum.UPDATE,
            content: "【编辑器】优化富文本编辑器的显示问题，修复了当宽度太小导致部分内容不显示问题"
        }, {
            label: LogItemEnum.UPDATE,
            content: "【编辑器】优化编辑器目录显示问题"
        }],
    },
    {
        version: '1.5.2',
        sign: 152,
        time: '2024-01-19',
        items: [{
            label: LogItemEnum.UPDATE,
            content: '【设置】优化兰空图床上传'
        }, {
            label: LogItemEnum.UPDATE,
            content: "【插件】升级依赖，主要升级了markdown编辑器的依赖，修复了一些已知问题"
        }],
    },
    {
        version: '1.5.0',
        sign: 150,
        time: '2023-11-20',
        items: [{
            label: LogItemEnum.ADD,
            content: '【工作空间】新增本地工作空间'
        }, {
            label: LogItemEnum.REPAIR,
            content: '【设置】修复备份异常的问题'
        }],
        remark: "之前的草稿箱现在升级为工作空间，有一部分用户在本地维护了一套文件系统，比如hexo或者vuepress之类的静态网站，" +
            "在使用本插件时会经常导入导出文件，给一部分用户造成了不变，此次的工作空间可以直接选择本地目录进行编辑，不仅体验了更加高效的编辑，" +
            "也将内容维护在本地。第一个版本只出了本地工作空间，下个版本会增加gitee的工作空间。如果是图片策略是内部实现，" +
            "则会上传到文章所在目录的image目录下。",
        url: 'https://blog.esion.xyz/index.php/2023/11/22/知识库-1-5-0版本更新/'
    },
    {
        version: '1.4.2',
        sign: 142,
        time: '2023-11-16',
        items: [{
            label: LogItemEnum.ADD,
            content: '【todo】增加导出类型选择'
        }, {
            label: LogItemEnum.ADD,
            content: '【todo】新增待办时增加优先级选择'
        }, {
            label: LogItemEnum.UPDATE,
            content: '【编辑器】优化导入导出，可以在文件夹层面上导入导出'
        }, {
            label: LogItemEnum.UPDATE,
            content: '【todo】优化自动保存，优化加载动画'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '【todo】优化编辑器内边距'
        }, {
            label: LogItemEnum.OPTIMIZATION,
            content: '【todo】细节优化，去除无效基础设置'
        }, {
            label: LogItemEnum.REPAIR,
            content: '【编辑器】修复从插件【网页剪报】导入异常的问题'
        }]
    },
    {
        version: '1.4.1',
        sign: 141,
        time: '2023-11-08',
        items: [{
            label: LogItemEnum.ADD,
            content: '【编辑器】新增全功能兰空图床，建议使用兰空图床存储图片'
        }, {
            label: LogItemEnum.ADD,
            content: '【todo】增加图片上传'
        }, {
            label: LogItemEnum.ADD,
            content: '【todo】新增待办导出'
        }, {
            label: LogItemEnum.ADD,
            content: '【todo】新增自定义是否收起选项'
        }, {
            label: LogItemEnum.ADD,
            content: '【插件】新增自定义新笔记名称、自定义默认代码拓展名'
        }, {
            label: LogItemEnum.UPDATE,
            content: '【编辑器】彻底删除editor.js'
        }]
    },
    {
        version: '1.4.0',
        sign: 140,
        time: '2023-10-28',
        items: [{
            label: LogItemEnum.ADD,
            content: '【编辑器】优化主程序推送，防止文档数量太多无法展示'
        }, {
            label: LogItemEnum.ADD,
            content: '【编辑器】修复markdown第一次展示的时候，预览超出的问题'
        }, {
            label: LogItemEnum.ADD,
            content: '【编辑器】新增回收站功能，删除文章不会立即删除，而是会进入回收站，在回收站中可以强制删除。'
        }, {
            label: LogItemEnum.ADD,
            content: '【编辑器】新增批量删除功能'
        }, {
            label: LogItemEnum.ADD,
            content: '【插件】新增主题设置，可以设置背景图片，可以切换暗黑/白天模式，也可以跟随系统。'
        }, {
            label: LogItemEnum.ADD,
            content: '【插件】优化图片上传，下个版本会加入兰空图床，不是很建议将图片上传到utools中。'
        }, {
            label: LogItemEnum.UPDATE,
            content: '【编辑器】富文本编辑器变为wangEditor'
        }, {
            label: LogItemEnum.UPDATE,
            content: '【编辑器】设置里面可以设置分类'
        }],
        remark: "旧的富文本编辑器的内容还会保留一个版本，请大家及时迁移富文本编辑器的内容，下个版本将彻底删除，届时内容将无法访问。"
    },
    {
        version: '1.3.2',
        sign: 132,
        time: '2023-10-23',
        items: [{
            label: LogItemEnum.ADD,
            content: '【todo】待办自身也可以隐藏'
        }, {
            label: LogItemEnum.ADD,
            content: '【编辑器】关联文章使用树形结构'
        }, {
            label: LogItemEnum.ADD,
            content: '【编辑器】截图是，如果未分离插件，插件将会隐藏'
        }, {
            label: LogItemEnum.ADD,
            content: '【编辑器】搜索文章内容，可以在全部markdown笔记中从内容搜索关键字，只会显示每个文章的第一个出现关键字位置，位置在第五个菜单中'
        }, {
            label: LogItemEnum.UPDATE,
            content: '【编辑器】修复富文本上传图片错误'
        }, {
            label: LogItemEnum.UPDATE,
            content: '【插件】删除自定义存储位置选项'
        }]
    },
    {
        version: '1.3.1',
        sign: 131,
        time: '2023-10-16',
        items: [{
            label: LogItemEnum.ADD,
            content: '【todo】待办可以关联文章'
        }, {
            label: LogItemEnum.ADD,
            content: '【编辑器】新增目录、字数统计、创建修改时间'
        }, {
            label: LogItemEnum.ADD,
            content: '【编辑器】markdown编辑器增加盘古之白插件，可以在中英文之间增加空格'
        }, {
            label: LogItemEnum.UPDATE,
            content: '【编辑器】未选择文章不能编辑'
        }, {
            label: LogItemEnum.REPAIR,
            content: '【编辑器】修复文件夹无法移动，文件夹、文章无法移动到根目录'
        }, {
            label: LogItemEnum.REPAIR,
            content: '【todo】待办标题太长进行隐藏，显示省略号'
        }, {
            label: LogItemEnum.REPAIR,
            content: '【todo】修复待办文件夹、清单无法移动到根目录BUG'
        }],
        remark: "未来将逐步删除原先的默认主页功能，最终会全部删除，建议使用编辑器主页。"
    },
    {
        version: '1.3.0',
        sign: 130,
        time: '2023-10-16',
        items: [{
            label: LogItemEnum.ADD,
            content: '【文章】增加导入功能，支持导入markdown文件、docx文件、zip文件'
        }, {
            label: LogItemEnum.ADD,
            content: '【文章】支持导出功能，可以将文章导出为zip压缩包，并保留目录结构'
        }, {
            label: LogItemEnum.ADD,
            content: '【文章】编辑器增加截图功能，可以截图并粘贴到编辑器中'
        }, {
            label: LogItemEnum.ADD,
            content: '【文章】删除了之前以预览为主的主页，并删除了单独的编辑器和单独的预览页'
        }, {
            label: LogItemEnum.ADD,
            content: '【文章】修改markdown编辑器引擎为cherry-markdown，支持的语法更多，编辑器更强大'
        }, {
            label: LogItemEnum.ADD,
            content: '【文章】新增临时markdown编辑器，可以作为草稿使用，此编辑器内容自动保存。' +
                '此编辑器可以作为发布到支持markdown博客平台的编辑器，不用担心编写的文章丢失。'
        }, {
            label: LogItemEnum.ADD,
            content: '【文章】新增富文本编辑器，新建文章时，可以选择富文本编辑器，此编辑器基于块编辑，功能十分的强大，' +
                '支持的样式也更多，未来也会将更多的功能在此编辑器上实现'
        }, {
            label: LogItemEnum.ADD,
            content: '【文章】新增代码编辑器，使用VSCode同款编辑器Monaco Editor，支持常见语法高亮。可以记录代码片段'
        }, {
            label: LogItemEnum.ADD,
            content: '【TODO】新增快速访问，可以将待办清单新增为关键字，快速访问待办清单'
        }, {
            label: LogItemEnum.ADD,
            content: '【TODO】待办支持放弃并且支持填写放弃原因，新增分组：已放弃'
        }, {
            label: LogItemEnum.ADD,
            content: '【TODO】待办描述编辑器增加工具栏，增加返回顶部功能'
        }, {
            label: LogItemEnum.REPAIR,
            content: '【分类】修复分类不能重命名问题'
        }, {
            label: LogItemEnum.UPDATE,
            content: '【TODO】优化待办项完成消息内容'
        }],
        remark: "cherry-markdown具体语法可前往临时编辑器查看。功能十分强大。按ctrl+f可进行搜索，再次按ctrl+f可进行替换",
        url: "https://blog.esion.xyz/index.php/2023/10/15/知识库-1-3-0版本更新/"
    },
    {
        version: '1.2.1',
        sign: 121,
        time: '2023-10-12',
        items: [{
            label: LogItemEnum.ADD,
            content: '【文章】新增文章自动保存功能，再也不用担心文章丢失了'
        }, {
            label: LogItemEnum.ADD,
            content: '【文章】新增文章导入功能，支持导入markdown文件'
        }, {
            label: LogItemEnum.ADD,
            content: '【TODO】增加待办排序，待办新增标签功能与创建时间现实'
        }, {
            label: LogItemEnum.REPAIR,
            content: '【TODO】空内容不允许创建待办'
        }, {
            label: LogItemEnum.UPDATE,
            content: '【文章】预览优化，布局与编辑布局保持一致'
        }],
        remark: "未来将逐步删除原先的默认主页功能，最终会全部删除，建议使用编辑器主页。"
    },
    {
        version: '1.2.0',
        sign: 120,
        time: '2023-10-11',
        items: [{
            label: LogItemEnum.ADD,
            content: '新增待办功能'
        }, {
            label: LogItemEnum.UPDATE,
            content: '文章编辑变更'
        }, {
            label: LogItemEnum.REPAIR,
            content: '修复从分类图进入文章无法返回的bug'
        }, {
            label: LogItemEnum.UPDATE,
            content: '优化数据获取，在数据获取时增加全局加载框。'
        }],
        url: 'https://blog.esion.xyz/index.php/2023/10/10/知识库1-2-0版本更新/'
    },
    {
        version: '1.1.0',
        sign: 110,
        time: '2023-10-08',
        items: [{
            label: LogItemEnum.ADD,
            content: '增加多种存储方式；现在数据可以存到alist中，不依赖utools就可以实现同步，未来将新增本地模式和webdav。'
        }, {
            label: LogItemEnum.ADD,
            content: '新增编辑器模式的主页；这样主页可以直接编辑文章，并且支持目录'
        }, {
            label: LogItemEnum.ADD,
            content: '分类升级；现在的分类为多级分类，可以创建无限多的子分类'
        }, {
            label: LogItemEnum.ADD,
            content: '新增文件备份功能'
        }],
        remark: '已知问题：在做数据迁移时，一般会将utools数据执行文件备份将数据导出，再使用alist服务器，进行备份恢复，' +
            '如果保存，请先删除alist中目标文件夹下全部的json文件，主要是index.js文件，之后重新执行恢复即可。' +
            '如果恢复备份完没有数据，请完全退出插件，重新进入就好了'
    },
    {
        version: '1.0.8',
        sign: 108,
        time: '2023-09-17',
        items: [{
            label: LogItemEnum.REPAIR,
            content: '修复坚果云WebDAV备份错误问题'
        }]
    },
    {
        version: '1.0.7',
        sign: 107,
        time: '2023-09-07',
        items: [{
            label: LogItemEnum.ADD,
            content: '增加自定义图床，可以调用插件【图床】'
        }]
    },
    {
        version: '1.0.6',
        sign: 106,
        time: '2023-09-05',
        items: [{
            label: LogItemEnum.ADD,
            content: ' 新增WebDAV备份设置，可以将数据备份到WebDAV，之后进行恢复'
        }, {
            label: LogItemEnum.ADD,
            content: '动态新增分享功能，可以导出为图片进行分享'
        }, {
            label: LogItemEnum.ADD,
            content: '图：新增点击文章进行打开，点击分类、标签跳转搜索'
        }, {
            label: LogItemEnum.ADD,
            content: '新增控制台，用于查找异常错误'
        }, {
            label: LogItemEnum.UPDATE,
            content: '关键字变为自定义开启或关闭'
        }]
    },
    {
        version: '1.0.5',
        sign: 105,
        time: '2023-09-01',
        items: [{
            label: LogItemEnum.ADD,
            content: '新增代码是否换行功能'
        }]
    },
    {
        version: '1.0.4',
        sign: 104,
        time: '2023-08-27',
        items: [{
            label: LogItemEnum.UPDATE,
            content: '优化标记逻辑，增加是否启用标记，启用标记后无法进行复制'
        }, {
            label: LogItemEnum.ADD,
            content: '文章界面增加跳转到编辑页面按钮，优化文章界面按钮'
        }]
    },
    {
        version: '1.0.3',
        sign: 103,
        time: '2023-08-27',
        items: [{
            label: LogItemEnum.ADD,
            content: '可以在搜索面板中直接搜索文章，但需要设置搜索面板为聚合搜索，并在插件应用设置中设置为：允许推送内容到搜索面板'
        }, {
            label: LogItemEnum.ADD,
            content: '可以在文章内进行关键字搜索'
        }]
    },
    {
        version: '1.0.2',
        sign: 102,
        time: '2023-08-27',
        items: [{
            label: LogItemEnum.ADD,
            content: '新增图片上传的功能；在编写文章时，可以放大插件点击上面工具栏最后一项进行文件上传，也可以直接粘贴图片到编辑器进行上传，此处感谢插件【超级Markdown】'
        }, {
            label: LogItemEnum.ADD,
            content: ' 新增附件管理；在更多中新增附件管理，对上传的图片进行管理'
        }, {
            label: LogItemEnum.ADD,
            content: '新增文章标记功能'
        }]
    },
    {
        version: '1.0.1',
        sign: 101,
        time: '2023-08-27',
        items: [{
            label: LogItemEnum.ADD,
            content: '增加文章来源地址，列表页点击跳转'
        }, {
            label: LogItemEnum.ADD,
            content: '增加文件导出功能'
        }, {
            label: LogItemEnum.ADD,
            content: '保存文章后会自动跳转列表页'
        }, {
            label: LogItemEnum.ADD,
            content: ' 优化目录'
        }, {
            label: LogItemEnum.ADD,
            content: '分类增加排序'
        }, {
            label: LogItemEnum.ADD,
            content: '编辑器代码主题优化，使用设置的主题'
        }]
    },
    {
        version: '1.0.0',
        sign: 100,
        time: '2023-08-27',
        items: [{
            label: LogItemEnum.ADD,
            content: '实现文章新增、编辑和浏览'
        }, {
            label: LogItemEnum.ADD,
            content: '提供动态进行灵感保存'
        }, {
            label: LogItemEnum.ADD,
            content: '使用关系图进行展示'
        }]
    },
] as Log[]
