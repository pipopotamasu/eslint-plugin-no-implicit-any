import { ruleTester } from '../../testUtil';
import { rule } from '../../no-implicit-any';

ruleTester.run('object-expression', rule, {
  valid: [
    // { code: 'const foo = { a: 1 }' },
    // { code: 'const foo = { a: null } as any' },
    // { code: 'const foo: any = { a: null }' },
    // { code: 'const foo = ({ ...rest }) => {}' },
  ],
  invalid: [
    // {
    //   code: 'const foo = { a: null }',
    //   output: 'const foo = { a: null as null }',
    //   errors: [{ messageId: 'missingAnyType' }],
    // },
    // {
    //   code: 'const foo = { a: undefined }',
    //   output: 'const foo = { a: undefined as undefined }',
    //   errors: [{ messageId: 'missingAnyType' }],
    // },
    {
      code: 'const foo = { a: [] }',
      output: 'const foo = { a: [] as any[] }',
      errors: [{ messageId: 'missingAnyType' }],
    },
  ],
});
