var exports = {};

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

var addData = function(objectArray, config) {
  if(!objectArray) throw 'objectArray is mandatory';
  if(!config) throw 'config is mandatory';

  for (var i = 0; i < objectArray.length; i++) {
    var obj = objectArray[i];
    var node = this.getNodeById(obj[config.referenceid]);

    if(!node[config.collectionname]) {
      node[config.collectionname] = [];
      node.collectionnames.push(config.collectionname);
    }

    node[config.collectionname].push(obj);
  }
}

var getSingleNodeData = function() {
  var result = [];

  for (var i = 0; i < this.collectionnames.length; i++) {
    var collectionName = this.collectionnames[i];
    result = result.concat(this[collectionName]);
  }

  return result;
}

var getRecursiveNodeData = function() {
  var result = [];

  result = result.concat(this.getSingleNodeData());

  for (var i = 0; i < this.children.length; i++) {
    var childNode = this.children[i];
    result = result.concat(childNode.getRecursiveNodeData());
  }

  return result;
}

var getRecursiveCollection = function(collectionname) {
  var result = [];

  if(this[collectionname]) {
    result = result.concat(this[collectionname]);
  }

  for (var i = 0; i < this.children.length; i++) {
    var childNode = this.children[i];
    result = result.concat(childNode.getRecursiveCollection(collectionname));
  }

  return result;
}

var getDescendants = function() {
  var result = [];

  for (var i = 0; i < this.children.length; i++) {
    var descendant = this.children[i];
    result.push(descendant);
    result = result.concat(descendant.getDescendants());
  }

  return result;
}

var getAncestors = function() {
  var result = [];

  if(this.parent) {
    result.push(this.parent);
    result = result.concat(this.parent.getAncestors());
  }

  return result;
}

var isDescendantOf = function(node) {
  for (var i = 0; i < node.children.length; i++) {
    var descendant = node.children[i];

    if(descendant === this) return true;
    if(this.isDescendantOf(descendant)) return true;
  }

  return false;
}

var isAncestorOf = function(node) {
  for (var i = 0; i < this.children.length; i++) {
    var descendant = this.children[i];

    if(descendant === node) return true;
    if(descendant.isAncestorOf(node)) return true;
  }

  return false;
}

exports.addChild = addChild;
exports.addParent = addParent;
exports.addData = addData;
exports.getSingleNodeData = getSingleNodeData;
exports.getRecursiveNodeData = getRecursiveNodeData;
exports.getRecursiveCollection = getRecursiveCollection;
exports.getDescendants = getDescendants;
exports.getAncestors = getAncestors;
exports.isDescendantOf = isDescendantOf;
exports.isAncestorOf = isAncestorOf;

module.exports = exports;
