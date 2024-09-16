import { sqlite } from "./database/db.ts";
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
    }:${port}`,
  );
});

const interfaces = Deno.networkInterfaces();

function getIPAddress() {
  for (const net of interfaces) {
    if (net.family === "IPv4" && !net.address.includes("127.0.0.1")) {
      return net.address;
    }
  }
  return "0.0.0.0";
}

const ip = getIPAddress();
console.log(`Your IP address is: ${ip}`);

await app.listen({ port: 8000, hostname: ip });

// 处理进程终止信号并关闭数据库连接
function cleanUp() {
  console.log("Closing the database connection...");
  sqlite.close()
  console.log("Database connection closed.");
  Deno.exit();
}

// 捕捉 SIGINT 和 SIGTERM 信号
Deno.addSignalListener("SIGINT", cleanUp);
Deno.addSignalListener("SIGTERM", cleanUp);
