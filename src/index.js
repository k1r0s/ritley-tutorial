import { setAdapter } from "@ritley/core";
import Adapter from "@ritley/standalone-adapter";

import SessionResource from "./resources/session.resource"
import UserResource from "./resources/user.resource"

setAdapter(Adapter, {
  "port": 8080
});

new SessionResource;
new UserResource;
