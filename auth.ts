import {log} from "./log";

export function authMiddleware() {
  return (req: any, res: any, next: any) => {
    if (req.get('auth')) {
      log.setBindings({user: req.get('auth')})
      next()
    } else {
      log.info("No auth.")
      res.sendStatus(403)
    }
  };
}

