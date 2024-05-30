import {log} from "./log";

export function catchError(fn: any) {
  return async (req: any, res: any, next: any) => {
      await fn(req, res, next).catch(next);
  };
}

export function errorResponseMiddleware(
  err: any,
  req: any,
  res: any,
  next: any,
) {
  log.error({msg: 'Error', error: err});
  res.status(500).send("Error");
}
