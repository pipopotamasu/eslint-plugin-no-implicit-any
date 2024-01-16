import { ESLintUtils, type TSESLint } from "@typescript-eslint/utils";
import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";

import * as ts from "typescript";

export const lintVariableDeclarator = (
  context: Readonly<TSESLint.RuleContext<"missingAnyType", any[]>>,
  node: TSESTree.VariableDeclarator
) => {
  if (
    node.id.typeAnnotation ||
    node.parent.type !== AST_NODE_TYPES.VariableDeclaration
  )
    return;

  const parserServices = ESLintUtils.getParserServices(context);
  const type = parserServices.getTypeAtLocation(node);

  if (type.flags === ts.TypeFlags.Any) {
    context.report({
      node,
      messageId: "missingAnyType",
      fix(fixer) {
        return fixer.insertTextAfter(node.id, ": any");
      },
    });
  }
}
