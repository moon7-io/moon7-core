export * from "~/either/index";
export * from "~/either/util";
export * from "~/either/methods";

import * as index from "~/either/index";
import * as methods from "~/either/methods";
import * as util from "~/either/util";

export default {
    ...index,
    ...util,
    ...methods,
};
