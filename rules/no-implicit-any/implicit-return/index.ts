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
    bodyType === AST_NODE_TYPES.BlockStatement ||
    bodyType === AST_NODE_TYPES.TSAsExpression ||
    node.returnType ||
    enabledStrictNullChecks(parserServices.program.getCompilerOptions())
  )
    return;

  if (isNull(bodyNode)) {
    context.report({
      node: bodyNode,
      messageId: 'missingAnyType',
      fix(fixer) {
        return fixer.insertTextAfter(bodyNode, ' as null');
      },
    });
  } else if (isUndefined(bodyNode)) {
    context.report({
      node: bodyNode,
      messageId: 'missingAnyType',
      fix(fixer) {
        return fixer.insertTextAfter(bodyNode, ' as undefined');
      },
    });
  } else if (bodyNode.type === AST_NODE_TYPES.ArrayExpression && bodyNode.elements.length === 0) {
    context.report({
      node: bodyNode,
      messageId: 'missingAnyType',
      fix(fixer) {
        return fixer.insertTextAfter(bodyNode, ' as any[]');
      },
    });
  }
};
