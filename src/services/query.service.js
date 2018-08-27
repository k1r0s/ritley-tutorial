import { Provider } from "@ritley/decorators";

@Provider.factory
export default class QueryService {
  getFilter(query) {
    const blocks = query.split(":");
    const body = blocks.map(this.buildStatement).join("&&");
    return new Function("sub", "return " + body);
  }

  buildStatement(expression) {
    const reg = /(.{0,2}),(.+),(.+)/
    const [match, cmd, prop, val] = reg.exec(expression);
    switch (cmd) {
      case "eq":
        return `sub['${prop}'] === '${val}'`;
      case "gt":
        return `sub['${prop}'] > Number('${val}')`;
      case "lt":
        return `sub['${prop}'] < Number('${val}')`;
      case "sw":
        return `sub['${prop}'].startsWith('${val}')`;
      case "ew":
        return `sub['${prop}'].endsWith('${val}')`;
      case "in":
        return `sub['${prop}'].includes('${val}')`;
    }
  }
}
