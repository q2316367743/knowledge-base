//https://nitro.unjs.io/config
export default defineNitroConfig({
  compatibilityDate: "2025-06-23",
  srcDir: "server",
  experimental: {
    tasks: true,
  },
  scheduledTasks: {
    "0 0/10 * * * ?": ["file:auto-remove-temp"],
  },
});
