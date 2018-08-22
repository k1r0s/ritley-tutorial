import { setAdapter, AbstractResource } from "@ritley/core";
import Adapter from "@ritley/standalone-adapter";

setAdapter(Adapter, {
  "port": 8080
});

class SessionResource extends AbstractResource {
  constructor() {
    super("/sessions");
  }

  get(req, res) {
    res.statusCode = 200;
    res.end("Hello from sessions!");
  }
}

class UserResource extends AbstractResource {
  constructor() {
    super("/users");
  }

  get(req, res) {
    res.statusCode = 200;
    res.end("Hello from users!");
  }
}

new SessionResource;
new UserResource;
