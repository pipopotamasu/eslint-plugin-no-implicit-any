import { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';

import * as ts from 'typescript';

function checkParam (context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>, param: TSESTree.Parameter) {
  if (!param['typeAnnotation']) {
    const parserServices = ESLintUtils.getParserServices(context);
    const type = parserServices.getTypeAtLocation(param);

    if (type.flags === ts.TypeFlags.Any) {
      context.report({
        node: param,
        messageId: 'missingAnyType',
        fix(fixer) {
          return fixer.insertTextAfter(param, ': any');
        },
      });
    } else if (type.flags === ts.TypeFlags.Object) {
      (param as TSESTree.ObjectPattern).properties.forEach((property) => {
        if (property.type === AST_NODE_TYPES.Property) {
          if (!property.key['typeAnnotation']) {
            const type = parserServices.getTypeAtLocation(property);
            if (type.flags === ts.TypeFlags.Any) {
              context.report({
                node: param,
                messageId: 'missingAnyType',
                fix(fixer) {
                  return fixer.insertTextAfter(param, ': any');
                },
              });
            }
          }
        }
      })
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
        node.params.forEach((param) => {
          checkParam(context, param);
        });
      },
      FunctionExpression(node) {
        node.params.forEach((param) => {
          checkParam(context, param);
        });
      },
      ArrowFunctionExpression(node) {
        node.params.forEach((param) => {
          checkParam(context, param);
        });
      },
    };
  },
});