import { ESLintUtils, type TSESLint } from '@typescript-eslint/utils';
import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';
import { isNull, isUndefined, enabledStrictNullChecks } from '../../helper';

export const lintImplicitReturn = (
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  node: TSESTree.ArrowFunctionExpression
) => {
  const bodyNode = node.body;
  const bodyType = bodyNode.type;
  const parserServices = ESLintUtils.getParserServices(context);
  if (
    enabledStrictNullChecks(parserServices.program.getCompilerOptions()) ||
    bodyType === AST_NODE_TYPES.BlockStatement ||
    bodyType === AST_NODE_TYPES.TSAsExpression ||
    node.returnType
  )
    return;

  const targetNode = bodyType === AST_NODE_TYPES.AssignmentExpression ? bodyNode.right : bodyNode;

  if (isNull(targetNode)) {
    context.report({
      node: targetNode,
      messageId: 'missingAnyType',
      fix(fixer) {
        return fixer.insertTextAfter(targetNode, ' as null');
      },
    });
  } else if (isUndefined(targetNode)) {
    context.report({
      node: targetNode,
      messageId: 'missingAnyType',
      fix(fixer) {
        return fixer.insertTextAfter(targetNode, ' as undefined');
      },
    });
  } else if (
    targetNode.type === AST_NODE_TYPES.ArrayExpression &&
    targetNode.elements.length === 0
  ) {
    context.report({
      node: targetNode,
      messageId: 'missingAnyType',
      fix(fixer) {
        return fixer.insertTextAfter(targetNode, ' as any[]');
      },
    });
  }
};
