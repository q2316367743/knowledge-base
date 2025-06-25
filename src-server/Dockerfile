# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.15

# 工作目录
WORKDIR /app/knowledge-base

# 复制打包文件
COPY .output/ runtime/

# 安装依赖
RUN bun install --production --frozen-lockfile --registry=https://mirrors.tencent.com/npm/

# 挂载目录
## 数据库
VOLUME /app/knowledge-base/data
## 附件
VOLUME /app/knowledge-base/file

# 暴露端口
EXPOSE 13456/tcp

ENV NODE_ENV production
ENV PORT 13456

# 启动命令
ENTRYPOINT [ "bun", "run", "/app/knowledge-base/runtime/server/index.mjs" ]
