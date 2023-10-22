import { ESLintUtils } from '@typescript-eslint/utils';
import * as ts from 'typescript';

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
          if (!param['typeAnnotation']) {
            const parserServices = ESLintUtils.getParserServices(context);
            const type = parserServices.getTypeAtLocation(param);

            if (type.flags === ts.TypeFlags.Any) {
              context.report({
                node,
                messageId: 'missingAnyType',
                fix(fixer) {
                  return fixer.insertTextAfter(param, ': any');
                },
              });
            }
          }
        });
      },
      FunctionExpression(node) {
        node.params.forEach((param) => {
          if (!param['typeAnnotation']) {
            const parserServices = ESLintUtils.getParserServices(context);
            const type = parserServices.getTypeAtLocation(param);

            if (type.flags === ts.TypeFlags.Any) {
              context.report({
                node,
                messageId: 'missingAnyType',
                fix(fixer) {
                  return fixer.insertTextAfter(param, ': any');
                },
              });
            }
          }
        });
      },
      ArrowFunctionExpression(node) {
        node.params.forEach((param) => {
          if (!param['typeAnnotation']) {
            const parserServices = ESLintUtils.getParserServices(context);
            const type = parserServices.getTypeAtLocation(param);

            if (type.flags === ts.TypeFlags.Any) {
              context.report({
                node,
                messageId: 'missingAnyType',
                fix(fixer) {
                  return fixer.insertTextAfter(param, ': any');
                },
              });
            }
          }
        });
      },
    };
  },
});