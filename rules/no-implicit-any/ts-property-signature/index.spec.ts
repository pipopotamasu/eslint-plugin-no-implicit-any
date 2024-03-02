import { ruleTester } from '../../testUtil';
import { rule } from '../../no-implicit-any';

ruleTester.run('ts-property-signature', rule, {
  valid: [
    {
      code: `
        type Foo = {
          property1: string;
          nestedObject: {
            property2: number;
          }
        }
      `,
    },
    {
      code: `
      interface Foo {
        property1: string;
        nestedObject: {
          property2: number;
        }
      }
    `,
    },
  ],
  invalid: [
    {
      code: `
        interface Foo {
          property1;
          nestedObject: {
            property2
          }
        }
      `,
      output: `
        interface Foo {
          property1: any;
          nestedObject: {
            property2: any;
          }
        }
      `,
      errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
    },
    {
      code: `
        type Foo = {
          property1;
          nestedObject: {
            property2
          }
        }
      `,
      output: `
        type Foo = {
          property1: any;
          nestedObject: {
            property2: any;
          }
        }
      `,
      errors: [{ messageId: 'missingAnyType' }, { messageId: 'missingAnyType' }],
    },
  ],
});
