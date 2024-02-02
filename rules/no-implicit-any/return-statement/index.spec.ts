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
      {
        code: 'const foo = () => {}'
      },
      {
        code: `
          const foo = (bool: boolean) => {
            if (bool) return;
            return 'bar';
          }
        `
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
