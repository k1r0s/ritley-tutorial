import SessionModel from "../models/session.model";

import { beforeMethod } from "kaop-ts";

import {
  Unauthorized
} from "@ritley/decorators";

function authSessionExists(sessionModel) {
  return function(meta) {
    const [req, res] = meta.args;
    const uid = req.headers["x-session"];
    sessionModel.sessionExists({ uid }).then(
      meta.commit,
      e => Unauthorized(res, e.message)
    )
  }
}

function authSessionRevalidate(sessionModel) {
  return function(meta) {
    const [req, res, session] = meta.args;
    sessionModel.revalidate(session).then(
      () => meta.commit(),
      e => Unauthorized(res, e.message)
    )
  }
}

const sessionModel = SessionModel();

export default beforeMethod(
  authSessionExists(sessionModel),
  authSessionRevalidate(sessionModel)
)
