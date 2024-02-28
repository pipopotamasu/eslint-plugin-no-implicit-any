import { ruleTester } from '../../testUtil';
import { rule } from '../../no-implicit-any';

ruleTester.run('return-statement', rule, {
  valid: [
    {
      code: 'const foo = () => { return 1 }',
    },
    {
      code: 'const foo = (): any => { return null }',
    },
    {
      code: 'const foo: any = () => { return null }',
    },
    {
      code: 'const foo = () => { return null as any }',
    },
    {
      code: 'const foo = () => {}',
    },
    {
      code: `
          const foo = (arg: boolean) => {
            if (arg) return;
            return 'bar';
          }
        `,
    },
    {
      code: `
          const foo = (arg1: boolean, arg2: boolean) => {
            if (arg1) {
              return null;
            };

            if (arg2) {
              return 'bar';
            }
          }
        `,
    },
    {
      code: `
          const foo = (arg: string) => {
            switch (arg) {
              case 'first':
                return 'first';
              case 'second': {
                return 'second';
              }
              case 'third and forth':
                return 'third and forth';
              default:
                return null;
            }
          }
        `,
    },
    {
      code: `
          function foo (arg: boolean) {
            while (true) {
              if (arg) {
                return null;
              } else {
                break;
              }
            }

            return 'bar';
          }
        `,
    },
    {
      code: `
          const foo = (arg: any) => {
            return undefined || null || arg;
          }
        `,
    },
    {
      code: `
          const foo = (arg: any) => {
            return arg?.name;
          }
        `,
    },
    {
      code: `
        const fn = (): any => {}
        const foo = (hoge?: () => void, arg?: any) => {
          if (hoge) {
            hoge();
          } else if (arg) {
            return fn() + arg;
          } else {
            return fn();
          }
        }
      `,
    },
    {
      code: `
        function foo () {
          try {
            return doSomethingMightHaveError();
          } catch {
            throw new Error('error');
          } finally {
            return null;
          }
        }
      `,
    },
    {
      code: `
        function foo () {
          try {
            doSomethingMightHaveError();
            return null;
          } catch {
            return 'error'
          }
        }
      `,
    },
  ],
  invalid: [
    {
      code: 'const foo = () => { return null }',
      output: 'const foo = () => { return null as null }',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: 'const foo = () => { return undefined }',
      output: 'const foo = () => { return undefined as undefined }',
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: `
          const foo = () => {
            return undefined || null || undefined;
          }
        `,
      output: `
          const foo = () => {
            return undefined || null || undefined as any;
          }
        `,
      errors: [{ messageId: 'missingAnyType' }],
    },
    {
      code: `
          const foo = () => {
            return undefined && null && undefined;
          }
        `,
      output: `
          const foo = () => {
            return undefined && null && undefined as any;
          }
        `,
      errors: [{ messageId: 'missingAnyType' }],
    },
  ],
});
