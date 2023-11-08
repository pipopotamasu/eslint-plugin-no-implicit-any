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
