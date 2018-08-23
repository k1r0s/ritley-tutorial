import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";
import shortid from "shortid";
import config from "../config/database.config";
import { Provider } from "@ritley/decorators";

@Provider.singleton
export default class DataService {
  onConnected = undefined

  constructor() {
    this.onConnected = low(new FileAsync(config.path, {
      defaultValue: config.defaults
    }))
  }

  create(entity, newAttributes) {
    return this.onConnected.then(database =>
      database
      .get(entity)
      .push({ uid: shortid.generate(), ...newAttributes })
      .last()
      .write()
    )
  }

  remove(entity, uid) {
    return this.onConnected.then(database =>
      database
      .get(entity)
      .remove({ uid })
      .write()
    )
  }

  exists(entity, filter) {
    return new Promise((resolve, reject) =>
      this.one(entity, filter).then(found => found ? resolve(found): reject()));
  }

  one(entity, filterAttributes) {
    return this.onConnected.then(database =>
      database
      .get(entity)
      .find(filterAttributes)
      .value()
    )
  }

  update(entity, find, newAttributes) {
    return this.onConnected.then(database =>
      database
      .get(entity)
      .find(find)
      .assign(newAttributes)
      .write()
    )
  }

  filter(entity, filterAttributes) {
    return this.onConnected.then(database =>
      database
      .get(entity)
      .filter(filterAttributes)
      .value()
    )
  }

  read(entity) {
    return this.onConnected.then(database =>
      database
      .get(entity)
      .value()
    )
  }
}
