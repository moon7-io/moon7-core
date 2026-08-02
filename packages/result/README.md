# 🌙 @moon7/result

[![npm version](https://img.shields.io/npm/v/@moon7/result.svg)](https://www.npmjs.com/package/@moon7/result)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A lightweight, zero-dependency TypeScript library for functional error handling with monadic data types.

## ✨ Features

- 🛡️ **Type-safe error handling** - Handle success and failure states without exceptions
- 🧩 **Composable operations** - Chain operations that might fail with clean, readable code
- 🔄 **Async support** - Full support for asynchronous operations with Futures and Promises
- 🧪 **Pattern matching** - Elegant pattern matching for handling different result states
- 🔀 **Multiple representations** - Choose from Result, Maybe, Either, or Future based on your needs
- 📦 **Zero dependencies** - Lightweight and focused utility

## 📦 Installation

```bash
# npm
npm install @moon7/result

# yarn
yarn add @moon7/result

# pnpm
pnpm add @moon7/result
```

## 🧩 Core Types

The library provides several monadic types for handling different scenarios:

### 🔄 Result Type

The `Result<V, E>` type represents an operation that can succeed with a value or fail with an error:

```typescript
type Result<V, E = unknown> = Success<V> | Failure<E>;

interface Success<V> {
    readonly status: "success";
    readonly value: V;
}

interface Failure<E> {
    readonly status: "failure";
    readonly error: E;
}
```

### 🤔 Maybe Type

The `Maybe<T>` type handles optional values in a functional way:

```typescript
type Maybe<T> = Some<T> | None;

interface Some<T> {
    readonly value: T;
}

type None = undefined | null;
```

### ↔️ Either Type

The `Either<L, R>` type represents a value that can be one of two types (conventionally "left" for errors and "right" for success):

```typescript
type Left<L> = [error: L, value: undefined | null];
type Right<R> = [error: undefined | null, value: R];
type Either<L, R> = Left<L> | Right<R>;
```

### ⏳ Future Type

The `Future<V, E>` type represents a value that will be available asynchronously but without using Promises directly:

```typescript
interface Future<V, E> {
    (): Maybe<Result<V, E>>;
    (cb: (result: Result<V, E>) => void): void;
}
```

## 🚀 Basic Usage

### Working with Results

```typescript
import { Result } from "@moon7/result";

// Creating Results
const successResult = Result.success(42);
const failureResult = Result.failure(new Error("Something went wrong"));

// Type guards
if (Result.isSuccess(successResult)) {
    console.log(successResult.value); // 42
}

// Pattern matching
const message = Result.match(successResult, {
    success: value => `Got value: ${value}`,
    failure: error => `Error: ${error.message}`
});

// Safely unwrapping values
const value = Result.unwrapOr(failureResult, 0); // 0
const recovered = Result.recover(failureResult, error => {
    console.log(`Recovering from: ${error.message}`);
    return 100;
}); // Success with value 100

// Transformations
const doubled = Result.map(successResult, x => x * 2); // Success with value 84
```

### Safe Error Handling

```typescript
import { Result } from "@moon7/result";

// Safe synchronous operations
const parseResult = Result.fromTry(() => JSON.parse(someInput));

// Safe asynchronous operations
const fetchResult = await Result.fromTryAsync(async () => {
    const response = await fetch('https://api.example.com/data');
    return response.json();
});

// Working with multiple results
const combined = Result.all(result1, result2, result3); // Success only if ALL succeed
const anySuccess = Result.any(result1, result2, result3); // Success if ANY succeeds
```

### Working with Maybe

```typescript
import { Maybe } from "@moon7/result";

// Creating Maybe values
const someValue = Maybe.some(42);
const noneValue = Maybe.none;

// Type guards
if (Maybe.isSome(someValue)) {
    console.log(someValue.value); // 42
}

// Pattern matching
const message = Maybe.match(someValue, {
    some: value => `Got value: ${value}`,
    none: () => "No value available"
});

// Safely extracting values
const value = Maybe.unwrapOr(someValue, 0); // 42
const fallback = Maybe.unwrapOr(noneValue, 0); // 0

// Transformations
const doubled = Maybe.map(someValue, x => x * 2); // Some(84)
const chained = Maybe.chain(someValue, x => x > 20 ? Maybe.some(x) : Maybe.none); // Some(42)
```

### Working with Either

```typescript
import { Either } from "@moon7/result";

// Creating Either values
const rightValue = Either.right(42);
const leftValue = Either.left(new Error("Something went wrong"));

// Type guards
if (Either.isRight(rightValue)) {
    console.log(rightValue[1]); // 42
}

// Pattern matching
const message = Either.match(rightValue, {
    right: value => `Got value: ${value}`,
    left: error => `Error: ${error.message}`
});

// Transformations
const doubled = Either.map(rightValue, x => x * 2); // Right([undefined, 84])
const recovered = Either.recover(leftValue, error => 100); // Right([undefined, 100])

// Converting between types
const result = Either.fromResult(someResult);
const maybeValue = Either.fromMaybe(someMaybe);
```

### Asynchronous Operations with Future

```typescript
import { Future, Result } from "@moon7/result";

// Creating a Future
const future = Future.of((pass, fail) => {
    fetchData()
        .then(data => pass(data))
        .catch(err => fail(err));
});

// Using with callbacks
future(result => {
    if (Result.isSuccess(result)) {
        console.log(result.value);
    } else {
        console.error(result.error);
    }
});

// Checking state
if (Future.isCompleted(future)) {
    console.log("Future is resolved");
}

// Converting to Promise
const promise = Future.toPromise(future);

// Transformations
const doubled = Future.map(future, x => x * 2);
const chained = Future.chain(future, value => Future.success(value * 2));
```

### Node.js Callback Interop

```typescript
import { Callback, Result, Future } from "@moon7/result";
import { readFile } from "fs";

// Convert a Node.js callback function to a Promise<Result>
const fileResult = await Result.fromCallback(cb => 
    readFile("package.json", "utf8", cb)
);

// Or to a Future
const fileFuture = Future.fromCallback(cb => 
    readFile("package.json", "utf8", cb)
);

// Create a callback from a Result handler
const resultCallback = Callback.result(result => {
    if (Result.isSuccess(result)) {
        console.log(result.value);
    }
});

// Use with Node.js APIs
readFile("package.json", "utf8", resultCallback);
```

### Error Utilities

```typescript
import { must, strictMust, assert, assertNever, raise, safely, attempt } from "@moon7/result";

// Check for null or undefined
const value = must(maybeNull, "Value cannot be null");

// Only check for undefined (allows null)
const nullableValue = strictMust(maybeUndefined, "Value cannot be undefined");

// Assertions
assert(condition, "Condition must be true");

// Exhaustive type checking
function processShape(shape: Circle | Square | Triangle) {
    switch (shape.type) {
        case 'circle':
            return calculateCircleArea(shape);
        case 'square':
            return calculateSquareArea(shape);
        case 'triangle':
            return calculateTriangleArea(shape);
        default:
            return assertNever(shape); // Ensures compilation error if a shape is added
    }
}

// Throwing as an expression
const item = items.find(i => i.id === id) ?? raise(new Error(`Item ${id} not found`));

// Safe execution with fallbacks
const parsed = safely(() => JSON.parse(input), defaultValue);
const result = attempt(() => riskyOperation()); // Returns Result
```

## 📚 API Reference

| API | Description |
| --- | --- |
| **📋 Core Types** |  |
| `Result<V, E>` | Union type of `Success<V>` and `Failure<E>` |
| `Maybe<T>` | Union type of `Some<T>` and `None` for handling optional values |
| `Either<L, R>` | Tuple-based representation of `[error, value]` pairs |
| `Future<V, E>` | Callback-based async representation of an eventual Result |
| **🔍 Type Guards** |  |
| `Result.isResult(x)` | Checks if x is a Result |
| `Result.isSuccess(result)` | Checks if result is a Success |
| `Result.isFailure(result)` | Checks if result is a Failure |
| `Maybe.isMaybe(x)` | Checks if x is a Maybe |
| `Maybe.isSome(maybe)` | Checks if maybe is a Some |
| `Maybe.isNone(maybe)` | Checks if maybe is None |
| `Either.isEither(x)` | Checks if x is an Either |
| `Either.isRight(either)` | Checks if either is a Right |
| `Either.isLeft(either)` | Checks if either is a Left |
| `Future.isFuture(x)` | Checks if x is a Future |
| `Future.isCompleted(future)` | Checks if future is completed |
| `Future.isPending(future)` | Checks if future is pending |
| **🏗️ Constructors** |  |
| `Result.success(value)` | Creates a Success result |
| `Result.failure(error)` | Creates a Failure result |
| `Maybe.some(value)` | Creates a Some value |
| `Maybe.none` | Represents None value |
| `Either.right(value)` | Creates a Right value |
| `Either.left(error)` | Creates a Left value |
| `Future.of((pass, fail) => {...})` | Creates a Future |
| `Future.success(value)` | Creates a successful Future |
| `Future.failure(error)` | Creates a failed Future |
| **📦 Unwrapping Functions** |  |
| `Result.unwrap(result)` | Extracts the value or throws |
| `Result.unwrapOr(result, defaultValue?)` | Extracts the value or returns default |
| `Result.unwrapOrElse(result, fn)` | Extracts the value or computes a fallback |
| `Maybe.unwrap(maybe)` | Extracts the value or throws |
| `Maybe.unwrapOr(maybe, defaultValue?)` | Extracts the value or returns default |
| `Maybe.unwrapOrElse(maybe, fn)` | Extracts the value or computes a fallback |
| `Either.unwrap(either)` | Extracts the right value or throws |
| `Either.unwrapOr(either, defaultValue?)` | Extracts the right value or returns default |
| `Either.unwrapOrElse(either, fn)` | Extracts the right value or computes a fallback |
| `Future.unwrap(future)` | Extracts the future value or throws |
| `Future.unwrapOr(future, defaultValue?)` | Extracts the future value or returns default |
| `Future.unwrapOrElse(future, fn)` | Extracts the future value or computes a fallback |
| **🔄 Error Recovery** |  |
| `Result.recover(result, fn)` | Transforms a failure into a success |
| `Maybe.recover(maybe, fn)` | Transforms None into a Some |
| `Either.recover(either, fn)` | Transforms Left into a Right |
| `Future.recover(future, fn)` | Transforms a failed future into a successful one |
| **🛠️ Creation Functions** |  |
| `Result.fromTry(fn)` | Creates a result from a function that might throw |
| `Result.fromTryAsync(fn)` | Creates a result from an async function |
| `Result.fromPromise(promise)` | Creates a result from a promise |
| `Result.fromNullable(value, error?)` | Creates a result from a nullable value |
| `Result.fromEither(either)` | Converts an Either to a Result |
| `Result.fromCallback(fn)` | Creates a result from a Node.js style callback |
| `Maybe.fromTry(fn)` | Creates a Maybe from a function that might throw |
| `Maybe.fromTryAsync(fn)` | Creates a Maybe from an async function |
| `Maybe.fromPromise(promise)` | Creates a Maybe from a promise |
| `Maybe.fromNullable(value)` | Creates a Maybe from a nullable value |
| `Maybe.fromEither(either)` | Converts an Either to a Maybe |
| `Either.fromTry(fn)` | Creates an Either from a function that might throw |
| `Either.fromTryAsync(fn)` | Creates an Either from an async function |
| `Either.fromPromise(promise)` | Creates an Either from a promise |
| `Either.fromNullable(value, error?)` | Creates an Either from a nullable value |
| `Either.fromResult(result)` | Converts a Result to an Either |
| `Future.fromTry(fn)` | Creates a Future from a function that might throw |
| `Future.fromTryAsync(fn)` | Creates a Future from an async function |
| `Future.fromPromise(promise)` | Creates a Future from a promise |
| `Future.fromNullable(value, error?)` | Creates a Future from a nullable value |
| `Future.fromCallback(fn)` | Creates a Future from a Node.js style callback |
| **📚 Collection Operations** |  |
| `Result.all(...results)` | Succeeds if all results succeed |
| `Result.any(...results)` | Succeeds if any result succeeds |
| `Maybe.all(...maybes)` | Returns all values if all are Some |
| `Maybe.any(...maybes)` | Returns first Some or None |
| `Either.all(...eithers)` | Returns all right values if all are Right |
| `Either.any(...eithers)` | Returns first Right or all Left errors |
| `Future.all(...futures)` | Succeeds if all futures succeed |
| `Future.any(...futures)` | Succeeds if any future succeeds |
| **🧩 Pattern Matching** |  |
| `Result.match(result, patterns)` | Applies pattern based on result state |
| `Maybe.match(maybe, patterns)` | Applies pattern based on maybe state |
| `Either.match(either, patterns)` | Applies pattern based on either state |
| `Future.match(future, patterns)` | Applies pattern based on future result |
| **🔄 Transformations** |  |
| `Result.map(result, fn)` | Maps a success value |
| `Result.mapError(result, fn)` | Maps a failure error |
| `Result.bimap(result, successFn, failureFn)` | Maps both success and failure |
| `Result.chain(result, fn)` | Chains with another result-returning function |
| `Result.filter(result, predicate)` | Filters a success based on predicate |
| `Result.join(nestedResult)` | Flattens a nested Result |
| `Maybe.map(maybe, fn)` | Maps a Some value |
| `Maybe.chain(maybe, fn)` | Chains with another Maybe-returning function |
| `Maybe.filter(maybe, predicate)` | Filters a Some based on predicate |
| `Maybe.join(nestedMaybe)` | Flattens a nested Maybe |
| `Either.map(either, fn)` | Maps a Right value |
| `Either.mapLeft(either, fn)` | Maps a Left error |
| `Either.bimap(either, leftFn, rightFn)` | Maps both Left and Right |
| `Either.chain(either, fn)` | Chains with another Either-returning function |
| `Either.swap(either)` | Swaps Left and Right values |
| `Future.map(future, fn)` | Maps a successful future value |
| `Future.chain(future, fn)` | Chains with another Future-returning function |
| **🧰 Utility Functions** |  |
| `must(value, errorMessage?)` | Ensures a value is not null or undefined |
| `strictMust(value, errorMessage?)` | Ensures a value is not undefined |
| `assert(condition, message?)` | Throws if condition is false |
| `assertNever(value)` | Used for exhaustive checks |
| `safely(fn, defaultValue)` | Safely executes a function with a default |
| `attempt(fn)` | Executes a function returning a Result |
| `raise(error?)` | Throws an error as an expression |
| **📊 Callback Utilities** |  |
| `Callback.adapt(cb)` | Adapts between callback styles |
| `Callback.result(cb)` | Creates a Node.js callback from a Result handler |
| `Callback.maybe(cb)` | Creates a Node.js callback from a Maybe handler |

## 🔗 Related Libraries

| Library                                                     | Description                                                                | npm                                                                                                             |
| ----------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [@moon7/async](https://github.com/moon7-io/moon7-async)     | Asynchronous utilities for promises, semaphores, and concurrent operations | [![npm version](https://img.shields.io/npm/v/@moon7/async.svg)](https://www.npmjs.com/package/@moon7/async)     |
| [@moon7/bits](https://github.com/moon7-io/moon7-bits)       | Bit manipulation utilities and binary operations                           | [![npm version](https://img.shields.io/npm/v/@moon7/bits.svg)](https://www.npmjs.com/package/@moon7/bits)       |
| [@moon7/inspect](https://github.com/moon7-io/moon7-inspect) | Runtime type checking with powerful, composable type inspectors            | [![npm version](https://img.shields.io/npm/v/@moon7/inspect.svg)](https://www.npmjs.com/package/@moon7/inspect) |
| [@moon7/signals](https://github.com/moon7-io/moon7-signals) | Reactive programming with Signals, Sources, and Streams                    | [![npm version](https://img.shields.io/npm/v/@moon7/signals.svg)](https://www.npmjs.com/package/@moon7/signals) |
| [@moon7/sort](https://github.com/moon7-io/moon7-sort)       | Composable sorting functions for arrays and collections                    | [![npm version](https://img.shields.io/npm/v/@moon7/sort.svg)](https://www.npmjs.com/package/@moon7/sort)       |

## 🤝 Contributing

We welcome contributions from everyone! See our [contributing guide](https://github.com/moon7-io/.github/blob/main/CONTRIBUTING.md) for more details on how to get involved. Please feel free to submit a Pull Request.

## 📝 License

This project is released under the MIT License. See the [LICENSE](https://github.com/moon7-io/moon7-result/blob/main/LICENSE) file for details.

## 🌟 Acknowledgements

Created and maintained by [Munir Hussin](https://github.com/profound7).
