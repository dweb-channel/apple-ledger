import db from "./database/db.ts";
import { Application, factory } from "./deps.ts";
import authRoutes from "./src/routers/auth.ts";
import baseRoutes from "./src/routers/base.ts";

const app = new Application();

app.use(factory());
app.use(baseRoutes.routes());
app.use(baseRoutes.allowedMethods());

app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());

app.addEventListener("error", (evt) => {
  // Will log the thrown error to the console.
  console.log(evt.error);
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`
  );
});

await app.listen({ port: 8000, hostname: "192.168.1.99" });

// 处理进程终止信号并关闭数据库连接
function cleanUp() {
  console.log("Closing the database connection...");
  db.close();
  console.log("Database connection closed.");
  Deno.exit();
}

// 捕捉 SIGINT 和 SIGTERM 信号
Deno.addSignalListener("SIGINT", cleanUp);
Deno.addSignalListener("SIGTERM", cleanUp);
