import { ESLintUtils } from '@typescript-eslint/utils';

import {
  lintArgsOfFunctionDeclaration,
  lintArgsOfFunctionExpression,
  lintArgsOfArrowFunctionExpression,
  lintArgsOfTSFunctionType,
} from './function-args';
import { lintMemberExpression } from './member-expression';
import { lintVariableDeclarator } from './variable-declarator';
import { lintReturnStatement } from './return-statement';
import { lintImplicitReturn } from './implicit-return';
import { lintObjectExpression } from './object-expression';
import { lintTSPropertySignature } from './ts-property-signature';

function hasJSExtension(filePath: string) {
  return /\.(js|jsx|mjs|cjs)$/.test(filePath);
}

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/pipopotamasu/eslint-plugin-no-implicit-any'
);

export const rule = createRule({
  name: 'no-implicit-any',
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow implicit any',
    },
    type: 'problem',
    messages: { missingAnyType: 'Detected implicit any. Specify a type.' },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    if (hasJSExtension(context.getFilename())) return {};

    return {
      FunctionDeclaration(node) {
        lintArgsOfFunctionDeclaration(context, node);
      },
      FunctionExpression(node) {
        lintArgsOfFunctionExpression(context, node);
      },
      ArrowFunctionExpression(node) {
        lintArgsOfArrowFunctionExpression(context, node);
        lintImplicitReturn(context, node);
      },
      TSFunctionType(node) {
        lintArgsOfTSFunctionType(context, node);
      },
      VariableDeclarator(node) {
        lintVariableDeclarator(context, node);
      },
      MemberExpression(node) {
        lintMemberExpression(context, node);
      },
      ReturnStatement(node) {
        lintReturnStatement(context, node);
      },
      ObjectExpression(node) {
        lintObjectExpression(context, node);
      },
      TSPropertySignature(node) {
        lintTSPropertySignature(context, node)
      }
    };
  },
});
