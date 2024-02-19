import { ruleTester } from '../../testUtil';
import { rule } from '../../no-implicit-any';

ruleTester.run('member-expression', rule, {
  valid: [
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
        `,
    },
    {
      code: `
          const foo = { key: { key2: {} } };
          (foo['key']['key2'] as any)['key3'];
        `,
    },
    {
      code: `
          const foo = {};
          (foo as any)['key']['key2'];
        `,
    },
    {
      code: `
          const foo = {};
          (foo as any).key1.key2;
        `,
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
        `,
    },
    {
      code: `
          const foo: { key: any } = { key: '' };
          foo.key;
        `,
    },
  ],
  invalid: [
    {
      code: `
          const foo = {};
          foo['key'];
        `,
      output: `
          const foo = {};
          (foo as any)['key'];
        `,
      errors: [{ messageId: 'missingAnyType' }],
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
      errors: [{ messageId: 'missingAnyType' }],
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
      errors: [{ messageId: 'missingAnyType' }],
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
      errors: [{ messageId: 'missingAnyType' }],
    },
  ],
});
