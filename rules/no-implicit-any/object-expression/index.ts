import { ESLintUtils, type TSESLint } from '@typescript-eslint/utils';
import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';
import { isNullOrUndefinedOrVoid, enabledStrictNullChecks, isNull, isUndefined } from '../../helper';


export const lintObjectExpression = (
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  node: TSESTree.ObjectExpression
) => {
  const parent = node.parent;
  if (parent.type === AST_NODE_TYPES.TSAsExpression) return;
  if (parent.type === AST_NODE_TYPES.VariableDeclarator && parent.id.typeAnnotation) return;

  node.properties.forEach(property => {
    if (property.type === AST_NODE_TYPES.SpreadElement) return;

    const value = property.value;

    if (isNull(value)) {
      context.report({
        node: value,
        messageId: 'missingAnyType',
        fix(fixer) {
          return fixer.insertTextAfter(value, ' as null');
        },
      });
    } else if (isUndefined(value)) {
      context.report({
        node: value,
        messageId: 'missingAnyType',
        fix(fixer) {
          return fixer.insertTextAfter(value, ' as undefined');
        },
      });
    }
  });
};

