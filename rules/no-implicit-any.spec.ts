import { RuleTester } from '@typescript-eslint/rule-tester';
import { rule } from './no-implicit-any';

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
      // TODO: These should be passed.
      // {
      //   code: `
      //     type Foo = (arg: any) => void
      //     const foo: Foo = (arg) => {};
      //   `,
      // },
      // {
      //   code: `
      //     type Foo = (arg1: string, arg2: any[]) => void
      //     const foo: Foo = (arg1, arg2) => {};
      //   `,
      // },
      // MemberExpression
      {
        code: `
          const foo = { key: 'value' };
          foo['key'];
        `,
      },
      {
        code: `
          const foo = { key: 'value' };
          foo?.['key'];
        `,
      },
      {
        code: `
          const foo = {};
          (foo as any)['key'];
        `
      },
      {
        code: `
          const foo = { key: { key2: {} } };
          (foo['key']['key2'] as any)['key3'];
        `
      },
      {
        code: `
          const foo = {};
          (foo as any)['key']['key2'];
        `
      },
      {
        code: `
          const foo = {};
          (foo as any).key1.key2;
        `
      },
      {
        code: `
          const foo = { key: 'value' };
          foo.key;
        `,
      },
      {
        code: `
          const foo = { key: 'value' };
          foo?.key;
        `,
      },
      {
        code: `
          const foo = {};
          foo.key;
        `,
      },
      {
        code: `
          const foo = { key: { key2: {} } };
          foo.key.key2.key3;
        `,
      },
      {
        code: `
          const foo = {};
          foo?.key;
        `,
      },
      {
        code: `
          const foo = { key:  { key2: {} } };
          foo.key.key2?.key3;
        `,
      },
      {
        code: `
          const foo: any[] = [];
          foo[0];
        `
      },
      {
        code: `
          const foo: { key: any } = { key: '' };
          foo.key;
        `
      },
      // VariableDeclarator
      {
        code: 'const foo;'
      },
      {
        code: 'const foo: any;'
      },
      {
        code: 'let foo: any;'
      },
      {
        code: 'var foo: any;'
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
        errors: [{ messageId: 'missingAnyType' }]
      },
      // MemberExpression
      {
        code: `
          const foo = {};
          foo['key'];
        `,
        output: `
          const foo = {};
          (foo as any)['key'];
        `,
        errors: [{ messageId: 'missingAnyType' }]
      },
      {
        code: `
          const foo = { key: { key2: {} } };
          foo['key']['key2']['key3'];
        `,
        output: `
          const foo = { key: { key2: {} } };
          (foo['key']['key2'] as any)['key3'];
        `,
        errors: [{ messageId: 'missingAnyType' }]
      },
      {
        code: `
          const foo = {};
          foo?.['key'];
        `,
        output: `
          const foo = {};
          (foo as any)?.['key'];
        `,
        errors: [{ messageId: 'missingAnyType' }]
      },
      {
        code: `
          const foo = { key: { key2: {} } };
          foo['key']['key2']?.['key3'];
        `,
        output: `
          const foo = { key: { key2: {} } };
          (foo['key']['key2'] as any)?.['key3'];
        `,
        errors: [{ messageId: 'missingAnyType' }]
      },
      // VariableDeclarator
      {
        code: 'let foo;',
        output: 'let foo: any;',
        errors: [{ messageId: 'missingAnyType' }]
      },
      {
        code: 'let foo, bar;',
        output: 'let foo: any, bar: any;',
        errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }]
      },
      {
        code: 'var foo;',
        output: 'var foo: any;',
        errors: [{ messageId: 'missingAnyType' }]
      },
      {
        code: 'var foo, bar;',
        output: 'var foo: any, bar: any;',
        errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }]
      },
    ],
  }
);
