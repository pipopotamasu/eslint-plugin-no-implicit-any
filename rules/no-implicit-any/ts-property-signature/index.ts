import { ESLintUtils, type TSESLint } from '@typescript-eslint/utils';
import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';
import { enabledStrictNullChecks, isNull, isUndefined } from '../../helper';

export const lintTSPropertySignature = (
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  node: TSESTree.TSPropertySignature
) => {
  console.log(node);
  if (!node.typeAnnotation) {
    context.report({
      node,
      messageId: 'missingAnyType',
      fix(fixer) {
        return fixer.insertTextAfter(node, ': any');
      },
    });
  }
};
