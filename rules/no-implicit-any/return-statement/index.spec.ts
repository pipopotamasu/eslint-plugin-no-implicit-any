import { ruleTester } from '../../testUtil';
import { rule } from '../../no-implicit-any';

ruleTester.run(
  'return-statement',
  rule,
  {
    valid: [
      {
        code: 'const foo = () => { return 1 }'
      },
      {
        code: 'const foo = (): any => { return null }'
      },
      {
        code: 'const foo: any = () => { return null }'
      },
      {
        code: 'const foo = () => { return null as any }'
      },
    ],
    invalid: [
      {
        code: 'const foo = () => { return null }',
        output: 'const foo = () => { return null as any }',
        errors: [{ messageId: 'missingAnyType' }]
      },
      {
        code: 'const foo = () => { return null; }',
        output: 'const foo = () => { return null as any; }',
        errors: [{ messageId: 'missingAnyType' }]
      },
      {
        code: 'const foo = () => { return undefined }',
        output: 'const foo = () => { return undefined as any }',
        errors: [{ messageId: 'missingAnyType' }]
      },
    ],
  }
);
