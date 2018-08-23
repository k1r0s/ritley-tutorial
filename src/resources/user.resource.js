import { AbstractResource } from "@ritley/core";
import DataService from "../services/database.service";

import { Dependency, ReqTransformBodySync } from "@ritley/decorators";

@Dependency("database", DataService)
export default class UserResource extends AbstractResource {
  constructor(_database) {
    super("/users");
  }

  @ReqTransformBodySync
  post(req, res) {
    const payload = req.body.toJSON();
    this.database.create("users", payload).then(user => {
      res.statusCode = 200;
      res.end(JSON.stringify(user));
    });
  }
}
