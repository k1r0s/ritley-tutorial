import { AbstractResource } from "@ritley/core";

export default class SessionResource extends AbstractResource {
  constructor() {
    super("/sessions");
  }

  get(req, res) {
    res.statusCode = 200;
    res.end("Hello from sessions!");
  }
}
