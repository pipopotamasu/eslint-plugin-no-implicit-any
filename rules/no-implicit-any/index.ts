import { ESLintUtils } from "@typescript-eslint/utils";

import { lintFunctionDeclaration, lintFunctionExpression, lintArrowFunctionExpression } from './function-args';
import { lintMemberExpression } from './member-expression';
import { lintVariableDeclarator } from './variable-declarator';

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
    messages: { missingAnyType: "Missing any type" },
    fixable: "code",
    schema: [],
  },
  create: function (context) {
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
    };
  },
});
