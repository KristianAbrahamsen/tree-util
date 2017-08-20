var exports = {};

// Removes child. Node function
var removeChild = function(childNode) {
  childNode.removeParent();
}

// Adds a child. Node function
var addChild = function(childNode) {
  this.children.push(childNode);

  if(childNode.parent !== this) {
    childNode.parent = this;
  }
}

// Adds (sets) a paren. Node function
var addParent = function(parentNode) {
  this.parent = parentNode;

  if(this.parent.children.indexOf(this) === -1) {
    this.parent.addChild(this);
  }
}

// Removes the parent. Node function
var removeParent = function() {
  if(!this.parent) return;

  var thisChildIndex = this.parent.children.indexOf(this);

  if(thisChildIndex > -1) {
    this.parent.children.splice(thisChildIndex, 1)
  } else {
    throw 'Node has no parent';
  }

  this.parent = null;
}

// Adds data to a nodes based on the references in the objectArray. Config defines collection name and the reference id to attach the data items to the nodes. Tree function
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

// Gets all the data for the node. Node function
var getSingleNodeData = function() {
  var result = [];

  for (var i = 0; i < this.collectionnames.length; i++) {
    var collectionName = this.collectionnames[i];
    result = result.concat(this[collectionName]);
  }

  return result;
}

// Gets all the data for the node and its descendants. Node function
var getRecursiveNodeData = function() {
  var result = [];

  result = result.concat(this.getSingleNodeData());

  for (var i = 0; i < this.children.length; i++) {
    var childNode = this.children[i];
    result = result.concat(childNode.getRecursiveNodeData());
  }

  return result;
}

//Gets all collection data by name for a node and its descendants. Node function
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

// Gets all descendants for a node. Node function
var getDescendants = function() {
  var result = [];

  for (var i = 0; i < this.children.length; i++) {
    var descendant = this.children[i];
    result.push(descendant);
    result = result.concat(descendant.getDescendants());
  }

  return result;
}

// Gets all ancedstors for a node. Node function
var getAncestors = function() {
  var result = [];

  if(this.parent) {
    result.push(this.parent);
    result = result.concat(this.parent.getAncestors());
  }

  return result;
}

// Checks if a node is a descendant of the node. Node function
var isDescendantOf = function(node) {
  for (var i = 0; i < node.children.length; i++) {
    var descendant = node.children[i];

    if(descendant === this) return true;
    if(this.isDescendantOf(descendant)) return true;
  }

  return false;
}

// Checks if a node is an ancestor of the node. Node function
var isAncestorOf = function(node) {
  for (var i = 0; i < this.children.length; i++) {
    var descendant = this.children[i];

    if(descendant === node) return true;
    if(descendant.isAncestorOf(node)) return true;
  }

  return false;
}

// Cheks os the node is a leaf node. Node function
var isLeaf = function() {
  return this.children.length === 0;
}

// Removes all descendants for the node. Node function
var removeAllDescendants = function() {
  for (var i = 0; i < this.children.length; i++) {
    var childNode = this.children[i];
    childNode.parent = null
  }

  this.children = [];
}

// Exports all the functions
exports.addChild = addChild;
exports.removeChild = removeChild;
exports.addParent = addParent;
exports.removeParent = removeParent;
exports.addData = addData;
exports.getSingleNodeData = getSingleNodeData;
exports.getRecursiveNodeData = getRecursiveNodeData;
exports.getRecursiveCollection = getRecursiveCollection;
exports.getDescendants = getDescendants;
exports.getAncestors = getAncestors;
exports.isDescendantOf = isDescendantOf;
exports.isAncestorOf = isAncestorOf;
exports.isLeaf = isLeaf;
exports.removeAllDescendants = removeAllDescendants;

module.exports = exports;
