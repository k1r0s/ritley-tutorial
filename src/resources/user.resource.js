import { AbstractResource } from "@ritley/core";
import UserModel, { UserValidationError, UserMailInUseError } from "../models/user.model";
import SessionModel, { SessionNotCreatedError, SessionExpiredError } from "../models/session.model";
import ParseReqBody from "../decorators/req-body-json.decorator";
import ValidateSession from "../decorators/validate-session.decorator";


import {
  Dependency,
  Default,
  Throws,
  BadRequest,
  Conflict,
  Created,
  Ok
} from "@ritley/decorators";

@Dependency("userModel", UserModel)
export default class UserResource extends AbstractResource {
  constructor() {
    super("/users");
  }

  @Throws(UserValidationError, BadRequest)
  @Throws(UserMailInUseError, Conflict)
  @Default(Created)
  @ParseReqBody
  post(req, res, payload) {
    return this.userModel.postUser(payload);
  }

  @Default(Ok)
  @ValidateSession
  get(req) {
    return this.userModel.searchBy();
  }
}
