import DatabaseService from "../services/database.service";
import EncryptService from "../services/encrypt.service";
import { Provider, Dependency } from "@ritley/decorators";

@Provider.factory
@Dependency("database", DatabaseService)
@Dependency("encrypt", EncryptService)
export default class SessionModel {

  static SESSION_MS_EXPIRATION = 1800000;

  static newExpirationDate() {
    return Date.now() + this.SESSION_MS_EXPIRATION;
  }

  static buildSession({ uid, name, ...user }) {
    return {
      expiration: this.newExpirationDate(),
      userUid: uid
    }
  }

  static updateSession({ expiration, ...session }) {
    return {
      expiration: this.newExpirationDate(),
      ...session
    }
  }

  static hasSessionExpired = session => session.expiration < Date.now();

  validateCredentials({ mail, pass }) {
    return new Promise((resolve, reject) => {
      this.database
        .one("users", { mail })
        .then(user => {
          if(user && this.encrypt.decode(user.pass) === pass) resolve(user);
          else reject(new SessionInvalidCredentialsError);
        })
    });
  }

  upsertSession(user) {
    return new Promise(resolve => this.database.exists("sessions", { userUid: user.uid })
      .then(session => this.updateSession(session).then(resolve),
        () => this.createSession(user)).then(resolve));
  }

  createSession(user) {
    return this.database.create("sessions", SessionModel.buildSession(user));
  }

  updateSession(session) {
    return this.database.update("sessions", { uid: session.uid }, SessionModel.updateSession(session))
  }

  revalidate(session) {
    if(SessionModel.hasSessionExpired(session)) {
      this.database.remove("sessions", session.uid);
      return Promise.reject(new SessionExpiredError);
    } else {
      return this.updateSession(session);
    }
  }

  sessionExists(criteria) {
    return new Promise((resolve, reject) =>
      this.database.exists("sessions", criteria).then(resolve, () => reject(new SessionNotCreatedError)));
  }
}

export class SessionNotCreatedError extends Error {
  constructor() {
    super("you need to create a session to perform this action")
  }
}

export class SessionInvalidCredentialsError extends Error {
  constructor() {
    super("your credentials are invalid")
  }
}

export class SessionExpiredError extends Error {
  constructor() {
    super("your session has expired")
  }
}
