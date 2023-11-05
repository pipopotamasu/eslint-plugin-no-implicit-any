import { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';

import * as ts from 'typescript';

function checkArg (context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>, arg: TSESTree.Parameter) {
  if (arg['typeAnnotation']) return;

  const parserServices = ESLintUtils.getParserServices(context);
  const type = parserServices.getTypeAtLocation(arg);

  if (type.flags === ts.TypeFlags.Any) {
    context.report({
      node: arg,
      messageId: 'missingAnyType',
      *fix(fixer) {
        const first = context.getSourceCode().getTokenBefore(arg);

        if (first.value !== '(' && arg.parent['params']?.length === 1) {
          // ex: arg => (arg: any)
          yield fixer.insertTextBefore(arg, '(');
          yield fixer.insertTextAfter(arg, ': any)');
        } else {
          // ex: (arg) => (arg: any)
          yield fixer.insertTextAfter(arg, ': any');
        }
      },
    });
  } else if (type.flags === ts.TypeFlags.Object) {
    if (arg.type === AST_NODE_TYPES.ObjectPattern) {
      arg.properties.forEach((property) => {
        if (property.type === AST_NODE_TYPES.Property) {
          if (!property.key['typeAnnotation']) {
            const type = parserServices.getTypeAtLocation(property);
            if (type.flags === ts.TypeFlags.Any) {
              context.report({
                node: arg,
                messageId: 'missingAnyType',
                fix(fixer) {
                  return fixer.insertTextAfter(arg, ': any');
                },
              });
            }
          }
        }
      })
    } else if (type.symbol?.escapedName === 'Array') {
      context.report({
        node: arg,
        messageId: 'missingAnyType',
        fix(fixer) {
          return fixer.insertTextAfter(arg, ': any[]');
        },
      });
    }
  }
}

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'test',
    },
    messages: { missingAnyType: 'Missing any type' },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    return {
      FunctionDeclaration(node) {
        node.params.forEach((arg) => {
          checkArg(context, arg);
        });
      },
      FunctionExpression(node) {
        node.params.forEach((arg) => {
          checkArg(context, arg);
        });
      },
      ArrowFunctionExpression(node) {
        node.params.forEach((arg) => {
          checkArg(context, arg);
        });
      },
      MemberExpression(node) {
        if (node['typeAnnotation']) return;

        const parserServices = ESLintUtils.getParserServices(context);
        const type = parserServices.getTypeAtLocation(node);


        if (type.flags === ts.TypeFlags.Any) {
          context.report({
            node,
            messageId: 'missingAnyType',
            *fix(fixer) {
              const getRangeAdjustment = () => {
                if (!node.optional) return 1;
                if (!node.computed) return 2;
                return 3;
              }

              yield fixer.insertTextBefore(node, '(');
              yield fixer.insertTextBeforeRange([node.property.range[0] - getRangeAdjustment(), node.property.range[1]], ' as any)')
            },
          });
        }
      },
    };
  },
});
