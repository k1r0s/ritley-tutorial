import { AbstractResource } from "@ritley/core";
import UserModel, { UserValidationError, UserMailInUseError } from "../models/user.model";

import {
  Dependency,
  ReqTransformBodyAsync,
  Default,
  Throws,
  InternalServerError,
  BadRequest,
  Conflict,
  Created
} from "@ritley/decorators";

@Dependency("userModel", UserModel)
export default class UserResource extends AbstractResource {
  constructor() {
    super("/users");
  }

  @Throws(SyntaxError, BadRequest)
  @Throws(UserValidationError, BadRequest)
  @Throws(UserMailInUseError, Conflict)
  @Default(Created)
  @ReqTransformBodyAsync
  async post(req, res) {
    const body = await req.body;
    const payload = body.toJSON();
    await this.userModel.validate(payload);
    await this.userModel.isUnique(payload);
    return this.userModel.create(payload);
  }
}
