"use strict";
var exports = {};

let addData = function(objectArray, config) {
  if(!objectArray) throw 'objectArray is mandatory';
  if(!config) throw 'config is mandatory';

  for (var i = 0; i < objectArray.length; i++) {
    let obj = objectArray[i];
    let node = this.getNodeById(obj[config.referenceid]);

    if(!node[config.collectionname]) {
      node[config.collectionname] = [];
      node.collectionnames.push(config.collectionname);
    }

    node[config.collectionname].push(obj);
  }
}

let getSingleNodeData = function() {
  let result = [];

  for (var i = 0; i < this.collectionnames.length; i++) {
    let collectionName = this.collectionnames[i];
    result = result.concat(this[collectionName]);
  }

  return result;
}

let getRecursiveNodeData = function() {
  let result = [];

  result = result.concat(this.getSingleNodeData());

  for (var i = 0; i < this.children.length; i++) {
    var childNode = this.children[i];
    result = result.concat(childNode.getRecursiveNodeData());
  }

  return result;
}

let getRecursiveCollection = function(collectionname) {
  let result = [];

  if(this[collectionname]) {
    result = result.concat(this[collectionname]);
  }

  for (var i = 0; i < this.children.length; i++) {
    var childNode = this.children[i];
    result = result.concat(childNode.getRecursiveCollection(collectionname));
  }

  return result;
}

exports.addData = addData;
exports.getSingleNodeData = getSingleNodeData;
exports.getRecursiveNodeData = getRecursiveNodeData;
exports.getRecursiveCollection = getRecursiveCollection;

module.exports = exports;
