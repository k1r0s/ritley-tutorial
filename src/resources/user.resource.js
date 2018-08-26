import { AbstractResource } from "@ritley/core";
import UserModel, { UserValidationError, UserMailInUseError } from "../models/user.model";
import SessionModel, { SessionNotCreatedError, SessionExpiredError } from "../models/session.model";

import {
  Dependency,
  ReqTransformBodyAsync,
  Default,
  Throws,
  BadRequest,
  Conflict,
  Created,
  Ok,
  Unauthorized
} from "@ritley/decorators";

@Dependency("userModel", UserModel)
@Dependency("sessionModel", SessionModel)
export default class UserResource extends AbstractResource {
  constructor() {
    super("/users");
  }

  @Throws(SyntaxError, BadRequest)
  @Throws(UserValidationError, BadRequest)
  @Throws(UserMailInUseError, Conflict)
  @Default(Created)
  @ReqTransformBodyAsync
  async post(req) {
    const body = await req.body;
    const payload = body.toJSON();
    await this.userModel.validate(payload);
    await this.userModel.isUnique(payload);
    return this.userModel.create(payload);
  }

  @Throws(SessionNotCreatedError, Unauthorized)
  @Throws(SessionExpiredError, Unauthorized)
  @Default(Ok)
  async get(req) {
    const uid = req.headers["x-session"];
    const session = await this.sessionModel.sessionExists({ uid });
    await this.sessionModel.revalidate(session);
    return this.userModel.searchBy();
  }
}
