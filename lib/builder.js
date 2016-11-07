"use strict";
var treefunctions = require('./treefunctions.js');

var exports = {};

exports.buildTrees = function(objectArray, config) {
  if(!objectArray) throw 'objectArray is mandatory';
  if(!config) throw 'config is mandatory';
  if(!config.id) throw 'config property id is not set';
  if(!config.parentid) throw 'config property parentid is not set';

  var trees = [];
  var rootNodes = [];
  var nodeById = {};

  var addChild = function(child) {
    this.children.push(child);

    if(!child.parent === this) {
      child.parent = this;
    }
  }

  var addParent = function(parentObj) {
    this.parent = parentObj;
    this.parent.addChild(this);
  }

  var createNode = function (dataObj) {
    var node = {};

    node.id = dataObj[config.id];
    node.parentid = dataObj[config.parentid];
    node.children = [];
    node.dataObj = dataObj;
    node.collectionnames = [];

    //functions
    node.addChild = addChild;
    node.addParent = addParent;
    node.getSingleNodeData = treefunctions.getSingleNodeData;
    node.getRecursiveNodeData = treefunctions.getRecursiveNodeData;
    node.getRecursiveCollection = treefunctions.getRecursiveCollection;

    return node;
  }

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
    }
  }

  for (var i = 0; i < rootNodes.length; i++) {
    var rootNode = rootNodes[i];
    var tree = createTree(rootNode, nodeById);
    trees.push(tree);
  }

  return trees;
}

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
