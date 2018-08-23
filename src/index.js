import { setAdapter, AbstractResource } from "@ritley/core";
import Adapter from "@ritley/standalone-adapter";
import DataBase from "./database.service";

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
  constructor(_database) {
    super("/users");
    this.database = _database;
  }

  post(req, res) {
    this.database.create("users", { name: "Jimmy Jazz" }).then(user => {
      res.statusCode = 200;
      res.end(JSON.stringify(user));
    });
  }
}

new SessionResource;
new UserResource(new DataBase);
