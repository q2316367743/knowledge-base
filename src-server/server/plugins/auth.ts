export default defineNitroPlugin((nitro) => {
  // nitro.hooks.hook("request", async (event) => {
  //   const url = getRequestURL(event);
  //   if (url.pathname.startsWith("/api")) {
  //     const token = getRequestHeader(event, "token");
  //     if (!token) {
  //       sendError(
  //         event,
  //         createError({
  //           statusCode: 401,
  //           message: "未授权",
  //         })
  //       );
  //       return;
  //     }
  //     // 校验token是否正常

  //   }
  // });
});
