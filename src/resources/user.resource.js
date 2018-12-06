import { AbstractResource } from "@ritley/core";
import UserModel, { UserValidationError, UserMailInUseError, UserInsufficientPermError } from "../models/user.model";
import SessionModel, { SessionNotCreatedError, SessionExpiredError } from "../models/session.model";
import QueryService from "../services/query.service";
import ParseReqBody from "../decorators/req-body-json.decorator";
import ValidateSession from "../decorators/validate-session.decorator";


import {
  ReqTransformQuery,
  Dependency,
  InternalServerError,
  Default,
  Throws,
  BadRequest,
  Conflict,
  Created,
  Forbidden,
  Ok,
  MethodNotAllowed
} from "@ritley/decorators";

@Dependency("userModel", UserModel)
@Dependency("query", QueryService)
export default class UserResource extends AbstractResource {
  @Default(MethodNotAllowed) delete() {}

  constructor() {
    super("/users");
  }

  @Throws(UserValidationError, BadRequest)
  @Throws(UserMailInUseError, Conflict)
  @ParseReqBody
  @Default(Created)
  post(req, res, payload) {
    return this.userModel.postUser(payload);
  }

  @Throws(UserInsufficientPermError, Forbidden)
  @ReqTransformQuery
  @ValidateSession
  @ParseReqBody
  @Default(Ok)
  put(req, res, session, payload) {
    return this.userModel.putUser(req.query.uid, session.userUid, payload);
  }

  @Default(Ok)
  @ValidateSession
  @ReqTransformQuery
  get(req) {
    const predicate = req.query.filter && this.query.getFilter(req.query.filter);
    return this.userModel.searchBy(predicate);
  }
}
