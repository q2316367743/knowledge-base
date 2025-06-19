# 知识库

✏️ 极简设计 · 全能笔记 · 高效待办

> —— 打造属于你的最强大的知识管理中枢

## 🌟 核心亮点

- 多模态笔记整合：支持富文本、Markdown、代码、表格、思维导图、流程图六大创作模式
- 代码笔记直接运行^1：支持50+语言高亮，内置代码执行引擎，实时调试脚本无需切出界面
- 智能剪藏功能：一键将网络文章转换为Markdown格式并保存到知识库
- 全局搜索与回收站：快速定位笔记内容，误删文件也能轻松恢复
- AI智能助手：基于笔记内容快速提问，获取精准答案

## 📚 笔记功能

### 基础笔记

- 富文本笔记：支持图文混排、字体样式、段落格式等
- Markdown笔记：简洁高效的写作体验，支持实时预览
- 代码笔记：支持代码高亮与直接运行，方便管理脚本
- 表格笔记：快速创建结构化数据，支持基础计算
- 思维导图：可视化梳理思路，节点自由拖拽
- 流程图：简单易用的流程图绘制工具

### 进阶笔记

- 超级笔记：一个笔记即可整合富文本、Markdown、代码、表格、思维导图、流程图六大模式，打破创作边界。
- 加密笔记：加密笔记采用bcrypt对您的密码进行加密，使用aes-256-cbc对您的笔记内容进行加密。如果您忘记了您的密码，则无法对笔记内容进行恢复，请一定要记住您的密码，请一定要记住您的密码，请一定要记住您的密码。
- 闪卡笔记

## ✅ 待办功能

- 支持多种布局：默认列表、看板（Kanban）、日历视图
- 简洁高效：快速添加、编辑任务，支持任务状态标记
- 智能提醒：重要事项不再遗漏

## 使用

### uTools

前往[插件市场](https://www.u-tools.cn/plugins/detail/%E7%9F%A5%E8%AF%86%E5%BA%93/)搜索`「知识库」`下载安装即可使用。

### docker

> ! 暂时还未推送docker仓库中，还有部分bug未解决，敬请期待

> 推荐使用docker compose进行部署

```yaml
version: '3.9'
services:
  knowledge-base:
    image: q2316367743/knowledge-base:2.7.2
    logging:
      options:
        max-size: 1g
    restart: always
    volumes:
      - '/vol1/1000/docker/knowledge-base/data:/app/knowledge-base/data'
      - '/vol1/1000/docker/knowledge-base/file:/app/knowledge-base/file'
    ports:
      - '13456:13456'
```

**说明：**
- `/app/knowledge-base/data`: 数据库存放目录
- `/app/knowledge-base/file`: 附件存放目录

### 桌面客户端

> 还未实现，已经使用tauri打包了基础版本，等web版本兼容性解决完毕再推出桌面客户端版本

> ^1: 只有uTools版本支持