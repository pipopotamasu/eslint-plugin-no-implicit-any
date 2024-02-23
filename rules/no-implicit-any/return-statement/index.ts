import { ESLintUtils, type TSESLint } from '@typescript-eslint/utils';
import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/types';
import { isNullOrUndefinedOrVoid, enabledStrictNullChecks } from '../../helper';

function hasTypeAnnotationInAncestors(node: TSESTree.Node) {
  if (node === null) {
    return false;
  } else if (
    node.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    node.type === AST_NODE_TYPES.FunctionExpression
  ) {
    if (node.returnType) return true;
  } else if (node.type === AST_NODE_TYPES.VariableDeclarator) {
    if (node.id.typeAnnotation) return true;
  }

  return hasTypeAnnotationInAncestors(node.parent);
}

function getFunctionNode(node: TSESTree.Node) {
  if (
    node.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    node.type === AST_NODE_TYPES.FunctionExpression ||
    node.type === AST_NODE_TYPES.FunctionDeclaration
  )
    return node;
  return getFunctionNode(node.parent);
}

function getReturnStatementNode(node: TSESTree.Statement) {
  switch (node.type) {
    case AST_NODE_TYPES.IfStatement:
      return getReturnStatementNode(node.consequent);
    case AST_NODE_TYPES.ReturnStatement:
      return node;
    case AST_NODE_TYPES.BlockStatement:
      return getReturnStatementNodes(node.body);
    default:
      return null;
  }
}

function getReturnStatementNodes(nodes: TSESTree.Statement[]) {
  const returnStatementNodes = [];

  for (const node of nodes) {
    switch (node.type) {
      case AST_NODE_TYPES.BlockStatement:
        returnStatementNodes.push(getReturnStatementNodes(node.body));
        break;
      case AST_NODE_TYPES.WhileStatement:
        returnStatementNodes.push(getReturnStatementNodes([node.body]));
        break;
      case AST_NODE_TYPES.SwitchStatement:
        node.cases.forEach((caseNode) => {
          returnStatementNodes.push(getReturnStatementNodes(caseNode.consequent));
        });
        break;
      case AST_NODE_TYPES.TryStatement:
        returnStatementNodes.push(getReturnStatementNodes(node.block.body));
        if (node.handler) returnStatementNodes.push(getReturnStatementNode(node.handler.body));
        if (node.finalizer) returnStatementNodes.push(getReturnStatementNodes(node.finalizer.body));
        break;
      case AST_NODE_TYPES.IfStatement:
        returnStatementNodes.push(getReturnStatementNode(node.consequent));
        if (node.alternate) returnStatementNodes.push(getReturnStatementNode(node.alternate));
        break;
      case AST_NODE_TYPES.ReturnStatement:
        returnStatementNodes.push(node);
        break;
    }
  }

  return returnStatementNodes.flat(Infinity).filter(Boolean);
}

function isAllNullOrUndefinedOrVoid(node: TSESTree.LogicalExpression) {
  const { left, right } = node;
  if (left.type === AST_NODE_TYPES.LogicalExpression) {
    return isAllNullOrUndefinedOrVoid(left) && isNullOrUndefinedOrVoid(right);
  }

  return isNullOrUndefinedOrVoid(left) && isNullOrUndefinedOrVoid(right);
}

export const lintReturnStatement = (
  context: Readonly<TSESLint.RuleContext<'missingAnyType', any[]>>,
  node: TSESTree.ReturnStatement
) => {
  if (!node.argument || node.argument['typeAnnotation']) return;

  const parserServices = ESLintUtils.getParserServices(context);
  if (enabledStrictNullChecks(parserServices.program.getCompilerOptions())) return;
  if (hasTypeAnnotationInAncestors(node.parent)) return;

  const functionNode = getFunctionNode(node.parent);
  if (functionNode.body.type !== AST_NODE_TYPES.BlockStatement) return;
  const returnStatementNodes = getReturnStatementNodes(functionNode.body.body);
  let shouldReport = true;

  for (const returnStatementNode of returnStatementNodes) {
    if (!returnStatementNode.argument) continue;
    if (returnStatementNode.argument.type === AST_NODE_TYPES.LogicalExpression) {
      if (!isAllNullOrUndefinedOrVoid(returnStatementNode.argument)) {
        shouldReport = false;
        break;
      }

      continue;
    }

    if (!isNullOrUndefinedOrVoid(returnStatementNode.argument)) {
      shouldReport = false;
      break;
    }
  }

  if (shouldReport) {
    context.report({
      node: node,
      messageId: 'missingAnyType',
      fix(fixer) {
        return fixer.insertTextAfter(node.argument, ' as any');
      },
    });
  }
};
