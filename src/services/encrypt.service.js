import { Cpass } from "cpass";
import { Provider } from "@ritley/decorators";

const Encrypt = Provider.factory(Cpass);

export default Encrypt.bind(null, "secretphrase");
