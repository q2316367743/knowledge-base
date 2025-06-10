# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.8 AS base

# 工作目录
WORKDIR /app/knowledge-base

COPY index.js runtime/
COPY public runtime/

# 挂载目录
## 数据库
VOLUME /app/knowledge-base/data
## 附件
VOLUME /app/knowledge-base/file
## 支付信息
VOLUME /app/knowledge-base/payment

# 暴露端口
EXPOSE 3000/tcp

# 启动命令
ENTRYPOINT [ "bun", "run", "/app/knowledge-base/runtime/index.js" ]
