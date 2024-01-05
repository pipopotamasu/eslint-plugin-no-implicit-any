import { ESLintUtils, type TSESLint } from "@typescript-eslint/utils";
import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";

import * as ts from "typescript";

function hasObjectTypeAnnotationInAncestors(node: TSESTree.Node) {
  if (node.parent === null) {
    return false;
  } else if (node.parent.type === AST_NODE_TYPES.VariableDeclarator) {
    return node.parent.id.typeAnnotation ? true : false;
  }

  hasObjectTypeAnnotationInAncestors(node.parent);
}

function lintArg(
  context: Readonly<TSESLint.RuleContext<"missingAnyType", any[]>>,
  arg: TSESTree.Parameter
) {
  if (arg["typeAnnotation"]) return;

  const parserServices = ESLintUtils.getParserServices(context);
  const type = parserServices.getTypeAtLocation(arg);

  if (type.flags === ts.TypeFlags.Any) {
    context.report({
      node: arg,
      messageId: "missingAnyType",
      *fix(fixer) {
        const first = context.getSourceCode().getTokenBefore(arg);

        if (first.value !== "(" && arg.parent["params"]?.length === 1) {
          // ex: arg => (arg: any)
          yield fixer.insertTextBefore(arg, "(");
          yield fixer.insertTextAfter(arg, ": any)");
        } else {
          // ex: (arg) => (arg: any)
          yield fixer.insertTextAfter(arg, ": any");
        }
      },
    });
  } else if (type.flags === ts.TypeFlags.Object) {
    if (arg.type === AST_NODE_TYPES.ObjectPattern) {
      arg.properties.forEach((property) => {
        if (property.type === AST_NODE_TYPES.Property) {
          if (!property.key["typeAnnotation"]) {
            const type = parserServices.getTypeAtLocation(property);
            if (type.flags === ts.TypeFlags.Any) {
              context.report({
                node: arg,
                messageId: "missingAnyType",
                fix(fixer) {
                  return fixer.insertTextAfter(arg, ": any");
                },
              });
            }
          }
        }
      });
    } else if (type.symbol?.escapedName === "Array") {
      context.report({
        node: arg,
        messageId: "missingAnyType",
        fix(fixer) {
          return fixer.insertTextAfter(arg, ": any[]");
        },
      });
    }
  }
}

export const lintFunctionDeclaration = (
  context: Readonly<TSESLint.RuleContext<"missingAnyType", any[]>>,
  node: TSESTree.FunctionDeclaration
) => {
  node.params.forEach((arg) => {
    lintArg(context, arg);
  });
};

export const lintFunctionExpression = (
  context: Readonly<TSESLint.RuleContext<"missingAnyType", any[]>>,
  node: TSESTree.FunctionExpression
) => {
  let nodeToLint = node;

  if (node.parent.type === AST_NODE_TYPES.Property) {
    const hasObjectAnnotation = hasObjectTypeAnnotationInAncestors(node.parent.parent);
    if (hasObjectAnnotation) {
      return;
    } else if (node.parent.parent.parent.type === AST_NODE_TYPES.CallExpression) {
      const parserServices = ESLintUtils.getParserServices(context);
      const type = parserServices.getTypeAtLocation(node.parent.parent.parent.callee);
      nodeToLint = parserServices.tsNodeToESTreeNodeMap.get(type.symbol.valueDeclaration)
    };
  }

  nodeToLint.params.forEach((arg) => {
    lintArg(context, arg);
  });
};

export const lintArrowFunctionExpression = (
  context: Readonly<TSESLint.RuleContext<"missingAnyType", any[]>>,
  node: TSESTree.ArrowFunctionExpression
) => {
  let nodeToLint = node;
  if (node.parent.type === AST_NODE_TYPES.CallExpression) return;
  if (node.parent.type === AST_NODE_TYPES.VariableDeclarator && node.parent.id.typeAnnotation) return;
  if (node.parent.type === AST_NODE_TYPES.Property) {
    const hasObjectAnnotation = hasObjectTypeAnnotationInAncestors(node.parent.parent);
    if (hasObjectAnnotation) {
      return;
    } else if (node.parent.parent.parent.type === AST_NODE_TYPES.CallExpression) {
      const parserServices = ESLintUtils.getParserServices(context);
      const type = parserServices.getTypeAtLocation(node.parent.parent.parent.callee);
      nodeToLint = parserServices.tsNodeToESTreeNodeMap.get(type.symbol.valueDeclaration)
    };
  }

  nodeToLint.params.forEach((arg) => {
    lintArg(context, arg);
  });
};

// type Arg = { cb: (arg: any) => void }
// const foo = ({ cb }: Arg) => {};

// foo({
//   cb: function (arg) {},
// });