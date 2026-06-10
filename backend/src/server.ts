import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

async function main() {
  const app = await createApp();

  const server = app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[backend] ${env.NODE_ENV} — listening on port ${env.PORT}`);
    // eslint-disable-next-line no-console
    console.log(`[backend] allowed CORS origins: ${env.corsOrigins.join(", ") || "(none)"}`);
  });

  async function shutdown(signal: string) {
    // eslint-disable-next-line no-console
    console.log(`[backend] received ${signal}, shutting down...`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("[backend] failed to start", error);
  process.exit(1);
});
