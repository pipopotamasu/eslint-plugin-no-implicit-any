import { ESLintUtils, type TSESLint } from '@typescript-eslint/utils';
import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';
import { enabledStrictNullChecks, isNull, isUndefined } from '../../helper';

import * as ts from 'typescript';

export const lintPropertyDefinition = (
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  node: TSESTree.PropertyDefinition
) => {
  const key = node.key;
  if (node.typeAnnotation) return;
  if (key.type === AST_NODE_TYPES.Identifier && key.typeAnnotation) return;

  const parserServices = ESLintUtils.getParserServices(context);
  const type = parserServices.getTypeAtLocation(node);
  const value = node.value;

  if (!value && type.flags === ts.TypeFlags.Any) {
    return context.report({
      node,
      messageId: 'missingAnyType',
      *fix(fixer) {
        const propertyName = (key as TSESTree.Identifier).name;
        const text = node.accessibility ? `${node.accessibility} ${propertyName}` : propertyName;
        yield fixer.replaceText(node, text);
        yield fixer.insertTextAfter(node, ': any;');
      },
    });
  }

  if (enabledStrictNullChecks(parserServices.program.getCompilerOptions())) return;
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
};
