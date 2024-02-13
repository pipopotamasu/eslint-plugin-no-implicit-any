import { ESLintUtils } from "@typescript-eslint/utils";

import { lintFunctionDeclaration, lintFunctionExpression, lintArrowFunctionExpression } from './function-args';
import { lintMemberExpression } from './member-expression';
import { lintVariableDeclarator } from './variable-declarator';
import { lintReturnStatement } from './return-statement';

function hasJSExtension (filePath: string) {
  return /\.(js|jsx|mjs|cjs)$/.test(filePath);
}

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/pipopotamasu/eslint-plugin-no-implicit-any',
);

export const rule = createRule({
  name: 'no-implicit-any',
  defaultOptions: [],
  meta: {
    docs: {
      description: "Disallow implicit any",
    },
    type: "problem",
    messages: { missingAnyType: "Detected implicit any. Specify a type." },
    fixable: "code",
    schema: [],
  },
  create: function (context) {
    if (hasJSExtension(context.getFilename())) return {}

    return {
      FunctionDeclaration(node) {
        lintFunctionDeclaration(context, node);
      },
      FunctionExpression(node) {
        lintFunctionExpression(context, node)
      },
      ArrowFunctionExpression(node) {
        lintArrowFunctionExpression(context, node);
      },
      VariableDeclarator(node) {
        lintVariableDeclarator(context, node);
      },
      MemberExpression(node) {
        lintMemberExpression(context, node);
      },
      ReturnStatement(node) {
        lintReturnStatement(context, node);
      }
    };
  },
});

