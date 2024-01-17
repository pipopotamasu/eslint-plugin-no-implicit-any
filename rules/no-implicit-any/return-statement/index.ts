import { ESLintUtils, type TSESLint } from "@typescript-eslint/utils";
import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";

import * as ts from "typescript";

function hasTypeAnnotationInAncestors(node: TSESTree.Node) {
  if (node === null) {
    return false;
  } else if (node.type === AST_NODE_TYPES.ArrowFunctionExpression || node.type === AST_NODE_TYPES.FunctionExpression) {
    if (node.returnType) return true;
  } else if (node.type === AST_NODE_TYPES.VariableDeclarator) {
    if (node.id.typeAnnotation) return true;
  }

  return hasTypeAnnotationInAncestors(node.parent);
}

export const lintReturnStatement = (
  context: Readonly<TSESLint.RuleContext<"missingAnyType", any[]>>,
  node: TSESTree.ReturnStatement
) => {
  const parserServices = ESLintUtils.getParserServices(context);
  const { strictNullChecks, strict } = parserServices.program.getCompilerOptions();
  if (strictNullChecks) return;
  if (strictNullChecks === undefined && strict) return;
  if (hasTypeAnnotationInAncestors(node.parent)) return;

  const type = parserServices.getTypeAtLocation(node.argument);

  if (type.flags === ts.TypeFlags.Any || type.flags === ts.TypeFlags.Null || type.flags === ts.TypeFlags.Undefined) {
    context.report({
      node: node,
      messageId: "missingAnyType",
      fix(fixer) {
        return fixer.insertTextAfter(node, " as any");
      },
    });
  }
}
