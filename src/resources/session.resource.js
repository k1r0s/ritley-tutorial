import { AbstractResource } from "@ritley/core";
import SessionModel, { SessionInvalidCredentialsError } from "../models/session.model";
import ParseReqBody from "../decorators/req-body-json.decorator";

import {
  Default,
  MethodNotAllowed,
  Created,
  Throws,
  Unauthorized,
  Dependency
} from "@ritley/decorators";


@Dependency("sessionModel", SessionModel)
export default class SessionResource extends AbstractResource {
  @Default(MethodNotAllowed) get() {}
  @Default(MethodNotAllowed) put() {}
  @Default(MethodNotAllowed) delete() {}

  constructor() {
    super("/sessions");
  }

  @Throws(SessionInvalidCredentialsError, Unauthorized)
  @ParseReqBody
  @Default(Created)
  post(req, res, payload) {
    return this.sessionModel.postSession(payload);
  }
}
