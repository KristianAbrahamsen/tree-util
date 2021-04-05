const treefunctions = require('./treefunctions.js');

var exports = {};

let createDetachedNode = null;

// Builds trees based on an object array object and a config object which defines the parent child id relationship
exports.buildTrees = function(objectArray, config) {
  if(!objectArray) throw 'objectArray is mandatory';
  if(!config) throw 'config is mandatory';
  if(!config.id) throw 'config property id is not set';
  if(!config.parentid) throw 'config property parentid is not set';

  this.config = config;

  createDetachedNode = function (dataObj) {
    const node = {};

    node.id = dataObj[config.id];
    node.parentid = dataObj[config.parentid];
    node.children = [];
    node.dataObj = dataObj;
    node.collectionnames = [];

    //functions added from treefunctions object
    node.addChild = treefunctions.addChild;
    node.removeChild = treefunctions.removeChild;
    node.addParent = treefunctions.addParent;
    node.removeParent = treefunctions.removeParent;
    node.getAncestors = treefunctions.getAncestors;
    node.getDescendants = treefunctions.getDescendants;
    node.getRecursiveCollection = treefunctions.getRecursiveCollection;
    node.getRecursiveNodeData = treefunctions.getRecursiveNodeData;
    node.getSingleNodeData = treefunctions.getSingleNodeData;
    node.isAncestorOf = treefunctions.isAncestorOf;
    node.isDescendantOf = treefunctions.isDescendantOf;
    node.isLeaf = treefunctions.isLeaf;
    node.removeAllDescendants = treefunctions.removeAllDescendants;

    if(this.getNodeById) {
      const parentNode = this.getNodeById(node.parentid);

      if(!parentNode) throw 'Could not find parent node. Does not belong to tree';

      parentNode.addChild(node);
    }

    return node;
  }

  const trees = [];
  const rootNodes = [];
  const nodeById = {};

  for (var i = 0; i < objectArray.length; i++) {
    const obj = objectArray[i];
    const node = createDetachedNode(obj);
    nodeById[obj[config.id]] = node;

    if(!obj[config.parentid]) {
      rootNodes.push(node);
    }
  }

  for (var i = 0; i < objectArray.length; i++) {
    const obj = objectArray[i];
    const node = nodeById[obj[config.id]];
    const parentId = node.dataObj[config.parentid];

    if(parentId) {
      var parentNode = nodeById[parentId];
      node.addParent(parentNode);
    } else {
      node.parent = null;
    }
  }

  for (var i = 0; i < rootNodes.length; i++) {
    const rootNode = rootNodes[i];
    const tree = createTree(rootNode, nodeById);
    tree.config = config;
    tree.createDetachedNode = createDetachedNode;

    trees.push(tree);
  }

  return trees;
}

// Creates a tree by a defined root node and a nodeById dictionary
var createTree = function(rootNode, nodeById) {
  if(!rootNode) throw 'rootNode is mandatory';
  if(!nodeById) throw 'nodeById is mandatory';

  const tree = {};
  tree._nodeById = nodeById;

  const getNodeById = function(id) {
    return tree._nodeById[id];
  }

  tree.rootNode = rootNode;
  tree.addData = treefunctions.addData;

  tree.createNode = function (dataObj) {
    const result = tree.createDetachedNode(dataObj);

    tree._nodeById[result.id] = result;

    return result;
  }

  tree.getNodeById = getNodeById;

  return tree;
}

module.exports = exports;
