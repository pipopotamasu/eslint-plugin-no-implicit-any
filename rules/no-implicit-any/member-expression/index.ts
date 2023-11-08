import { ESLintUtils, type TSESLint } from "@typescript-eslint/utils";
import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";

import * as ts from "typescript";

function hasAnyAnnotationInAncestors(node: TSESTree.MemberExpression) {
  if (!node.object) return false;
  if (!node.object["typeAnnotation"])
    return hasAnyAnnotationInAncestors(
      node.object as TSESTree.MemberExpression
    );
  if (node.object["typeAnnotation"].type === AST_NODE_TYPES.TSAnyKeyword)
    return true;
  return false;
}

export const lintMemberExpression = (
  context: Readonly<TSESLint.RuleContext<"missingAnyType", any[]>>,
  node: TSESTree.MemberExpression
) => {
  if (!node.computed || hasAnyAnnotationInAncestors(node)) return;

  const parserServices = ESLintUtils.getParserServices(context);
  const nodeType = parserServices.getTypeAtLocation(node);
  const objType = parserServices.getTypeAtLocation(node.object);

  if (
    nodeType.flags === ts.TypeFlags.Any &&
    objType.symbol.escapedName === "__object"
  ) {
    context.report({
      node,
      messageId: "missingAnyType",
      *fix(fixer) {
        const getRangeAdjustment = () => {
          if (!node.optional) return 1;
          if (!node.computed) return 2;
          return 3;
        };

        yield fixer.insertTextBefore(node, "(");
        yield fixer.insertTextBeforeRange(
          [
            node.property.range[0] - getRangeAdjustment(),
            node.property.range[1],
          ],
          " as any)"
        );
      },
    });
  }
}