import { AbstractResource } from "@ritley/core";
import SessionModel, { SessionInvalidCredentialsError } from "../models/session.model";

import {
  Default,
  MethodNotAllowed,
  Created,
  Throws,
  Unauthorized,
  BadRequest,
  Dependency,
  ReqTransformBodyAsync
} from "@ritley/decorators";


@Dependency("sessionModel", SessionModel)
export default class SessionResource extends AbstractResource {
  @Default(MethodNotAllowed) get() {}
  @Default(MethodNotAllowed) put() {}
  @Default(MethodNotAllowed) delete() {}

  static URI = "/sessions";

  constructor() {
    super(SessionResource.URI);
  }

  @Throws(SyntaxError, BadRequest)
  @Throws(SessionInvalidCredentialsError, Unauthorized)
  @Default(Created)
  @ReqTransformBodyAsync
  async post(req) {
    const body = await req.body;
    const payload = body.toJSON();
    const user = await this.sessionModel.validateCredentials(payload);
    return this.sessionModel.upsertSession(user);
  }
}
