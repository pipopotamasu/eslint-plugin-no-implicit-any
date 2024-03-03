[![CI](https://github.com/pipopotamasu/eslint-plugin-no-implicit-any/actions/workflows/ci.yml/badge.svg)](https://github.com/pipopotamasu/eslint-plugin-no-implicit-any/actions/workflows/ci.yml)

# eslint-plugin-no-implicit-any

typescript-eslint plugin for [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny).

## Installation

```shell
npm install --save-dev eslint-plugin-no-implicit-any
```

## Setup

1. Add `no-implicit-any` to your list of plugins in your ESLint config.

```json
{
  "plugins": ["no-implicit-any"]
}
```

2. Add `'no-implicit-any/no-implicit-any'` to your list of rules in your ESLint config.

```json
{
  "rules": { "no-implicit-any/no-implicit-any": "error" }
}
```

## Rule detail

### no-implicit-any/no-implicit-any

Disallow no implict any usage. Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

Examples of incorrect code for this rule:

```ts
function foo(arg) {}

const foo = (...args) => {};

const foo = { key: (arg) => {} };

const foo = {};
foo['key'];
```

Examples of correct code for this rule:

```ts
function foo(arg: any) {}

const foo = (...args: any[]) => {};

const foo = { key: (arg: any) => {} };

const foo = {};

(foo as any)['key'];
```

More examples here:

- https://github.com/pipopotamasu/eslint-plugin-no-implicit-any/blob/main/rules/no-implicit-any/function-args/index.spec.ts
- https://github.com/pipopotamasu/eslint-plugin-no-implicit-any/blob/main/rules/no-implicit-any/member-expression/index.spec.ts
- https://github.com/pipopotamasu/eslint-plugin-no-implicit-any/blob/main/rules/no-implicit-any/variable-declarator/index.spec.ts
- https://github.com/pipopotamasu/eslint-plugin-no-implicit-any/blob/main/rules/no-implicit-any/return-statement/index.spec.ts
- https://github.com/pipopotamasu/eslint-plugin-no-implicit-any/tree/main/rules/no-implicit-any/implicit-return/index.spec.ts
- https://github.com/pipopotamasu/eslint-plugin-no-implicit-any/blob/main/rules/no-implicit-any/object-expression/index.spec.ts
- https://github.com/pipopotamasu/eslint-plugin-no-implicit-any/blob/main/rules/no-implicit-any/ts-property-signature/index.spec.ts
- https://github.com/pipopotamasu/eslint-plugin-no-implicit-any/blob/main/rules/no-implicit-any/property-definition/index.spec.ts

## License

MIT
