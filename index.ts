import express from "express";
import {log, loggerMiddleware} from "./log";
import {catchError, errorResponseMiddleware} from "./error-handler";
import {authMiddleware} from "./auth";

const app = express();
const port = 3000;

async function doSomething() {
  log.info("Doing something with context");
}

function addRequestContextMiddleware() {
  return async (req: any, res: any, next: any) => {
    const timingStart = Date.now()
    log.setBindings({req: {url: req.url, userAgent: req.get("user-agent")}})
    log.info("request::start")
    next()

    log.info({
      res: {
        statusCode: res.statusCode,
        headers: res.headers,
        timing: Date.now() - timingStart + 'ms'
      }
    }, "request::complete");
  };
}

app.use(addRequestContextMiddleware());
app.use(authMiddleware())
app.use(loggerMiddleware);

app.get(
  "/",
  catchError(async (req: any, res: any, next: any) => {
    log.info({bart: "oh boy"}, "Do something.")
    await doSomething();
    res.sendStatus(200)
  }),
);

app.use(errorResponseMiddleware);

app.listen(port, () => {
  console.log(`Sandbox listening on port ${port}.`);
});
