import {AsyncLocalStorage} from "node:async_hooks";
import pino from "pino";
import {randomUUID} from "node:crypto";

export const asyncLocalStorage = new AsyncLocalStorage<pino.Logger>();

const logger = pino({name: "homer"});

export const log = new Proxy(logger, {
  get: function (target, property, receiver) {
    const child = asyncLocalStorage.getStore()
    return Reflect.get(child || target, property, receiver);
  },
});

export const loggerMiddleware = async (req: any, res: any, next: any): Promise<void> => {
  const childLogger = logger.child({
    context: {traceId: randomUUID()},
  });
  await asyncLocalStorage.run(childLogger, async () => {
    next()
  });
};
