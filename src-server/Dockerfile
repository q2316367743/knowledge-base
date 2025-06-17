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
RUN export https_proxy=http://192.168.2.8:7897 http_proxy=http://192.168.2.8:7897 all_proxy=socks5://192.168.2.8:7897
RUN bun install --production --frozen-lockfile --registry=https://mirrors.tencent.com/npm/

# 挂载目录
## 数据库
VOLUME /app/knowledge-base/data
## 附件
VOLUME /app/knowledge-base/file

# 暴露端口
EXPOSE 3000/tcp

ENV NODE_ENV production

# 启动命令
ENTRYPOINT [ "bun", "run", "/app/knowledge-base/src/index.ts" ]
