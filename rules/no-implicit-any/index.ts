import { ESLintUtils } from "@typescript-eslint/utils";
import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import * as ts from "typescript";

import { lintFunctionDeclaration, lintFunctionExpression, lintArrowFunctionExpression } from './function-args';

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  defaultOptions: [],
  meta: {
    type: "problem",
    docs: {
      description: "test",
    },
    messages: { missingAnyType: "Missing any type" },
    fixable: "code",
    schema: [],
  },
  create: function (context) {
    return {
      FunctionDeclaration(node) {
        lintFunctionDeclaration(context, node);
      },
      FunctionExpression(node) {
        lintFunctionExpression(context, node)
      },
      ArrowFunctionExpression(node) {
        lintArrowFunctionExpression(context, node);
      },
      VariableDeclarator(node) {
        if (
          node.id.typeAnnotation ||
          node.parent.type !== AST_NODE_TYPES.VariableDeclaration
        )
          return;
        const kind = node.parent.kind;
        if (kind !== "let" && kind !== "var") return;

        const parserServices = ESLintUtils.getParserServices(context);
        const type = parserServices.getTypeAtLocation(node);

        if (type.flags === ts.TypeFlags.Any) {
          context.report({
            node,
            messageId: "missingAnyType",
            fix(fixer) {
              return fixer.insertTextAfter(node, ": any");
            },
          });
        }
      },
      MemberExpression(node) {
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
      },
    };
  },
});

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
