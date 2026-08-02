export * from "~/maybe/index";
export * from "~/maybe/util";
export * from "~/maybe/methods";

import * as index from "~/maybe/index";
import * as methods from "~/maybe/methods";
import * as util from "~/maybe/util";

export default {
    ...index,
    ...util,
    ...methods,
};
