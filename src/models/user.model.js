import DataService from "../services/database.service";
import EncryptService from "../services/encrypt.service";
import { Provider, Dependency } from "@ritley/decorators";

@Provider.factory
@Dependency("database", DataService)
@Dependency("encrypt", EncryptService)
export default class UserModel {

  static userPublicPredicate = collection => collection.map(({ pass, ...user }) => ({
    ...user
  }))

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

  update(uid, { mail, name }) {
    return this.database.update("users", { uid }, { mail, name });
  }

  postUser(payload) {
    return this.validate(payload).then(() => this.isUnique(payload).then(() => this.create(payload)));
  }
}

export class UserValidationError extends Error {
  constructor() {
    super("missing fields, required: [name, mail, pass]")
  }
}

export class UserMailInUseError extends Error {
  constructor() {
    super("mail is already taken, try another one")
  }
}
