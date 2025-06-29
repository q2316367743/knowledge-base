## 2.7.4

> 2025年6月26日

- `修复`修复表格笔记默认值问题
- `修复`修复问一问中，聊天列表显示问题
- `新增`新增笔记间引用功能，富文本笔记使用`@+空格`呼出引用列表，markdown笔记使用``[[笔记名]]``的形式引用笔记
- `优化`富文本编辑器引擎改为aieditor

## 2.7.3

> 2025年6月20日

- `修复`修复todo默认视图无法打开问题

## 2.7.2

> 2025年6月19日

- `新增`闪卡支持图片卡
- `新增`闪卡支持批量制卡
- `新增`新增自定义背景图片功能，可以在主题设置中自定义背景图片
- `优化`优化插件在最大化后的显示

准备增加docker版本，笔记还是大屏用的舒服

## 2.7.1

> 2025年6月13日

- `修复`修复移动文件夹可能导致文件夹隐藏问题
- `修复`笔记暂时采用按照文件名排序，以解决文件名乱序问题，下个版本会加入按照指定规则排序

## 2.7.0

> 2025年6月6日

- `重要更新`新增付费笔记类型：闪卡笔记，自由建卡，自由学习
- `更新`问一问升级，使用更方便

## 2.6.1

> 2025年5月23日

- `新增`待办小部件新增置顶功能
- `优化`移除了arco-design组件，整体样式更加统一
- `优化`打开待办小部件隐藏主窗口，关闭待办小部件显示主窗口
- `修复`修复了关闭小部件主插件未刷新问题
- `修复`修复了四象限布局中，文案错误

## 2.6.0

> 2025年5月14日

- `重要更新`待办布局新增四象限
- `新增`新增待办小部件
- `新增`超级笔记新增警告和引用
- `新增`markdown笔记导出为html中，新增代码块复制功能
- `更新`重构了日历组件
- `更新`调整笔记列表右键菜单的顺序及显示逻辑
- `更新`调整笔记列表右键菜单的顺序及显示逻辑
- `修复`修复了问一问中，没有将笔记加入上下文的问题

## 2.5.2

> 2025年4月14日

- `新增`新增了Markdown到处为微信公众号
- `新增`新增了对Ollama AI的支持,但处于beta版,不确保能用
- `新增`待办默认布局和卡片布局新增时间显示
- `修复`修复了WebDAV无法是用的问题
- `修复`修复了问一问没有将文章代入的问题
- `修复`修复待办无法放弃的问题，卡片布局待办新增右键菜单
- `更新`加密笔记可以选择笔记类型: 纯文本/markdown/富文本

## 2.5.1

> 2025年4月3日

- `重要更新`新增加密笔记，加密笔记采用bcrypt对您的密码进行加密，使用aes-256-cbc对您的笔记内容进行加密。如果您忘记了您的密码，则无法对笔记内容进行恢复，请一定要记住您的密码，请一定要记住您的密码，请一定要记住您的密码。
- `修复`修复了uTools不是7以上，启动插件会报错问题
- `修复`修复了AI问答使用uTools的API错误的问题
- `修复`修复了微信公众号导入笔记错误的问题
- `更新`优化开通VIP逻辑，避免开通后没有刷新VIP问题
- `更新`优化了卡片待办的界面样式
- `更新`优化富文本编辑器样式
- `更新`优化markdown的html导出功能，增加目录显示


## 2.5.0

> 2025-04-01

重要更新
新增买断笔记类型：超级笔记
- `更新`优化待办中的日历视图，现在的日历视图更加好看使用
- `新增`新增网页剪报功能，可以直接讲网页转为markdown笔记。「需要升级uTools7.0.0体验」
- `新增`AI服务新增uTools内置AI，无需设置即可使用
- `新增`新增主题设置，内置多种主题选择。「设置-基础设置-主题设置」
- `优化`组件库升级


## 2.4.2

> 2025-03-03

- `修复`修复了问题反馈点击错误问题


## 2.4.1

> 2025-02-26

- `重要更新`新增 AI 首页，目前仅支持自己配置 API 密钥，下个版本将内置 AI 服务
- `重要更新`待办新增分组功能，不仅可以自定义分组，也可以按照优先级分组
- `更新`重构了 AI 问答功能，使用额外的弹框，更加方便快捷
- `修复`修复了markdown笔记的笔记内搜索功能，新增markdown笔记的快捷键显示

AI 知识库的功目前来说还是太薄弱了，下个版本会参考更多的知识库软件去实现

## 2.4.0

> 2025-02-14

- `重要更新`新增代码笔记运行功能，可以将脚本保存到笔记中，随时随地运行
- `更新`待办权限改版，新增待办分组功能
- `更新`移除了分享中心功能
- `更新`移除了兰空图床
- `更新`移除了分享中心功能
- `更新`图床能力增强，加入更多图床选择

这个版本主要将待办进行了优化，尤其是卡片布局，之前仅仅以优先级进行分组是极其不合理的，现在加入分组功能，使用上更加便捷。卡片布局结合分组模式，就实现了kanban功能。子待办可能还要推迟，目前还没想好怎么去实现。

## 2.3.2

> 2024-11-06

- `修复`修复思维导图图片上传的bug

下个版本将增加待办移动和新增几个主题


## 2.3.1

> 2024-09-25

- `重要更新`待办搜索增加，支持更多的查询条件，包括：标题、内容、标签、状态、创建时间、完成时间。
- `更新`待办新增了记录完成时间字段

待办搜索可能不是很稳定，出现问题可以在兔小巢反馈问题。


## 2.3.0

> 2024-09-22

- `重要更新`新增流程图笔记，以替代被删除的画板笔记，但是流程图笔记与其他笔记有区别，亲注意查看
- `重要更新`备份优化，支持附件备份和备份恢复，之前备份无法备份附件，现在可以备份附件
- `优化`富文本导出增强，可以导出图片、视频和附件
- `优化`附件管理优化，复制的链接更加正常
- `优化`支持链接打开
- `优化`优化了一些细节，提升了用户体验

此版本主要更新了流程图笔记，但是流程图笔记与其他笔记有区别，请注意查看。下个版本会尝试使用leafer做一个白板笔记

## 2.2.7

> 2024-09-20

- `重要更新`移除了画板笔记，请使用其他笔记替代
- `新增`富文本可以上传任意大小的图片，并支持图片懒加载
- `新增`思维带图支持上传图片
- `新增`待办支持搜索功能，位置：待办->更多->搜索
- `修复`关联笔记失败

下个版本会上流程图，并尝试改善备份问题

## 2.2.6

> 2024-08-01

- `重要更新`新增了一个新的导出格式：uTools文档插件，教程：知识库导出为uTools文档插件
- `新增`待办新增进行中分组，感谢@RanLiuLian同学提交的pr：待办-新增【进行中】状态.
- `新增`markdown编辑器新增快捷键选项，可以使用vim快捷键解析编辑，解放双手
- `修复`自定义待办导出文案修复
- `修复`表格笔记暗黑模式下，菜单颜色异常

导出为uTools插件，请查看兔小巢中的更新日志，里面有教程。

## 2.2.5

> 2024-07-26

- `更新`优化小窗口
- `更新`修复系统bug，优化系统问题性

## 2.2.4

> 2024-07-22

- `修复`修复了待办默认布局备注内容不显示问题
- `新增`实验性新增了一些关键字，用于不通过utools窗口进行编辑。

新增的关键字目前只是实验性的，主要问题在于在外部编辑的内容需要重启插件，才可以在插件中显示出来。

## 2.2.3

> 2024-07-18

- `重要更新`【插件】富文本更换组件，使用AiEditor，带来更加AI功能
- `更新`【插件】Markdown编辑器增加对于公式的支持
- `新增`【插件】导出增强，除思维导图外都可以导出
- `新增`【插件】首页增加页面搜索
- `更新`【插件】修复系统bug，维护系统稳定性

## 2.2.2

> 2024-05-12

- `新增`【插件】 新增分享中心。分享中心中，你可以分享自己的脚本、也可以下载别人的脚本
- `修复`【笔记】新建笔记不再校验文件名是否重复
- `更新`【插件】修复系统bug，维护系统稳定性

## 2.2.1

> 2024-05-08

- `修复`【markdown编辑器】修复预览区点击回调事件失效的问题; 增加点击toc页面目录不更新location hash的特性
- `更新`【插件】修复系统bug，维护系统稳定性

## 2.2.0

> 2024-05-06

- `新增`【编辑器】数学笔记-公式对话框增加目录
- `新增`【编辑器】编辑器标签栏右键增加预览切换
- `新增`【插件】新增快捷键：Ctrl/Alt + Q（预览），Ctrl/Alt + P（打印）
- `新增`【设置】支持更加细致的文件名自定义
- `重要更新`【编辑器】新增markdown模板，在创建markdown笔记的时候，根据名字正则匹配markdown模板

## 2.1.1

> 2024-04-30

新增
【`编辑器`】表格笔记新增排序和过滤

## 2.1.0

> 2024-04-29

- `重d要更新`【编辑器】新增表格笔记
- `更新`【待办】日历布局新增已完成

此次主要新增了一个表格笔记，可以记录一些二维数据，并且配合自定义列，还可以设置列属性。表格笔记还属于预览

## 2.0.2

> 2024-04-24

- `新增`【编辑器】标签页新增右键菜单，可以关闭当前标签页、关闭其他标签页、关闭全部标签页，还可以修改、删除当前标签页的笔记
- `更新`【备份】修复备份路径错误的问题

新增的标签页右键菜单，不仅可以快速对标签页进行操作，还可以对当前标签页的笔记进行操作

## 2.0.1

> 2024-04-18

- `新增`【编辑器】AI问答新增问答提示词，可以快速输入相同的问题
- `更新`【工具】搜索内容升级，现在可以在markdown、富文本、代码笔记和思维导图中搜索内容了

首页新增快捷键Ctrl/Alt+Shift+F进行快速内容搜索，可以以弹窗的形式进行搜索

## 2.0.0

> 2024-04-06

- `新增`【编辑器】新增主体与插件

此处新增了主题与插件，可以自定义主题，自己修改markdown预览样式。也可以自己新增markdown菜单，实现自定义功能，比如文字替换、插入自定义内容等等。主题与插件的使用方法请查看文档

## 1.9.8

> 2024-04-01

- `更新`【编辑器】delete删除快捷键改为：（ctrl/alt + Delete）
- `更新`【富文本】富文本现在上传图片会将图片转为base64存在笔记中，但由于笔记最大1m，请谨慎使用
- `新增`【富文本】富文本导出新增Word格式

## 1.9.7

> 2024-03-29

- `更新`【编辑器】现在可以在设置中设置，新建笔记时是否自动根据规则命名，如果选择否，则在创建笔记时需要手动命名。
- `更新`【待办】在卡片布局和日历布局中，左键点击待办是查看详情，右键点击待办才是编辑
- `新增`【插件】新增两个快捷键：（ctrl/alt + n）=> 新建笔记，Delete => 删除当前笔记
- `更新`【画板】新增箭头、笔记，修复实线，虚线，文字模式不是很稳定

## 1.9.6

> 2024-03-27

- `重要更新`【markdown】现在markdown笔记的右上角单独markdown文件导出，如果笔记中含有存放在utools中的图片，导出的时候会自动将图片进行解析，之后会下载一个包含图片的压缩包。
- `新增`【编辑器】现在可以记住侧边栏展开的目录了
- `新增`【富文本】由于富文本本身的问题，导致图片无法进行渲染，目前采取折中方案，会将图片保存到本地磁盘，以本地文件形式加载，但是这样图片就没办法进行utools同步了。
- `修复`【富文本】修复了富文本中链接无法打开的问题。
- `修复`【markdown】修复了暗黑模式下，目录颜色问题。
- `优化`【插件】一些细节样式优化

## 1.9.5

> 2024-03-26

- `新增`【AI】增加你问我答，可以根据笔记进行提问
- `修复`【待办】修复卡片布局和日历布局中，布局错位问题
- `优化`【待办】默认布局增加设置

## 1.9.4

> 2024-03-24

- `新增`【编辑器】加了个AI问答的功能，但需要自己配置api和token
- `优化`【编辑器】插入图片时，自动拼接#100%

## 1.9.3

> 2024-03-21

- `新增`【思维导图】新增右键菜单，如果存在链接，可以在菜单中打开链接
- `新增`【思维导图】节点可拖拽
- `新增`【待办】待办中预览关联的笔记，可以直接点击编辑接口进行跳转标记

## 1.9.2

> 2024-03-15

- `新增`【笔记】新增画板
- `新增`【待办】新增模板导出，可以自定义导出格式
- `新增`【markdown笔记】支持关联笔记
- `新增`【思维导图】支持插入图标
- `新增`【思维导图】标签共享，可以相互引用
- `新增`【编辑器】支持笔记移动和笔记批量移动
- `修复`【编辑器】修复从预览模式切换为编辑模式，工具栏重置问题
- `更新`【编辑器】已删除表格笔记

已删除表格笔记，如果还没有迁移的，可以下载1.9.2之前的版本，将数据保存

## 1.9.1

> 2024-03-14

- `修复`【待办】只有待办状态才显示置顶
- `修复`【待办】默认视图优化，不会因为滚动导致工具栏丢失
- `修复`【编辑器】点击文件夹，如果已展开则关闭

下个版本将会彻底删除表格笔记，大家注意数据迁移！！！

## 1.9.0

> 2024-03-13

- `重要更新`【待办】新增日历布局
- `修复`【笔记】修复了笔记样式错误问题

此次版本新增了日历布局，但是自我感觉操作不是很流畅。我是一般只使用卡片布局，很少使用日历布局的。如果有更多的想法或更好的建议，可以去兔小巢，如果可能的话，有图片标注一下就更好了。

## 1.8.0

> 2024-03-10

- `重要更新`【待办】新增卡片布局，卡片布局更加直观，操作更加方便
- `重要更新`【笔记】笔记导入全新改版，导入方式更加直观，更加方便
- `新增`【思维导图】新增导入功能，新增关联线，新增布局和主题设置
- `新增`【表格笔记】保存内容需要手动保存，预览模式无法保存内容
- `新增`【笔记】markdown编辑模式增加仅预览选项
- `新增`【笔记】新增批量删除的功能，支持删除文件夹下全部笔记
- `新增`【笔记】新增清空回收站的功能
- `新增`【笔记】支持全选功能，可以批量删除
- `新增`【设置】增加待办中点击关联笔记跳转方式，可以设置直接侧边预览
- `新增`【待办】可以直接删除已完成的待办
- `新增`【待办】新增待办进度条，显示清单中待办完成进度

此次重点更新待办的卡片视图，显示更加直观。新增待办进度条，显示清单中待办完成进度。之后的版本中会删除掉表格笔记，请大家不要使用。

## 1.7.1

> 2024-03-06

- `新增`【笔记】新增思维导图
- `新增`【笔记】增加排序功能
- `修复`【笔记】修复导出无效问题
- `修复`【笔记】多个富文本编辑器无法使用问题
- `优化`【笔记】选中笔记时，自动展开文件夹
- `优化`【笔记】点击文件夹展开文件夹
- `优化`【笔记】思维导图增加快捷键

## 1.6.0

> 2024-02-29

- `新增`【笔记】新增表格笔记
- `新增`【笔记】新增标签栏，可以同时编辑多个笔记

## 1.5.4

> 2024-02-28

- `更新`【空间】去除空间功能，空间功能已下线，已合并到新的插件【卡片笔记】中，可以在设置中导出空间数据，在卡片笔记中导入数据。
- `优化`【设置】优化设置页面，备份移动到【更多】中

## 1.5.3

> 2024-01-24

- `更新`【设置】增加编辑器编辑模式设置
- `更新`【动态】优化颜色秀按时
- `更新`【编辑器】优化富文本编辑器的显示问题，修复了当宽度太小导致部分内容不显示问题
- `更新`【编辑器】优化编辑器目录显示问题

## 1.5.2

> 2024-01-19

- `更新`【设置】优化兰空图床上传
- `更新`【插件】升级依赖，主要升级了markdown编辑器的依赖，修复了一些已知问题

## 1.5.0

> 2023-11-20

- `新增`【工作空间】新增本地工作空间
- `修复`【设置】修复备份异常的问题

之前的草稿箱现在升级为工作空间，有一部分用户在本地维护了一套文件系统，比如hexo或者vuepress之类的静态网站，在使用本插件时会经常导入导出文件，给一部分用户造成了不变，此次的工作空间可以直接选择本地目录进行编辑，不仅体验了更加高效的编辑，也将内容维护在本地。第一个版本只出了本地工作空间，下个版本会增加gitee的工作空间。如果是图片策略是内部实现，则会上传到笔记所在目录的image目录下。

## 1.4.2

> 2023-11-16

- `新增`【todo】增加导出类型选择
- `新增`【todo】新增待办时增加优先级选择
- `更新`【编辑器】优化导入导出，可以在文件夹层面上导入导出
- `更新`【todo】优化自动保存，优化加载动画
- `优化`【todo】优化编辑器内边距
- `优化`【todo】细节优化，去除无效基础设置
- `修复`【编辑器】修复从插件【网页剪报】导入异常的问题

## 1.4.1

> 2023-11-08

- `新增`【编辑器】新增全功能兰空图床，建议使用兰空图床存储图片
- `新增`【todo】增加图片上传
- `新增`【todo】新增待办导出
- `新增`【todo】新增自定义是否收起选项
- `新增`【插件】新增自定义新笔记名称、自定义默认代码拓展名
- `更新`【编辑器】彻底删除editor.js

## 1.4.0

> 2023-10-28

- `新增`【编辑器】优化主程序推送，防止文档数量太多无法展示
- `新增`【编辑器】修复markdown第一次展示的时候，预览超出的问题
- `新增`【编辑器】新增回收站功能，删除笔记不会立即删除，而是会进入回收站，在回收站中可以强制删除。
- `新增`【编辑器】新增批量删除功能
- `新增`【插件】新增主题设置，可以设置背景图片，可以切换暗黑/白天模式，也可以跟随系统。
- `新增`【插件】优化图片上传，下个版本会加入兰空图床，不是很建议将图片上传到utools中。
- `更新`【编辑器】富文本编辑器变为wangEditor
- `更新`【编辑器】设置里面可以设置分类

旧的富文本编辑器的内容还会保留一个版本，请大家及时迁移富文本编辑器的内容，下个版本将彻底删除，届时内容将无法访问。

## 1.3.2

> 2023-10-23

- `新增`【todo】待办自身也可以隐藏
- `新增`【编辑器】关联笔记使用树形结构
- `新增`【编辑器】截图是，如果未分离插件，插件将会隐藏
- `新增`【编辑器】搜索笔记内容，可以在全部markdown笔记中从内容搜索关键字，只会显示每个笔记的第一个出现关键字位置，位置在第五个菜单中
- `更新`【编辑器】修复富文本上传图片错误
- `更新`【插件】删除自定义存储位置选项

## 1.3.1

> 2023-10-16

- `新增`【todo】待办可以关联笔记
- `新增`【编辑器】新增目录、字数统计、创建修改时间
- `新增`【编辑器】markdown编辑器增加盘古之白插件，可以在中英文之间增加空格
- `更新`【编辑器】未选择笔记不能编辑
- `修复`【编辑器】修复文件夹无法移动，文件夹、笔记无法移动到根目录
- `修复`【todo】待办标题太长进行隐藏，显示省略号
- `修复`【todo】修复待办文件夹、清单无法移动到根目录BUG

未来将逐步删除原先的默认主页功能，最终会全部删除，建议使用编辑器主页。

## 1.3.0

> 2023-10-16

- `新增`【笔记】增加导入功能，支持导入markdown文件、docx文件、zip文件
- `新增`【笔记】支持导出功能，可以将笔记导出为zip压缩包，并保留目录结构
- `新增`【笔记】编辑器增加截图功能，可以截图并粘贴到编辑器中
- `新增`【笔记】删除了之前以预览为主的主页，并删除了单独的编辑器和单独的预览页
- `新增`【笔记】修改markdown编辑器引擎为cherry-markdown，支持的语法更多，编辑器更强大
- `新增`【笔记】新增临时markdown编辑器，可以作为草稿使用，此编辑器内容自动保存。此编辑器可以作为发布到支持markdown博客平台的编辑器，不用担心编写的笔记丢失。
- `新增`【笔记】新增富文本编辑器，新建笔记时，可以选择富文本编辑器，此编辑器基于块编辑，功能十分的强大，支持的样式也更多，未来也会将更多的功能在此编辑器上实现
- `新增`【笔记】新增代码编辑器，使用VSCode同款编辑器Monaco Editor，支持常见语法高亮。可以记录代码片段
- `新增`【TODO】新增快速访问，可以将待办清单新增为关键字，快速访问待办清单
- `新增`【TODO】待办支持放弃并且支持填写放弃原因，新增分组：已放弃
- `新增`【TODO】待办描述编辑器增加工具栏，增加返回顶部功能
- `修复`【分类】修复分类不能重命名问题
- `更新`【TODO】优化待办项完成消息内容

cherry-markdown具体语法可前往临时编辑器查看。功能十分强大。按ctrl+f可进行搜索，再次按ctrl+f可进行替换

## 1.2.1

> 2023-10-12

- `新增`【笔记】新增笔记自动保存功能，再也不用担心笔记丢失了
- `新增`【笔记】新增笔记导入功能，支持导入markdown文件
- `新增`【TODO】增加待办排序，待办新增标签功能与创建时间现实
- `修复`【TODO】空内容不允许创建待办
- `更新`【笔记】预览优化，布局与编辑布局保持一致

未来将逐步删除原先的默认主页功能，最终会全部删除，建议使用编辑器主页。

## 1.2.0

> 2023-10-11

- `新增`新增待办功能
- `更新`笔记编辑变更
- `修复`修复从分类图进入笔记无法返回的bug
- `更新`优化数据获取，在数据获取时增加全局加载框。

## 1.1.0

> 2023-10-08

- `新增`增加多种存储方式；现在数据可以存到alist中，不依赖utools就可以实现同步，未来将新增本地模式和webdav。
- `新增`新增编辑器模式的主页；这样主页可以直接编辑笔记，并且支持目录
- `新增`分类升级；现在的分类为多级分类，可以创建无限多的子分类
- `新增`新增文件备份功能

已知问题：在做数据迁移时，一般会将utools数据执行文件备份将数据导出，再使用alist服务器，进行备份恢复，如果保存，请先删除alist中目标文件夹下全部的json文件，主要是index.js文件，之后重新执行恢复即可。如果恢复备份完没有数据，请完全退出插件，重新进入就好了

## 1.0.8

> 2023-09-17

- `修复`修复坚果云WebDAV备份错误问题

## 1.0.7

> 2023-09-07

- `新增`增加自定义图床，可以调用插件【图床】

## 1.0.6

> 2023-09-05

- `新增`新增WebDAV备份设置，可以将数据备份到WebDAV，之后进行恢复
- `新增`动态新增分享功能，可以导出为图片进行分享
- `新增`图：新增点击笔记进行打开，点击分类、标签跳转搜索
- `新增`新增控制台，用于查找异常错误
- `更新`关键字变为自定义开启或关闭

## 1.0.5

> 2023-09-01

- `新增`新增代码是否换行功能

## 1.0.4

> 2023-08-27

- `更新`优化标记逻辑，增加是否启用标记，启用标记后无法进行复制
- `新增`笔记界面增加跳转到编辑页面按钮，优化笔记界面按钮

## 1.0.3

> 2023-08-27

- `新增`可以在搜索面板中直接搜索笔记，但需要设置搜索面板为聚合搜索，并在插件应用设置中设置为：允许推送内容到搜索面板
- `新增`可以在笔记内进行关键字搜索

## 1.0.2

> 2023-08-27

- `新增`新增图片上传的功能；在编写笔记时，可以放大插件点击上面工具栏最后一项进行文件上传，也可以直接粘贴图片到编辑器进行上传，此处感谢插件【超级Markdown】
- `新增`新增附件管理；在更多中新增附件管理，对上传的图片进行管理
- `新增`新增笔记标记功能

## 1.0.1

> 2023-08-27

- `新增`增加笔记来源地址，列表页点击跳转
- `新增`增加文件导出功能
- `新增`保存笔记后会自动跳转列表页
- `新增`优化目录
- `新增`分类增加排序
- `新增`编辑器代码主题优化，使用设置的主题

## 1.0.0

> 2023-08-27

- `新增`实现笔记新增、编辑和浏览
- `新增`提供动态进行灵感保存
- `新增`使用关系图进行展示