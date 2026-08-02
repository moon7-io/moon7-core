# 🌙 @moon7/bits

[![npm version](https://img.shields.io/npm/v/@moon7/bits.svg)](https://www.npmjs.com/package/@moon7/bits)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A lightweight, type-safe utility library for bitwise operations in JavaScript and TypeScript applications.

## ✨ Features

- 🧩 **Modular API** - Simple, focused functions for specific bitwise operations
- 📝 **Named bit collections** - Create organized, readable constants for bit flags and enums
- 🔄 **Bit masking utilities** - Easily work with multiple bits at once using masks
- 🔍 **Debug helpers** - Convert bits to readable binary strings for debugging

## 📦 Installation

```bash
# Using npm
npm install @moon7/bits

# Using yarn
yarn add @moon7/bits

# Using pnpm
pnpm add @moon7/bits
```

## 🚀 Usage

### 🧮 Basic Bit Operations

```typescript
import { 
    getBit, setBit, setBitOn, setBitOff, toggleBit,
    bitMask, ALL, NONE
} from '@moon7/bits';

// Check if a specific bit is set
const hasBit = getBit(0b1010, 1);
// true (bit at position 1 is set)

// Set a bit to a specific value
const withBit = setBit(0b1010, 0, true);
// 0b1011 (set bit 0 to 1)

const withoutBit = setBit(0b1010, 1, false);
// 0b1000 (set bit 1 to 0)

// Turn a specific bit on
const bitsOn = setBitOn(0b1010, 2);
// 0b1110 (turn on bit 2)

// Turn a specific bit off
const bitsOff = setBitOff(0b1010, 1);
// 0b1000 (turn off bit 1)

// Toggle a specific bit
const toggled = toggleBit(0b1010, 1);
// 0b1000 (toggle bit 1 from 1 to 0)

const toggled2 = toggleBit(0b1010, 0);
// 0b1011 (toggle bit 0 from 0 to 1)

// Get a bitmask for a specific position
const mask = bitMask(3);
// 0b1000 (a mask with bit 3 set)

// ALL contains a bitfield with all bits set to 1
// NONE contains a bitfield with all bits set to 0
```

### 🎭 Working with Multiple Bits Using Masks

```typescript
import { 
    checkMask, applyMask, clearMask, toggleMask 
} from '@moon7/bits';

// Check if any of the specified bits are set
const hasAnyBit = checkMask(0b1010, 0b1100);
// true (at least one bit overlaps)

// Set multiple bits at once
const withBits = applyMask(0b1010, 0b0101);
// 0b1111 (apply mask to set bits)

// Clear multiple bits at once
const clearedBits = clearMask(0b1111, 0b1010);
// 0b0101 (clear bits specified by mask)

// Toggle multiple bits at once
const toggledBits = toggleMask(0b1010, 0b1111);
// 0b0101 (toggle all bits in the mask)
```

### 📝 Creating Named Bit Collections

```typescript
import { defineBitFlags, defineBitEnum } from '@moon7/bits';

// Define named bit flags with explicit positions
const Permissions = defineBitFlags({
    READ: 0,      // bit 0
    WRITE: 1,     // bit 1
    DELETE: 2,    // bit 2
    ADMIN: 5      // bit 5 (can skip positions)
});

// Positions are preserved exactly as defined
console.log(Permissions.READ);
// 0

console.log(Permissions.ADMIN);
// 5

// Get bitmasks using the mask function
console.log(Permissions.mask("READ"));
// 1 (0b0001)

console.log(Permissions.mask("ADMIN"));
// 32 (0b100000)

// Define sequentially numbered bit positions
const Features = defineBitEnum(
    "DARK_MODE",      // bit 0
    "NOTIFICATIONS",  // bit 1
    "AUTO_SAVE",      // bit 2
    "SYNC"            // bit 3
);

// Positions are assigned sequentially
console.log(Features.DARK_MODE);
// 0

console.log(Features.NOTIFICATIONS);
// 1

// Get bitmasks the same way
console.log(Features.mask("AUTO_SAVE"));
// 4 (0b100)
```

### 🚦 Using Named Bit Collections for Flags

```typescript
import { defineBitFlags } from '@moon7/bits';

// Define user permissions
const Permissions = defineBitFlags({
    READ: 0,
    WRITE: 1,
    DELETE: 2,
    ADMIN: 3
});

// Create a user with READ and WRITE permissions
let userPermissions = 0;

// Set READ bit
userPermissions |= Permissions.mask("READ");

// Set WRITE bit
userPermissions |= Permissions.mask("WRITE");

// Check if user has specific permissions
function hasPermission(permissions, permission) {
    return (permissions & Permissions.mask(permission)) !== 0;
}

console.log(hasPermission(userPermissions, "READ"));
// true

console.log(hasPermission(userPermissions, "ADMIN"));
// false

// Add ADMIN permission
userPermissions |= Permissions.mask("ADMIN");
console.log(hasPermission(userPermissions, "ADMIN"));
// true

// Remove WRITE permission
userPermissions &= ~Permissions.mask("WRITE");
console.log(hasPermission(userPermissions, "WRITE"));
// false
```

### 🔍 String Representation for Debugging

```typescript
import { toBinaryString, toFormattedBinaryString } from '@moon7/bits';

// Convert a number to binary string
console.log(toBinaryString(42));  
// "00000000000000000000000000101010"

// Convert with custom length
console.log(toBinaryString(42, 8));  
// "00101010"

// Get a nicely formatted binary string with grouping
console.log(toFormattedBinaryString(42));  
// "0000 0000 - 0000 0000 - 0000 0000 - 0010 1010"

console.log(toFormattedBinaryString(42, 16));  
// "0000 0000 - 0010 1010"
```

### 📊 Bit Analysis

```typescript
import { countBits, isSingleBit } from '@moon7/bits';

// Count the number of set bits
console.log(countBits(0b10101));
// 3 (bits 0, 2, and 4 are set)

console.log(countBits(0));
// 0 (no bits set)

console.log(countBits(0xFF));
// 8 (all 8 bits are set)

// Check if exactly one bit is set
console.log(isSingleBit(0b1000));
// true (only bit 3 is set)

console.log(isSingleBit(0b1010));
// false (multiple bits are set)

console.log(isSingleBit(0));
// false (no bits are set)
```

## 📚 API Reference

| API                                     | Description                                                 |
| --------------------------------------- | ----------------------------------------------------------- |
| **🧮 Constants**                         |                                                             |
| `ALL`                                   | Constant with all bits set to 1                             |
| `NONE`                                  | Constant with all bits set to 0                             |
| **🧩 Core Functions**                    |                                                             |
| `bitMask(index)`                        | Gets a mask with a single bit set at the specified position |
| **🎭 Multiple Bit Operations**           |                                                             |
| `checkMask(bits, mask)`                 | Checks if any bits specified by the mask are set            |
| `applyMask(bits, mask)`                 | Sets (turns on) bits specified by the mask                  |
| `clearMask(bits, mask)`                 | Clears (turns off) bits specified by the mask               |
| `toggleMask(bits, mask)`                | Toggles bits specified by the mask                          |
| **👆 Single Bit Operations**             |                                                             |
| `getBit(bits, index)`                   | Gets the boolean value of a bit at a specific position      |
| `setBit(bits, index, value)`            | Sets a bit at a specific position to a boolean value        |
| `setBitOn(bits, index)`                 | Sets (turns on) a bit at a specific position                |
| `setBitOff(bits, index)`                | Clears (turns off) a bit at a specific position             |
| `toggleBit(bits, index)`                | Toggles a bit at a specific position                        |
| **📝 Named Bit Collections**             |                                                             |
| `defineBitFlags(definition)`            | Creates a named collection with explicit bit positions      |
| `defineBitEnum(...names)`               | Creates a named collection with sequential bit positions    |
| **🔍 Utility Functions**                 |                                                             |
| `toBinaryString(bits, length)`          | Converts bits to a binary string representation             |
| `toFormattedBinaryString(bits, length)` | Converts bits to a formatted binary string with grouping    |
| `countBits(bits)`                       | Counts the number of bits set to 1                          |
| `isSingleBit(bits)`                     | Checks if exactly one bit is set                            |

## 🔗 Related Libraries

| Library                                                     | Description                                                                | npm                                                                                                             |
| ----------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [@moon7/async](https://github.com/moon7-io/moon7-async)     | Asynchronous utilities for promises, semaphores, and concurrent operations | [![npm version](https://img.shields.io/npm/v/@moon7/async.svg)](https://www.npmjs.com/package/@moon7/async)     |
| [@moon7/inspect](https://github.com/moon7-io/moon7-inspect) | Runtime type checking with powerful, composable type inspectors            | [![npm version](https://img.shields.io/npm/v/@moon7/inspect.svg)](https://www.npmjs.com/package/@moon7/inspect) |
| [@moon7/result](https://github.com/moon7-io/moon7-result)   | Functional error handling with Result and Maybe types                      | [![npm version](https://img.shields.io/npm/v/@moon7/result.svg)](https://www.npmjs.com/package/@moon7/result)   |
| [@moon7/signals](https://github.com/moon7-io/moon7-signals) | Reactive programming with Signals, Sources, and Streams                    | [![npm version](https://img.shields.io/npm/v/@moon7/signals.svg)](https://www.npmjs.com/package/@moon7/signals) |
| [@moon7/sort](https://github.com/moon7-io/moon7-sort)       | Composable sorting functions for arrays and collections                    | [![npm version](https://img.shields.io/npm/v/@moon7/sort.svg)](https://www.npmjs.com/package/@moon7/sort)       |

## 🤝 Contributing

We welcome contributions from everyone! See our [contributing guide](https://github.com/moon7-io/.github/blob/main/CONTRIBUTING.md) for more details on how to get involved. Please feel free to submit a Pull Request.

## 📝 License

This project is released under the MIT License. See the [LICENSE](https://github.com/moon7-io/moon7-bits/blob/main/LICENSE) file for details.

## 🌟 Acknowledgements

Created and maintained by [Munir Hussin](https://github.com/profound7).