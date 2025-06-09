# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.8 AS base

# 工作目录
WORKDIR /app/knowledge-base

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock tsconfig.json src /temp/prod/
RUN cd /temp/prod  && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/knowledge-base/dist/index.js .
COPY --from=prerelease /app/knowledge-base/package.json .

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
ENTRYPOINT [ "bun", "run", "/app/knowledge-base/index.js" ]
