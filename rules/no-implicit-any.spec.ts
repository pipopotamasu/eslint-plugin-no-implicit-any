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
        code: 'function foo (arg: any) {}',
      },
      {
        code: 'const arrayObjFunc = [{ key: function (num: any) {} }];',
      },
      // ArrowFunctionExpression
      {
        code: 'const foo = (arg: any) => {}',
      },
      {
        code: 'const arrayObjArrowFunc = [{ key: (num: any) => num + 1 }];',
      },
      {
        code: `
          type Foo = (firstArg: string, secondArg: string) => void
          const foo: Foo = (firstArg, secondArg) => {};
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
    // 'invalid' checks cases that should not pass
    invalid: [
      // FunctionDeclaration or FunctionExpression
      {
        code: 'function foo (firstArg, secondArg) {}',
        output: 'function foo (firstArg: any, secondArg: any) {}',
        errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
      },
      {
        code: 'const arrayObjFunc = [{ key: function (num) {} }];',
        output: 'const arrayObjFunc = [{ key: function (num: any) {} }];',
        errors: [{ messageId: 'missingAnyType' }],
      },
      // ArrowFunctionExpression
      {
        code: 'const foo = (arg) => {}',
        output: 'const foo = (arg: any) => {}',
        errors: [{ messageId: 'missingAnyType' }],
      },
      {
        code: 'const arrayObjArrowFunc = [{ key: (num) => {} }];',
        output: 'const arrayObjArrowFunc = [{ key: (num: any) => {} }];',
        errors: [{ messageId: 'missingAnyType' }],
      }
    ],
  }
);
