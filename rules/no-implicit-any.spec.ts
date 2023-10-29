import { RuleTester } from '@typescript-eslint/rule-tester';
import { rule } from './no-implicit-any';

RuleTester.afterAll = () => {};
const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
});

ruleTester.run(
  'no-implicit-any',
  rule,
  {
    valid: [
      // FunctionDeclaration or FunctionExpression
      {
        code: 'function foo (arg1: any, arg2: any) {}',
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
      // TODO: This should be passed.
      // {
      //   code: `
      //     type Foo = (arg: any) => void
      //     const foo: Foo = (arg) => {};
      //   `,
      // },
    ],
    invalid: [
      // FunctionDeclaration or FunctionExpression
      {
        code: 'function foo (arg1, arg2) {}',
        output: 'function foo (arg1: any, arg2: any) {}',
        errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
      },
      {
        code: 'const arrayObjFunc = [{ key: function (arg1, arg2) {} }];',
        output: 'const arrayObjFunc = [{ key: function (arg1: any, arg2: any) {} }];',
        errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
      },
      {
        code: 'function foo ({ arg1, arg2 }) {}',
        output: 'function foo ({ arg1, arg2 }: any) {}',
        errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }]
      },
      {
        code: 'function foo ({ arg1, ...rest }) {}',
        output: 'function foo ({ arg1, ...rest }: any) {}',
        errors: [{ messageId: 'missingAnyType' }]
      },
      {
        code: 'function foo (...args) {}',
        output: 'function foo (...args: any[]) {}',
        errors: [{ messageId: 'missingAnyType' }]
      },
      // ArrowFunctionExpression
      {
        code: 'const foo = (arg1, arg2) => {}',
        output: 'const foo = (arg1: any, arg2: any) => {}',
        errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
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
        errors: [{ messageId: 'missingAnyType' }]
      },
    ],
  }
);
