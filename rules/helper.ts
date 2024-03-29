import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';
import type { CompilerOptions } from 'typescript';

export function isNull(node: TSESTree.Node) {
  return node.type === AST_NODE_TYPES.Literal && node.value === null;
}

export function isUndefined(node: TSESTree.Node) {
  return node.type === AST_NODE_TYPES.Identifier && node.name === 'undefined';
}

export function isVoid(node: TSESTree.Node) {
  return node.type === AST_NODE_TYPES.UnaryExpression && node.operator === 'void';
}

export function isNullOrUndefinedOrVoid(node: TSESTree.Expression) {
  if (isNull(node)) return true;
  if (isUndefined(node)) return true;
  if (isVoid(node)) return true;
  return false;
}

export function enabledStrictNullChecks(compilerOptions: CompilerOptions) {
  const { strictNullChecks, strict } = compilerOptions;
  if (strictNullChecks) return true;
  if (strictNullChecks === undefined && strict) return true;
  return false;
}
