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
