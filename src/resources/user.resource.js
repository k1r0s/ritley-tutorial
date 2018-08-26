import { AbstractResource } from "@ritley/core";
import UserModel, { UserValidationError, UserMailInUseError, UserInsufficientPermError } from "../models/user.model";
import SessionModel, { SessionNotCreatedError, SessionExpiredError } from "../models/session.model";
import ParseReqBody from "../decorators/req-body-json.decorator";
import ValidateSession from "../decorators/validate-session.decorator";


import {
  ReqTransformQuery,
  Dependency,
  Default,
  Throws,
  BadRequest,
  Conflict,
  Created,
  Forbidden,
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

  @Throws(UserInsufficientPermError, Forbidden)
  @Default(Ok)
  @ReqTransformQuery
  @ValidateSession
  @ParseReqBody
  put(req, res, session, payload) {
    return this.userModel.putUser(req.query.uid, session.userUid, payload);
  }

  @Default(Ok)
  @ValidateSession
  get(req) {
    return this.userModel.searchBy();
  }
}
