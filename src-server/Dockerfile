# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.15

# 工作目录
WORKDIR /app/knowledge-base

COPY src ./src
COPY public ./public
COPY package.json ./
COPY bun.lock ./
COPY tsconfig.json ./

# 安装依赖
RUN bun install --production --frozen-lockfile --registry=https://mirrors.cloud.tencent.com/npm/

# 挂载目录
## 数据库
VOLUME /app/knowledge-base/data
## 附件
VOLUME /app/knowledge-base/file
## 支付信息
VOLUME /app/knowledge-base/payment

# 暴露端口
EXPOSE 3000/tcp

ENV NODE_ENV production

# 启动命令
ENTRYPOINT [ "bun", "run", "/app/knowledge-base/src/index.ts" ]
