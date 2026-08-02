import { expect, test } from "vitest";
import { inflect, Inflect, Split, Camel, Kebab, Snake, Spaces } from "~/Inflect";

test("variable split", () => {
    // base
    expect(Split.variable("")).toEqual([]);
    expect(Split.variable("h")).toEqual(["h"]);
    expect(Split.variable("H")).toEqual(["H"]);
    expect(Split.variable("hello")).toEqual(["hello"]);
    expect(Split.variable("Hello")).toEqual(["Hello"]);
    expect(Split.variable("HELLO")).toEqual(["HELLO"]);

    // camel
    expect(Split.variable("helloFooWorld")).toEqual(["hello", "Foo", "World"]);
    expect(Split.variable("HelloFooWorld")).toEqual(["Hello", "Foo", "World"]);
    expect(Split.variable("HelloFOOWorld")).toEqual(["Hello", "FOO", "World"]);
    expect(Split.variable("HelloFooBarWorld")).toEqual(["Hello", "Foo", "Bar", "World"]);
    expect(Split.variable("HELLOFooWorld")).toEqual(["HELLO", "Foo", "World"]);
    expect(Split.variable("Hello2Foo3")).toEqual(["Hello2", "Foo3"]);
    expect(Split.variable("Hello2aaaFoo3bbb")).toEqual(["Hello2aaa", "Foo3bbb"]);

    expect(Split.variable("$Hello$World")).toEqual(["$Hello", "$World"]);
    expect(Split.variable("$$Hello$$World")).toEqual(["$$Hello", "$$World"]);
    expect(Split.variable("$hello$world")).toEqual(["$hello", "$world"]);

    expect(Split.variable("button_onClick")).toEqual(["button", "_on", "Click"]);
    expect(Split.variable("Hello2a_aaFoo3bbb")).toEqual(["Hello2a", "_aa", "Foo3bbb"]);
    expect(Split.variable("_Hello2aaaFoo3bbb")).toEqual(["_Hello2aaa", "Foo3bbb"]);
    expect(Split.variable("_Hello2a_aaFoo3bbb")).toEqual(["_Hello2a", "_aa", "Foo3bbb"]);
    expect(Split.variable("___Hello2a_aaFoo3bbb")).toEqual(["___Hello2a", "_aa", "Foo3bbb"]);
    expect(Split.variable("$Hello2a_aaFoo3bbb")).toEqual(["$Hello2a", "_aa", "Foo3bbb"]);
    expect(Split.variable("$Hello2a_aa$$Foo3bbb")).toEqual(["$Hello2a", "_aa", "$$Foo3bbb"]);
    expect(Split.variable("HE$$OMi$$ippi")).toEqual(["HE$$OMi$$ippi"]);

    // // kebab
    // expect(Camel.split("hello-Foo-World")).toEqual(["hello", "Foo", "World"]);
    // expect(Camel.split("Hello-Foo-World")).toEqual(["Hello", "Foo", "World"]);
    // expect(Camel.split("Hello-FOO-World")).toEqual(["Hello", "FOO", "World"]);
    // expect(Camel.split("Hello-FooBar-World")).toEqual(["Hello", "Foo", "Bar", "World"]);
    // expect(Camel.split("HTML-Entity")).toEqual(["HTML", "Entity"]);

    // // snake
    // expect(Camel.split("hello_Foo_World")).toEqual(["hello", "Foo", "World"]);
    // expect(Camel.split("Hello_Foo_World")).toEqual(["Hello", "Foo", "World"]);
    // expect(Camel.split("Hello_FOO_World")).toEqual(["Hello", "FOO", "World"]);
    // expect(Camel.split("Hello_FooBar_World")).toEqual(["Hello", "Foo", "Bar", "World"]);
    // expect(Camel.split("HTML_Entity")).toEqual(["HTML", "Entity"]);

    // // spaces
    // expect(Camel.split("hello Foo World")).toEqual(["hello", "Foo", "World"]);
    // expect(Camel.split("Hello Foo World")).toEqual(["Hello", "Foo", "World"]);
    // expect(Camel.split("Hello FOO World")).toEqual(["Hello", "FOO", "World"]);
    // expect(Camel.split("Hello FooBar World")).toEqual(["Hello", "Foo", "Bar", "World"]);
    // expect(Camel.split("HTML Entity")).toEqual(["HTML", "Entity"]);
    // expect(Camel.split("HTML   Entity")).toEqual(["HTML", "Entity"]);
});

// test("kebab split", () => {
//     // base
//     expect(Kebab.split("hello")).toEqual(["hello"]);
//     expect(Kebab.split("Hello")).toEqual(["Hello"]);
//     expect(Kebab.split("HELLO")).toEqual(["HELLO"]);

//     // camel
//     expect(Kebab.split("helloFooWorld")).toEqual(["helloFooWorld"]);
//     expect(Kebab.split("HelloFooWorld")).toEqual(["HelloFooWorld"]);
//     expect(Kebab.split("HelloFOOWorld")).toEqual(["HelloFOOWorld"]);
//     expect(Kebab.split("HTMLEntity")).toEqual(["HTMLEntity"]);

//     // kebab
//     expect(Kebab.split("hello-Foo-World")).toEqual(["hello", "Foo", "World"]);
//     expect(Kebab.split("Hello-Foo-World")).toEqual(["Hello", "Foo", "World"]);
//     expect(Kebab.split("Hello-FOO-World")).toEqual(["Hello", "FOO", "World"]);
//     expect(Kebab.split("HTML-Entity")).toEqual(["HTML", "Entity"]);

//     // snake
//     expect(Kebab.split("hello_Foo_World")).toEqual(["hello_Foo_World"]);
//     expect(Kebab.split("Hello_Foo_World")).toEqual(["Hello_Foo_World"]);
//     expect(Kebab.split("Hello_FOO_World")).toEqual(["Hello_FOO_World"]);
//     expect(Kebab.split("HTML_Entity")).toEqual(["HTML_Entity"]);

//     // spaces
//     expect(Kebab.split("hello Foo World")).toEqual(["hello Foo World"]);
//     expect(Kebab.split("Hello Foo World")).toEqual(["Hello Foo World"]);
//     expect(Kebab.split("Hello FOO World")).toEqual(["Hello FOO World"]);
//     expect(Kebab.split("HTML Entity")).toEqual(["HTML Entity"]);
//     expect(Kebab.split("HTML   Entity")).toEqual(["HTML   Entity"]);
// });

// test("camel to kebab", () => {
//     expect(inflect("hello", Camel.split, Kebab.upper)).toBe("HELLO");
//     expect(inflect("helloFooWorld", Camel.split, Kebab.upper)).toBe("HELLO-FOO-WORLD");
//     expect(inflect("Hello", Camel.split, Kebab.upper)).toBe("HELLO");
//     expect(inflect("HelloFooWorld", Camel.split, Kebab.upper)).toBe("HELLO-FOO-WORLD");
//     expect(inflect("HelloFOOWorld", Camel.split, Kebab.upper)).toBe("HELLO-FOO-WORLD");
//     expect(inflect("HTMLEntity", Camel.split, Kebab.upper)).toBe("HTML-ENTITY");

//     expect(inflect("hello", Camel.split, Kebab.lower)).toBe("hello");
//     expect(inflect("helloFooWorld", Camel.split, Kebab.lower)).toBe("hello-foo-world");
//     expect(inflect("Hello", Camel.split, Kebab.lower)).toBe("hello");
//     expect(inflect("HelloFooWorld", Camel.split, Kebab.lower)).toBe("hello-foo-world");
//     expect(inflect("HelloFOOWorld", Camel.split, Kebab.lower)).toBe("hello-foo-world");
//     expect(inflect("HTMLEntity", Camel.split, Kebab.lower)).toBe("html-entity");

//     expect(inflect("hello", Camel.split, Kebab.mixed)).toBe("Hello");
//     expect(inflect("helloFooWorld", Camel.split, Kebab.mixed)).toBe("Hello-Foo-World");
//     expect(inflect("Hello", Camel.split, Kebab.mixed)).toBe("Hello");
//     expect(inflect("HelloFooWorld", Camel.split, Kebab.mixed)).toBe("Hello-Foo-World");
//     expect(inflect("HelloFOOWorld", Camel.split, Kebab.mixed)).toBe("Hello-Foo-World");
//     expect(inflect("HTMLEntity", Camel.split, Kebab.mixed)).toBe("Html-Entity");
// });
