export * from "~/future/index";
export * from "~/future/util";
export * from "~/future/methods";

import * as index from "~/future/index";
import * as methods from "~/future/methods";
import * as util from "~/future/util";

export default {
    ...index,
    ...util,
    ...methods,
};
