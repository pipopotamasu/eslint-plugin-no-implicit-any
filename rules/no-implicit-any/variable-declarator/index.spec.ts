import { ruleTester } from '../../testUtil';
import { rule } from '../../no-implicit-any';

ruleTester.run('variable-declarator', rule, {
  valid: [
    {
      code: 'const foo: any;',
    },
    {
      code: 'let foo: any;',
    },
    {
      code: 'var foo: any;',
    },
    {
      code: `
          const foo = () => ({ bar: '1' });
          const returnValue = foo();
        `,
    },
    {
      code: `
          const foo = () => ({ bar: '1' });
          const { bar } = foo();
        `,
    },
    {
      code: `
          const foo = (): any => 'test';
          const val = foo();
        `,
    },
    {
      code: `
          const foo = () => ([1, 2]);
          const [num1, num2] = foo();
        `,
    },
    {
      code: `
          const obj: any = { a: 1, b: 2 }
          for (const property in obj) {}
        `,
    },
    {
      code: `
          const arr: any = [1, 2]
          for (const el of arr) {}
        `,
    },
  ],
  invalid: [
    {
      code: 'const foo;',
      output: 'const foo: any;',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'let foo;',
      output: 'let foo: any;',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'let foo, bar;',
      output: 'let foo: any, bar: any;',
      errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
    },
    {
      code: 'var foo;',
      output: 'var foo: any;',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'var foo, bar;',
      output: 'var foo: any, bar: any;',
      errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = null',
      output: 'const foo: any = null',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'let foo = null',
      output: 'let foo: any = null',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'var foo = null',
      output: 'var foo: any = null',
      errors: [{ messageId: 'missingAnyType' }],
    },
  ],
});
