"use strict";
var exports = {};

exports.buildTrees = function(objectArray, config) {
  if(!objectArray) throw 'objectArray is mandatory';
  if(!config) throw 'config is mandatory';
  if(!config.id) throw 'config property id is not set';
  if(!config.parentid) throw 'config property parentid is not set';

  let trees = [];
  let rootNodes = [];
  let nodeById = {};

  let addChild = function(child) {
    this.children.push(child);

    if(!child.parent === this) {
      child.parent = this;
    }
  }

  let addParent = function(parentObj) {
    this.parent = parentObj;
    this.parent.addChild(this);
  }

  let createNode = function (dataObj) {
    let node = {};

    node.id = dataObj[config.id];
    node.parentid = dataObj[config.parentid];
    node.children = [];
    node.dataObj = dataObj;

    node.addChild = addChild;
    node.addParent = addParent;

    return node;
  }

  for (var i = 0; i < objectArray.length; i++) {
    let obj = objectArray[i];
    let node = createNode(obj);
    nodeById[obj[config.id]] = node;

    if(!obj[config.parentid]) {
      rootNodes.push(node);
    }
  }

  for (var i = 0; i < objectArray.length; i++) {
    let obj = objectArray[i];
    let node = nodeById[obj[config.id]];
    let parentId = node.dataObj[config.parentid];

    if(parentId) {
      let parentNode = nodeById[parentId];
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

let addData = function(objectArray, config) {
  if(!objectArray) throw 'objectArray is mandatory';
  if(!config) throw 'config is mandatory';

  for (var i = 0; i < objectArray.length; i++) {
    let obj = objectArray[i];
    let node = this.getNodeById(obj[config.referenceid]);

    if(!node[config.collectionname]) {
      node[config.collectionname] = [];
    }

    node[config.collectionname].push(obj);
  }
}

let createTree = function(rootNode, nodeById) {
  if(!rootNode) throw 'rootNode is mandatory';
  if(!nodeById) throw 'nodeById is mandatory';

  let nodeByIdLookup = nodeById;

  const getNodeById = function(id) {
    return nodeByIdLookup[id];
  }

  let tree = {};

  tree.rootNode = rootNode;
  tree.addData = addData;
  tree.getNodeById = getNodeById;

  return tree;
}

module.exports = exports;
