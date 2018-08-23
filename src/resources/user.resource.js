import { AbstractResource } from "@ritley/core";
import UserModel from "../models/user.model";

import { Dependency, ReqTransformBodyAsync } from "@ritley/decorators";

@Dependency("userModel", UserModel)
export default class UserResource extends AbstractResource {
  constructor() {
    super("/users");
  }

  @ReqTransformBodyAsync
  async post(req, res) {
    const body = await req.body;
    const payload = body.toJSON();
    await this.userModel.validate(payload);
    await this.userModel.isUnique(payload);
    const user = await this.userModel.create(payload);
    res.statusCode = 200;
    res.end(JSON.stringify(user));
  }
}
