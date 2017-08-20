var treefunctions = require('./treefunctions.js');

var exports = {};

// Builds trees based on an object array object and a config object which defines the parent child id relationship
exports.buildTrees = function(objectArray, config) {
  if(!objectArray) throw 'objectArray is mandatory';
  if(!config) throw 'config is mandatory';
  if(!config.id) throw 'config property id is not set';
  if(!config.parentid) throw 'config property parentid is not set';

  this.config = config;

  var createNode = function (dataObj) {
    var node = {};

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
      var parentNode = this.getNodeById(node.parentid);

      if(!parentNode) throw 'Could not find parent node. Does not belong to tree';

      parentNode.addChild(node);
    }

    return node;
  }

  var trees = [];
  var rootNodes = [];
  var nodeById = {};

  for (var i = 0; i < objectArray.length; i++) {
    var obj = objectArray[i];
    var node = createNode(obj);
    nodeById[obj[config.id]] = node;

    if(!obj[config.parentid]) {
      rootNodes.push(node);
    }
  }

  for (var i = 0; i < objectArray.length; i++) {
    var obj = objectArray[i];
    var node = nodeById[obj[config.id]];
    var parentId = node.dataObj[config.parentid];

    if(parentId) {
      var parentNode = nodeById[parentId];
      node.addParent(parentNode);
    } else {
      node.parent = null;
    }
  }

  for (var i = 0; i < rootNodes.length; i++) {
    var rootNode = rootNodes[i];
    var tree = createTree(rootNode, nodeById);
    tree.config = config;
    tree.createNode = createNode;

    trees.push(tree);
  }

  return trees;
}

// Creates a tree by a defined root node and a nodeById dictionary
var createTree = function(rootNode, nodeById) {
  if(!rootNode) throw 'rootNode is mandatory';
  if(!nodeById) throw 'nodeById is mandatory';

  var getNodeById = function(id) {
    return nodeById[id];
  }

  var tree = {};

  tree.rootNode = rootNode;
  tree.addData = treefunctions.addData;
  tree.getNodeById = getNodeById;

  return tree;
}

module.exports = exports;
