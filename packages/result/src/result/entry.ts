export * from "~/result/index";
export * from "~/result/util";
export * from "~/result/methods";

import * as index from "~/result/index";
import * as methods from "~/result/methods";
import * as util from "~/result/util";

export default {
    ...index,
    ...util,
    ...methods,
};
