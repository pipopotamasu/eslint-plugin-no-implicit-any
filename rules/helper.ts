import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';
import type { CompilerOptions } from 'typescript';

export function isNullOrUndefinedOrVoid(node: TSESTree.Expression) {
  if (node.type === AST_NODE_TYPES.Literal) {
    return node.value === null;
  } else if (node.type === AST_NODE_TYPES.Identifier) {
    return node.name === 'undefined';
  } else if (node.type === AST_NODE_TYPES.UnaryExpression) {
    return node.operator === 'void';
  }

  return false;
}

export function enabledStrictNullChecks(compilerOptions: CompilerOptions) {
  const { strictNullChecks, strict } = compilerOptions;
  if (strictNullChecks) return true;
  if (strictNullChecks === undefined && strict) return true;
  return false;
}
