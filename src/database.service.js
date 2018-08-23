import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";
import config from "./database.config";
import shortid from "shortid";

export default class DataBase {
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
}
