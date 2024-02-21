import { ESLintUtils, type TSESLint } from '@typescript-eslint/utils';
import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';
import { isNullOrUndefinedOrVoid, enabledStrictNullChecks } from '../../helper';

export const lintVariableDeclarator = (
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  node: TSESTree.VariableDeclarator
) => {
  if (
    node.id.typeAnnotation ||
    node.parent.parent.type === AST_NODE_TYPES.ForOfStatement ||
    node.parent.parent.type === AST_NODE_TYPES.ForInStatement ||
    (node.parent.type === AST_NODE_TYPES.VariableDeclaration && node.parent.kind !== 'const')
  )
    return;

  if (node.init === null) {
    return context.report({
      node,
      messageId: 'missingAnyType',
      fix(fixer) {
        return fixer.insertTextAfter(node.id, ': any');
      },
    });
  }

  const parserServices = ESLintUtils.getParserServices(context);
  if (enabledStrictNullChecks(parserServices.program.getCompilerOptions())) return;

  if (isNullOrUndefinedOrVoid(node.init)) {
    context.report({
      node,
      messageId: 'missingAnyType',
      fix(fixer) {
        return fixer.insertTextAfter(node.id, ': any');
      },
    });
  }
};
