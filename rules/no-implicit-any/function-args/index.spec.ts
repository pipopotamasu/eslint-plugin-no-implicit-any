import { ruleTester } from '../../testUtil';
import { rule } from '../../no-implicit-any';

ruleTester.run('function-args', rule, {
  valid: [
    // FunctionDeclaration or FunctionExpression
    {
      code: 'function foo (arg1: any, arg2: any) {}',
    },
    {
      code: 'function foo (arg = "") {}',
    },
    {
      code: 'function foo (arg1: any = null, arg2: any = undefined, arg3: any[] = []) {}',
    },
    {
      code: 'const arrayObjFunc = [{ key: function (arg1: any, arg2: any) {} }];',
    },
    {
      code: 'function foo ({ arg1, arg2 }: any) {}',
    },
    {
      code: 'function foo ({ ...rest }) {}',
    },
    {
      code: 'function foo ({ ...rest }: any) {}',
    },
    {
      code: 'function foo ({ arg1, ...rest }: any) {}',
    },
    {
      code: 'function foo (...args: any[]) {}',
    },
    {
      code: 'function foo (arg1: any, ...args: any[]) {}',
    },
    // ArrowFunctionExpression
    {
      code: 'const foo = (arg1: any, arg2: any) => {}',
    },
    {
      code: 'const foo = (arg = "") => {};',
    },
    {
      code: 'const foo = (arg1: any = null, arg2: any = undefined, arg3: any[] = []) => {}',
    },
    {
      code: 'const foo = (arg: any = {}) => {};',
    },
    {
      code: 'const arrayObjArrowFunc = [{ key: (arg1: any, arg2: any ) => {} }];',
    },
    {
      code: 'const foo = ({ arg1, arg2 }: any) => {}',
    },
    {
      code: 'const foo = ({ ...rest }) => {}',
    },
    {
      code: 'const foo = ({ ...rest }: any) => {}',
    },
    {
      code: 'const foo = ({ arg1, ...rest }: any) => {}',
    },
    {
      code: 'const foo = (...args: any[]) => {}',
    },
    {
      code: 'const foo = (arg1: any, ...args: any[]) => {}',
    },
    {
      code: `
          type Type = (arg1: string, arg2: string) => void
          const foo: Type = (...args) => {}
        `,
    },
    {
      code: `
          type Foo = (arg1: string, arg2: string) => void
          const foo: Foo = (arg1, arg2) => {};
        `,
    },
    {
      code: `
          type Foo = (arg: any) => void
          const foo: Foo = (arg) => {};
        `,
    },
    {
      code: `
          type Foo = (arg1: string, arg2: any[]) => void
          const foo: Foo = (arg1, arg2) => {};
        `,
    },
    {
      code: `
          type Obj = {
            foo: (arg: any) => void;
          }

          const obj: Obj = {
            foo: (arg) => {}
          }
        `,
    },
    {
      code: `
          type Obj = {
            foo: (arg: any) => void;
          }

          const obj: Obj = {
            foo: function (arg) {}
          }
        `,
    },
    {
      code: `
          const foo = ({ cb }: { cb: (arg: string) => string }) => {};

          foo({
            cb: (arg) => {
              return arg;
            },
          });
        `,
    },
    {
      code: `
          const foo = ({ cb }: { cb: (arg: string) => string }) => {};

          foo({
            cb: function (arg) {
              return arg;
            },
          });
        `,
    },
    {
      code: `
          type Arg = { cb: (arg: any) => void }
          const foo = ({ cb }: Arg) => {};

          foo({
            cb: (arg) => {},
          });
        `,
    },
    {
      code: `
          type Arg = { cb: (arg: any) => void }
          const foo = ({ cb }: Arg) => {};

          foo({
            cb: function (arg) {},
          });
        `,
    },
    {
      code: `
          const foo = (cb: (arg: any[]) => void) => {};
          foo(bar => {});
        `,
    },
    {
      code: `
          const foo = (cb: (arg: any[]) => void) => {};
          foo(function (bar) {});
        `,
    },
    // TSFunctionType
    {
      code: 'type Foo = (arg: any) => void;',
    },
    {
      code: `
        type Foo = {
          fn: (arg: any) => void;
        }
      `,
    },
    {
      code: `
        interface Foo {
          fn: (arg: any) => void;
        }
      `,
    },
  ],
  invalid: [
    // FunctionDeclaration or FunctionExpression
    {
      code: 'function foo (arg1, arg2) {}',
      output: 'function foo (arg1: any, arg2: any) {}',
      errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
    },
    {
      code: 'function foo (arg1 = null, arg2 = undefined, arg3 = []) {}',
      output: 'function foo (arg1: any = null, arg2: any = undefined, arg3: any[] = []) {}',
      errors: [
        { messageId: 'missingAnyType' },
        { messageId: 'missingAnyType' },
        { messageId: 'missingAnyType' },
      ],
    },
    {
      code: 'const arrayObjFunc = [{ key: function (arg1, arg2) {} }];',
      output: 'const arrayObjFunc = [{ key: function (arg1: any, arg2: any) {} }];',
      errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
    },
    {
      code: 'function foo ({ arg1, arg2 }) {}',
      output: 'function foo ({ arg1, arg2 }: any) {}',
      errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
    },
    {
      code: 'function foo ({ arg1, ...rest }) {}',
      output: 'function foo ({ arg1, ...rest }: any) {}',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'function foo (...args) {}',
      output: 'function foo (...args: any[]) {}',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'function foo ([arg1, arg2]) {}',
      output: 'function foo ([arg1, arg2]: any[]) {}',
      errors: [{ messageId: 'missingAnyType' }],
    },
    // ArrowFunctionExpression
    {
      code: 'const foo = (arg1, arg2) => {}',
      output: 'const foo = (arg1: any, arg2: any) => {}',
      errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = (arg1 = null, arg2 = undefined, arg3 = []) => {}',
      output: 'const foo = (arg1: any = null, arg2: any = undefined, arg3: any[] = []) => {}',
      errors: [
        { messageId: 'missingAnyType' },
        { messageId: 'missingAnyType' },
        { messageId: 'missingAnyType' },
      ],
    },
    {
      code: 'const foo = arg => {}',
      output: 'const foo = (arg: any) => {}',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = async arg => {}',
      output: 'const foo = async (arg: any) => {}',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'const arrayObjArrowFunc = [{ key: (arg1, arg2) => {} }];',
      output: 'const arrayObjArrowFunc = [{ key: (arg1: any, arg2: any) => {} }];',
      errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = ({ arg1, arg2 }) => {}',
      output: 'const foo = ({ arg1, arg2 }: any) => {}',
      errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = ({ arg1, ...rest }) => {}',
      output: 'const foo = ({ arg1, ...rest }: any) => {}',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = (...args) => {}',
      output: 'const foo = (...args: any[]) => {}',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = ([arg1, arg2]) => {}',
      output: 'const foo = ([arg1, arg2]: any[]) => {}',
      errors: [{ messageId: 'missingAnyType' }],
    },
    // CallExpression
    {
      code: `
          const foo: any = [];
          foo.map((arg) => {});
        `,
      output: `
          const foo: any = [];
          foo.map((arg: any) => {});
        `,
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: `
          const foo: any = [];
          foo.map(arg => {});
        `,
      output: `
          const foo: any = [];
          foo.map((arg: any) => {});
        `,
      errors: [{ messageId: 'missingAnyType' }],
    },
    // TSFunctionType
    {
      code: 'type Foo = (arg) => void;',
      output: 'type Foo = (arg: any) => void;',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: `
          type Foo = {
            fn: (arg) => void;
          }
        `,
      output: `
          type Foo = {
            fn: (arg: any) => void;
          }
        `,
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: `
        interface Foo {
          fn: (arg) => void;
        }
        `,
      output: `
        interface Foo {
          fn: (arg: any) => void;
        }
        `,
      errors: [{ messageId: 'missingAnyType' }],
    },
  ],
});
