import { ESLintUtils, type TSESLint } from '@typescript-eslint/utils';
import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';

import * as ts from 'typescript';

function hasObjectTypeAnnotationInAncestors(node: TSESTree.Node) {
  if (node.parent === null) {
    return false;
  } else if (node.parent.type === AST_NODE_TYPES.VariableDeclarator) {
    return node.parent.id.typeAnnotation ? true : false;
  }

  return hasObjectTypeAnnotationInAncestors(node.parent);
}

function lintArg(
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  arg: TSESTree.Parameter | TSESTree.AssignmentPattern
) {
  if (arg['typeAnnotation']) return;

  const parserServices = ESLintUtils.getParserServices(context);

  if (arg.type === AST_NODE_TYPES.AssignmentPattern) {
    const type = parserServices.getTypeAtLocation(arg.left);
    if (!arg.left.typeAnnotation && type.flags === ts.TypeFlags.Any) {
      context.report({
        node: arg.left,
        messageId: 'missingAnyType',
        fix(fixer) {
          return fixer.insertTextAfter(arg.left, ': any');
        },
      });
    }
    return;
  }

  const type = parserServices.getTypeAtLocation(arg);

  if (type.flags === ts.TypeFlags.Any) {
    context.report({
      node: arg,
      messageId: 'missingAnyType',
      *fix(fixer) {
        const after = context.getSourceCode().getTokenAfter(arg);

        if (arg.parent['params']?.length === 1 && after.value == '=>') {
          // ex: arg => (arg: any)
          yield fixer.insertTextBefore(arg, '(');
          yield fixer.insertTextAfter(arg, ': any)');
        } else {
          // ex: (arg) => (arg: any)
          yield fixer.insertTextAfter(arg, ': any');
        }
      },
    });
  } else if (type.flags === ts.TypeFlags.Object) {
    if (arg.type === AST_NODE_TYPES.ObjectPattern) {
      arg.properties.forEach((property) => {
        if (property.type === AST_NODE_TYPES.Property) {
          if (!property.key['typeAnnotation']) {
            const type = parserServices.getTypeAtLocation(property);
            if (type.flags === ts.TypeFlags.Any) {
              context.report({
                node: arg,
                messageId: 'missingAnyType',
                fix(fixer) {
                  return fixer.insertTextAfter(arg, ': any');
                },
              });
            }
          }
        }
      });
    } else if (type.symbol?.escapedName === 'Array') {
      context.report({
        node: arg,
        messageId: 'missingAnyType',
        fix(fixer) {
          return fixer.insertTextAfter(arg, ': any[]');
        },
      });
    }
  }
}

export const lintFunctionDeclaration = (
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  node: TSESTree.FunctionDeclaration
) => {
  node.params.forEach((arg) => {
    lintArg(context, arg);
  });
};

export const lintFunctionExpression = (
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  node: TSESTree.FunctionExpression
) => {
  let nodeToLint = node;

  // For react component props
  if (node.parent.type === AST_NODE_TYPES.JSXExpressionContainer) return;
  if (node.parent.type === AST_NODE_TYPES.CallExpression) {
    const parserServices = ESLintUtils.getParserServices(context);
    const type = parserServices.getTypeAtLocation(node.parent.callee);

    if (type.symbol && type.symbol.valueDeclaration) {
      nodeToLint = parserServices.tsNodeToESTreeNodeMap.get(type.symbol.valueDeclaration);
      if (!nodeToLint) return;
    } else if (node.parent.callee.type === AST_NODE_TYPES.Identifier) {
      return;
    }
  }
  if (node.parent.type === AST_NODE_TYPES.Property) {
    const hasObjectAnnotation = hasObjectTypeAnnotationInAncestors(node.parent.parent);
    if (hasObjectAnnotation) {
      return;
    } else if (node.parent.parent.parent.type === AST_NODE_TYPES.CallExpression) {
      const parserServices = ESLintUtils.getParserServices(context);
      const type = parserServices.getTypeAtLocation(node.parent.parent.parent.callee);
      if (type.symbol && type.symbol.valueDeclaration) {
        nodeToLint = parserServices.tsNodeToESTreeNodeMap.get(type.symbol.valueDeclaration);
        if (!nodeToLint) return;
      }
    };
  }

  nodeToLint.params.forEach((arg) => {
    lintArg(context, arg);
  });
};

export const lintArrowFunctionExpression = (
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  node: TSESTree.ArrowFunctionExpression
) => {
  let nodeToLint = node;
  if (node.parent.type === AST_NODE_TYPES.VariableDeclarator && node.parent.id.typeAnnotation) return;
  // For react component props
  if (node.parent.type === AST_NODE_TYPES.JSXExpressionContainer) return;
  if (node.parent.type === AST_NODE_TYPES.CallExpression) {
    const parserServices = ESLintUtils.getParserServices(context);
    const type = parserServices.getTypeAtLocation(node.parent.callee);

    if (type.symbol && type.symbol.valueDeclaration) {
      nodeToLint = parserServices.tsNodeToESTreeNodeMap.get(type.symbol.valueDeclaration);
      if (!nodeToLint) return;
    } else if (node.parent.callee.type === AST_NODE_TYPES.Identifier) {
      return;
    }
  }
  if (node.parent.type === AST_NODE_TYPES.Property) {
    const hasObjectAnnotation = hasObjectTypeAnnotationInAncestors(node.parent.parent);
    if (hasObjectAnnotation) {
      return;
    } else if (node.parent.parent.parent.type === AST_NODE_TYPES.CallExpression) {
      const parserServices = ESLintUtils.getParserServices(context);
      const type = parserServices.getTypeAtLocation(node.parent.parent.parent.callee);
      if (type.symbol && type.symbol.valueDeclaration) {
        nodeToLint = parserServices.tsNodeToESTreeNodeMap.get(type.symbol.valueDeclaration);
        if (!nodeToLint) return;
      }
    };
  }

  nodeToLint.params.forEach((arg) => {
    lintArg(context, arg);
  });
};
