import { ruleTester } from '../../testUtil';
import { rule } from '../../no-implicit-any';

ruleTester.run('implicit-return', rule, {
  valid: [
    { code: 'const foo = () => { return 1 }' },
    { code: 'const foo = () => 1' },
    { code: 'const foo = () => null as null' },
    { code: 'const foo = () => (null as null)' },
    { code: 'const foo = () => (null) as null' },
    { code: 'const foo = (): null => null' },
  ],
  invalid: [
    {
      code: 'const foo = () => null',
      output: 'const foo = () => null as null',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = () => (null)',
      output: 'const foo = () => (null as null)',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = () => undefined',
      output: 'const foo = () => undefined as undefined',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = () => (undefined)',
      output: 'const foo = () => (undefined as undefined)',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = () => []',
      output: 'const foo = () => [] as any[]',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = () => ([])',
      output: 'const foo = () => ([] as any[])',
      errors: [{ messageId: 'missingAnyType' }],
    },
  ],
});
