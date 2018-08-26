import { beforeMethod } from "kaop-ts";

import {
  BadRequest,
  ReqTransformBodyAsync
} from "@ritley/decorators";

function parseRequestBody(meta) {
  const [req, res] = meta.args;
  req.body.then(body => {
    try {
      const payload = body.toJSON();
      meta.commit(payload);
    } catch (e) {
      BadRequest(res, e.message);
    }
  })
}

export default beforeMethod(
  ...ReqTransformBodyAsync.advices(),
  parseRequestBody
)
