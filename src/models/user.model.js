import DataService from "../services/database.service";
import EncryptService from "../services/encrypt.service";
import { Provider, Dependency } from "@ritley/decorators";

export {
  UserValidationError,
  UserMailInUseError,
  UserInsufficientPermError
}

@Provider.factory
@Dependency("database", DataService)
@Dependency("encrypt", EncryptService)
export default class UserModel {

  static userPublicPredicate = collection => collection.map(({ pass, ...user }) => user);

  static removeForbiddenKeys = ({ id, pass, ...rest }) => rest;

  validate(payload) {
    const requiredProps = ["name", "pass", "mail"];
    const props = Object.keys(payload);
    if(requiredProps.every(prop => props.includes(prop))) {
      return Promise.resolve();
    } else {
      return Promise.reject(new UserValidationError);
    }
  }

  create(payload) {
    const pass = this.encrypt.encode(payload.pass);
    return this.database.create("users", { ...payload, pass });
  }

  isUnique({ mail }) {
    return new Promise((resolve, reject) =>
      this.database.exists("users", { mail }).then(() => reject(new UserMailInUseError), resolve));
  }

  searchBy(predicate) {
    return this.readUsers(predicate).then(UserModel.userPublicPredicate);
  }

  readUsers(predicate) {
    if(predicate) {
      return this.database.filter("users", predicate);
    } else {
      return this.database.read("users");
    }
  }

  isAllowedToEdit(requestedUserUid, currentUserUid) {
    if(requestedUserUid === currentUserUid) {
      return Promise.resolve();
    } else {
      return Promise.reject(new UserInsufficientPermError);
    }
  }

  update(uid, payload) {
    return this.database.update("users", { uid }, UserModel.removeForbiddenKeys(payload));
  }

  async postUser(payload) {
    await this.validate(payload);
    await this.isUnique(payload);
    return this.create(payload);
  }

  async putUser(requestedUserUid, currentUserUid, payload) {
    await this.isAllowedToEdit(requestedUserUid, currentUserUid);
    return this.update(requestedUserUid, payload);
  }
}

class UserValidationError extends Error {
  constructor() {
    super("missing fields, required: [name, mail, pass]")
  }
}

class UserMailInUseError extends Error {
  constructor() {
    super("mail is already taken, try another one")
  }
}

class UserInsufficientPermError extends Error {
  constructor() {
    super("you don't have permissions to perform this action")
  }
}
