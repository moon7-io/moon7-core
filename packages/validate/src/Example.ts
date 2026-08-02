import { isString } from "@moon7/inspect";
import { NumberRules, Rules, StringRules } from "~/Rules";
import { Rule, Validator } from "~/Validator";

function example() {
    interface Form {
        height: number;
        name: string;
    }

    const form: Form = {
        height: 345,
        name: "hello",
    };

    function validate() {
        interface FormSchema {
            height: number;
            name: string;
        }

        const formRule: Rule<Form> = Rules.object({
            height: NumberRules.between(4, 7),
            name: Rules.or(StringRules.containsDigit, Rules.inspect(isString, "yo")),
        });

        // Rules.shape<Form>({
        //     height: Rules.shape({
        //     }),
        // });

        Validator.check(
            form.height,
            Rules.and(
                NumberRules.between(4, 7),
                NumberRules.between(4, 5),
                NumberRules.between(4, 5),
                NumberRules.between(4, 5)
            )
        );

        Validator.check(
            form.name,
            Rules.and(
                StringRules.containsDigit,
                StringRules.containsLowerCaseLetter,
                StringRules.containsUpperCaseLetter,
                StringRules.minLength(8)
            )
        );

        Validator.check(form.name, StringRules.containsDigit);
    }
}
