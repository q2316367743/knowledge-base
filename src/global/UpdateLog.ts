import {Log, LogItemEnum} from "@/components/update-check/domain";

export default [
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
        }]
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
        },{
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
        },{
            label: LogItemEnum.ADD,
            content: '图：新增点击文章进行打开，点击分类、标签跳转搜索'
        },{
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
        },{
            label: LogItemEnum.ADD,
            content: ' 优化目录'
        },{
            label: LogItemEnum.ADD,
            content: '分类增加排序'
        },{
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
