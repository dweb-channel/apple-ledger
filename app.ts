import { Application } from "jsr:@oak/oak/application";
import { factory } from "jsr:@oak/oak/etag";
import { baseRouter } from "./src/router/base.ts";
const app = new Application();


app.use(factory())
app.use(baseRouter.routes());
app.use(baseRouter.allowedMethods());

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


await app.listen({ port: 8000,hostname:"192.168.1.99" });