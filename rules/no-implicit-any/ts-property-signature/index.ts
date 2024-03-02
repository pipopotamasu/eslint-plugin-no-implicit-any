import { type TSESLint } from '@typescript-eslint/utils';
import { type TSESTree } from '@typescript-eslint/types';

export const lintTSPropertySignature = (
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  node: TSESTree.TSPropertySignature
) => {
  if (!node.typeAnnotation) {
    context.report({
      node,
      messageId: 'missingAnyType',
      *fix(fixer) {
        const key = node.key as TSESTree.Identifier;
        yield fixer.replaceText(node, key.name);
        yield fixer.insertTextAfter(node, ': any;');
      },
    });
  }
};
