import { ruleTester } from '../../testUtil';
import { rule } from '../../no-implicit-any';

ruleTester.run(
  'variable-declarator',
  rule,
  {
    valid: [
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
