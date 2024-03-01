import { ESLintUtils, type TSESLint } from '@typescript-eslint/utils';
import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';
import { enabledStrictNullChecks, isNull, isUndefined } from '../../helper';

export const lintObjectExpression = (
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  node: TSESTree.ObjectExpression
) => {
  const parserServices = ESLintUtils.getParserServices(context);
  if (enabledStrictNullChecks(parserServices.program.getCompilerOptions())) return;

  const parent = node.parent;
  if (parent.type === AST_NODE_TYPES.TSAsExpression) return;
  if (parent.type === AST_NODE_TYPES.VariableDeclarator && parent.id.typeAnnotation) return;

  node.properties.forEach((property) => {
    if (property.type === AST_NODE_TYPES.SpreadElement) return;

    const value = property.value;

    if (isNull(value) || isUndefined(value)) {
      context.report({
        node: value,
        messageId: 'missingAnyType',
        fix(fixer) {
          return fixer.insertTextAfter(value, ' as any');
        },
      });
    } else if (value.type === AST_NODE_TYPES.ArrayExpression && value.elements.length === 0) {
      context.report({
        node: value,
        messageId: 'missingAnyType',
        fix(fixer) {
          return fixer.insertTextAfter(value, ' as any[]');
        },
      });
    }
  });
};
