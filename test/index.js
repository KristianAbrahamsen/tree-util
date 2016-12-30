"use strict";

var should = require('chai').should();
var assert = require('chai').assert;
var expect = require('chai').expect;
var tree_util = require('../index.js');

var emptyObjectArray = [];
var emptyConfig = {};
var standardConfig =  { id : 'id', parentid : 'parentid'};
var singleTreeOneNodeObjArray = [{ id : 1 }];
var singleTreeTwoNodeObjArray = [{ id : 1 }, { id : 2, parentid : 1 }];
var singleTreeRoootTreeChildren = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 }, { id : 4, parentid : 1 }];

var complexSingleTreeData = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 }, { id : 4, parentid : 1 }];
complexSingleTreeData.push({ id : 5, parentid : 2 });
complexSingleTreeData.push({ id : 6, parentid : 2 });
complexSingleTreeData.push({ id : 7, parentid : 3 });
complexSingleTreeData.push({ id : 8, parentid : 4 });
complexSingleTreeData.push({ id : 9, parentid : 2 });
complexSingleTreeData.push({ id : 10, parentid : 6 });
complexSingleTreeData.push({ id : 11, parentid : 6 });

var moreTreeData = [{ id : 12 }, { id : 13, parentid : 12}];
var twoTreesData = complexSingleTreeData.concat(moreTreeData);

describe('#tree_util.buildTrees', function() {
  it('missing param objectArray should throw exception', function() {
    assert.throws(function() { tree_util.buildTrees() }, 'objectArray is mandatory');
  });

  it('missing param config should throw exception', function() {
    assert.throws(function() { tree_util.buildTrees(emptyObjectArray) }, 'config is mandatory');
  });

  it('config has not id property set, should throw exception', function() {
    assert.throws(function() { tree_util.buildTrees(emptyObjectArray, emptyConfig) }, 'config property id is not set');
  });

  it('config has not parentid property set, should throw exception', function() {
    assert.throws(function() { tree_util.buildTrees(emptyObjectArray, { id : 'id' }) }, 'config property parentid is not set');
  });

  it('empty input aray returns empty array of trees', function() {
    tree_util.buildTrees(emptyObjectArray, standardConfig).should.deep.equal([]);
  });

  it('aray with one object should return an array containing one tree', function() {
    tree_util.buildTrees(singleTreeOneNodeObjArray, standardConfig).length.should.equal(1);
  });

  it('aray with one root and one child node should return an array containing one tree', function() {
    tree_util.buildTrees(singleTreeTwoNodeObjArray, standardConfig).length.should.equal(1);
  });

  it('aray with one root and one child node should return one tree where root has one child node', function() {
    var trees = tree_util.buildTrees(singleTreeTwoNodeObjArray, standardConfig);
    var rootNode = trees[0].rootNode;
    rootNode.children.length.should.equal(1);
  });

  it('aray with one root and one child node should return one tree where single child node has root as parent', function(){
    var trees = tree_util.buildTrees(singleTreeTwoNodeObjArray, standardConfig);
    var parentNode = trees[0].rootNode;
    var childNode = parentNode.children[0];
    childNode.parent.should.deep.equal(parentNode);
  });

  it('aray with one root which has tree child nodee should return one tree where root has tree children', function(){
    var trees = tree_util.buildTrees(singleTreeRoootTreeChildren, standardConfig);
    var parentNode = trees[0].rootNode;
    parentNode.children.length.should.equal(3);
  });

  it('aray with one root which has tree child nodee should return one tree where each child as root as parent', function(){
    var trees = tree_util.buildTrees(singleTreeRoootTreeChildren, standardConfig);
    var parentNode = trees[0].rootNode;

    for (var i = 0; i < parentNode.children.length; i++) {
      var childNode = parentNode.children[i];
      childNode.parent.should.deep.equal(parentNode);
    }
  });

  it('aray with one root which has more complex structure should have the property parent set correct for all nodes', function(){
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    //test
    trees.length.should.equal(1);

    var checkThatParentNodeIsSetCorrect = function(node) {
      for (var i = 0; i < node.children.length; i++) {
        let childNode = node.children[i];
        //test
        childNode.parent.should.deep.equal(node);
        checkThatParentNodeIsSetCorrect(childNode);
      }
    }

    let parentNode = trees[0].rootNode;
    checkThatParentNodeIsSetCorrect(parentNode);
  });


  it('aray with one root which has more complex structure should have child count for each node as expected', function(){
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    //test
    trees.length.should.equal(1);
    var nodeWithChildrenCount = 0;
    var nodeCheckCount = 0;

    var checkChildCount = function(node) {
      //tests
      if(node.id === 1) {
        nodeCheckCount++;
        node.children.length.should.equal(3);
      } else if (node.id === 2) {
        nodeCheckCount++;
        node.children.length.should.equal(3);
      } else if (node.id === 3) {
        nodeCheckCount++;
        node.children.length.should.equal(1);
      } else if (node.id === 4) {
        nodeCheckCount++;
        node.children.length.should.equal(1);
      } else if (node.id === 5) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 6) {
        nodeCheckCount++;
        node.children.length.should.equal(2);
      } else if (node.id === 7) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 8) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 9) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 10) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 11) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      }

      if(node.children.length > 0) {
        nodeWithChildrenCount++;
      }

      for (var i = 0; i < node.children.length; i++) {
        let childNode = node.children[i];
        checkChildCount(childNode);
      }
    }

    let parentNode = trees[0].rootNode;
    checkChildCount(parentNode);

    //tests
    nodeWithChildrenCount.should.equal(5);
    nodeCheckCount.should.equal(complexSingleTreeData.length);
  });

  it('aray with two root which has more complex structure should have child count for each node as expected', function(){
    const treeToTest = twoTreesData;
    let trees = tree_util.buildTrees(treeToTest, standardConfig);
    //test
    trees.length.should.equal(2);
    var nodeWithChildrenCount = 0;
    var nodeCheckCount = 0;

    var checkChildCount = function(node) {
      //tests
      if(node.id === 1) {
        nodeCheckCount++;
        node.children.length.should.equal(3);
      } else if (node.id === 2) {
        nodeCheckCount++;
        node.children.length.should.equal(3);
      } else if (node.id === 3) {
        nodeCheckCount++;
        node.children.length.should.equal(1);
      } else if (node.id === 4) {
        nodeCheckCount++;
        node.children.length.should.equal(1);
      } else if (node.id === 5) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 6) {
        nodeCheckCount++;
        node.children.length.should.equal(2);
      } else if (node.id === 7) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 8) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 9) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 10) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 11) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      } else if (node.id === 12) {
        nodeCheckCount++;
        node.children.length.should.equal(1);
      } else if (node.id === 13) {
        nodeCheckCount++;
        node.children.length.should.equal(0);
      }

      if(node.children.length > 0) {
        nodeWithChildrenCount++;
      }

      for (var i = 0; i < node.children.length; i++) {
        let childNode = node.children[i];
        checkChildCount(childNode);
      }
    }

    for (var i = 0; i < trees.length; i++) {
      let rootNode = trees[i].rootNode;
      checkChildCount(rootNode);
    }

    //tests
    nodeWithChildrenCount.should.equal(6);
    nodeCheckCount.should.equal(treeToTest.length);
  });
});

describe('#tree.getNodeById', function() {
  it('will return an item with the expected id', function() {
    let trees = tree_util.buildTrees(singleTreeRoootTreeChildren, standardConfig);
    var tree = trees[0];
    var id = 3;
    var node = tree.getNodeById(id);
    node[standardConfig.id].should.equal(id);
  });
});

var itemArray = [{ itemid : 1, referenceid : 4 }, { itemid : 2, referenceid : 5 }, { itemid : 3, referenceid : 1 },  { itemid : 4, referenceid : 1 }];
var objectArray = [{ objectid : 1, refid : 1 }, { objectid : 2, refid : 5 }];
var addDataConfig = { referenceid : 'referenceid', collectionname : 'items' };
var addDataConfigObjectArray = { referenceid : 'refid', collectionname : 'objects' };

describe('#tree.addData', function() {
  it('addData is called with mising objectArray param and exception is thrown', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    assert.throws(function() { tree.addData(undefined , addDataConfig) }, 'objectArray is mandatory');
  });

  it('addData is called with mising config param and exception is thrown', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    assert.throws(function() { tree.addData(itemArray, undefined) }, 'config is mandatory');
  });

  it('addData is called and data is added to the right nodes', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    tree.addData(itemArray, addDataConfig);

    for (var i = 0; i < itemArray.length; i++) {
      let item = itemArray[i];
      let node = tree.getNodeById(item.referenceid);
      let collectionLength = 0;

      if(item.referenceid === 4 || item.referenceid === 5) {
        collectionLength = 1;
      } else if (item.referenceid === 1) {
        collectionLength = 2;
      }

      //tests
      node[addDataConfig.collectionname].length.should.equal(collectionLength);

      if(item.referenceid === 4 || item.referenceid === 5) {
        node[addDataConfig.collectionname][0].should.deep.equal(item);
      } else if (item.referenceid === 1) {
        if(item.itemid === 3) {
          node[addDataConfig.collectionname][0].should.deep.equal(item);
        }
        if(item.itemid === 4) {
          node[addDataConfig.collectionname][1].should.deep.equal(item);
        }
      }
    }
  });

  it('addData is called with the same data as in the example in the readme file', function() {
    // An array where the items has a parent child reference using id properties
    var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 },
                 { id : 4, parentid : 1 }, { id : 5, parentid : 3 }];

    // Config object to set the id properties for the parent child relation
    var standardConfig =  { id : 'id', parentid : 'parentid'};

    // Creates an array of trees. For this example there will by only one tree
    var trees = tree_util.buildTrees(items, standardConfig);

    var tree = trees[0];
    var itemDataArray = [{ itemid : 1, value : 2, referenceid : 4 },
                         { itemid : 2, value : 5, referenceid : 5 },
                         { itemid : 3, value : 3, referenceid : 1 },
                         { itemid : 4, value : 1, referenceid : 1 }];
    var addDataConfig = { referenceid : 'referenceid', collectionname : 'items' };

    tree.addData(itemDataArray, addDataConfig);

    var nodeWithCollection = tree.getNodeById(1);
    var nodeItems = nodeWithCollection.items; // returns an array with two objects

    nodeItems.length.should.equal(2);
  });
});

describe('#node.getSingleNodeData', function() {
  it('for the given node returns a collection with 2 items (they come from same collection)', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    tree.addData(itemArray, addDataConfig);
    var node = tree.getNodeById(1);
    node.getSingleNodeData().length.should.equal(2);
  });

  it('for given node returns a collection with 3 items (they come from two collections)', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    tree.addData(itemArray, addDataConfig);
    tree.addData(objectArray, addDataConfigObjectArray);
    var node = tree.getNodeById(1);
    node.getSingleNodeData().length.should.equal(3);
  });
});


describe('#node.getRecursiveNodeData', function() {
  it('for the root node returns a collection with 6 items (they come from 4 different nodes)', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    tree.addData(itemArray, addDataConfig);
    tree.addData(objectArray, addDataConfigObjectArray);
    var node = tree.getNodeById(1);
    node.getRecursiveNodeData().length.should.equal(6);
  });

  it('for each leaf node in the tree getSingleNodeData and getRecursiveNodeData should return same data', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    tree.addData(itemArray, addDataConfig);
    tree.addData(objectArray, addDataConfigObjectArray);

    var checkLeaveNodes = function(node) {
      if(node.children.length > 0) {
        for (var i = 0; i < node.children.length; i++) {
          checkLeaveNodes(node.children[i]);
        }
      } else {
        var dataFromGetSingleNodeData = node.getSingleNodeData();
        var dataFromGetRecursiveNodeData = node.getRecursiveNodeData();

        dataFromGetSingleNodeData.length.should.equal(dataFromGetRecursiveNodeData.length);

        for (var i = 0; i < dataFromGetSingleNodeData.length; i++) {
          var singleObj = dataFromGetSingleNodeData[i];
          var recursiveObj = dataFromGetSingleNodeData[i];

          singleObj.should.deep.equal(recursiveObj);
        }
      }
    }

    checkLeaveNodes(trees[0].rootNode);
  });

});

describe('#node.getRecursiveCollection', function() {
  it('for the root node returns the same data as input for tree.addData)', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    tree.addData(itemArray, addDataConfig);
    tree.addData(objectArray, addDataConfigObjectArray); //check that this data is not returned
    var rootNode = tree.rootNode;
    var recursiveCollection = rootNode.getRecursiveCollection(addDataConfig.collectionname);
    //test
    recursiveCollection.length.should.equal(itemArray.length);
  });

  it('for the root node returns the same data as input for tree.addData (with different data then previous))', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    tree.addData(itemArray, addDataConfig);
    tree.addData(objectArray, addDataConfigObjectArray); //check that this data is not returned
    var rootNode = tree.rootNode;
    var recursiveCollection = rootNode.getRecursiveCollection(addDataConfigObjectArray.collectionname);
    //test
    recursiveCollection.length.should.equal(objectArray.length);
  });
});

describe('#node.getDescendants', function() {
  it('for the root node returns an array where length is equal to items count - 1 (the root)', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    var rootNode = tree.rootNode;
    var rootDescendants = rootNode.getDescendants();
    //test
    rootDescendants.length.should.equal(complexSingleTreeData.length - 1);
  });
});

describe('#node.getAncestors', function() {
  it('for all descendant nodes of the root node will have the root among its ancestors', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    var rootNode = tree.rootNode;
    var rootDescendants = rootNode.getDescendants();

    for (var i = 0; i < rootDescendants.length; i++) {
      var rootDescendant = rootDescendants[i];
      var ancestors = rootDescendant.getAncestors();
      var foundRootInAncestors = (ancestors.indexOf(rootNode) >= 0);
      //test
      foundRootInAncestors.should.equal(true);
    }
  });
});

describe('#node.isDescendantOf', function() {
  it('all root descendants should return true when they call isDescendantOf with root node as param', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    var rootNode = tree.rootNode;
    var rootDescendants = rootNode.getDescendants();

    for (var i = 0; i < rootDescendants.length; i++) {
      var rootDescendant = rootDescendants[i];
      //test
      rootDescendant.isDescendantOf(rootNode).should.equal(true);
    }
  });

  it('example from readme file', function() {
    // An array where the items has a parent child reference using id properties
    var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 },
                 { id : 4, parentid : 1 }, { id : 5, parentid : 3 }];

    // Config object to set the id properties for the parent child relation
    var standardConfig =  { id : 'id', parentid : 'parentid'};

    // Creates an array of trees. For this example there will by only one tree
    var trees = tree_util.buildTrees(items, standardConfig);

    var tree = trees[0];
    var rootNode = tree.rootNode;
    var leafNode = tree.getNodeById(5);

    var isDescendant = leafNode.isDescendantOf(rootNode); //returns true
    //Test
    isDescendant.should.equal(true);
  });
});

describe('#node.isAncestorOf', function() {
  it('all root descendants should return true when they are used as input param for method isAncestorOf on root node', function() {
    let trees = tree_util.buildTrees(complexSingleTreeData, standardConfig);
    var tree = trees[0];
    var rootNode = tree.rootNode;
    var rootDescendants = rootNode.getDescendants();

    for (var i = 0; i < rootDescendants.length; i++) {
      var rootDescendant = rootDescendants[i];
      //test
      rootNode.isAncestorOf(rootDescendant).should.equal(true);
    }
  });

  it('example from readme file', function() {
    // An array where the items has a parent child reference using id properties
    var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 },
                 { id : 4, parentid : 1 }, { id : 5, parentid : 3 }];

    // Config object to set the id properties for the parent child relation
    var standardConfig =  { id : 'id', parentid : 'parentid'};

    // Creates an array of trees. For this example there will by only one tree
    var trees = tree_util.buildTrees(items, standardConfig);

    var tree = trees[0];
    var rootNode = tree.rootNode;
    var leafNode = tree.getNodeById(5);

    var isAncestor = rootNode.isAncestorOf(leafNode); //returns true
    //Test
    isAncestor.should.equal(true);
  });

  describe('#node.isLeaf', function() {
    it('should return true when node is a leaf node', function() {
      // An array where the items has a parent child reference using id properties
      var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 },
                   { id : 4, parentid : 1 }, { id : 5, parentid : 3 }];

      // Config object to set the id properties for the parent child relation
      var standardConfig =  { id : 'id', parentid : 'parentid'};

      // Creates an array of trees. For this example there will by only one tree
      var trees = tree_util.buildTrees(items, standardConfig);
      var tree = trees[0];
      var leafNode = tree.getNodeById(5);

      var isLeafNode = leafNode.isLeaf(); //returns true
      //Test
      isLeafNode.should.equal(true);
    });

    it('should return true when node is not a leaf node', function() {
      // An array where the items has a parent child reference using id properties
      var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 },
                   { id : 4, parentid : 1 }, { id : 5, parentid : 3 }];

      // Config object to set the id properties for the parent child relation
      var standardConfig =  { id : 'id', parentid : 'parentid'};

      // Creates an array of trees. For this example there will by only one tree
      var trees = tree_util.buildTrees(items, standardConfig);
      var tree = trees[0];
      var notLeafNode = tree.getNodeById(3);

      var isLeafNode = notLeafNode.isLeaf(); //returns false
      //Test
      isLeafNode.should.equal(false);
    });
  });

  describe('#node.removeAllDescendants', function() {
    it('should return 0 for length for children property after function call on node with child nodes', function() {
      // An array where the items has a parent child reference using id properties
      var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 },
                   { id : 4, parentid : 3 }, { id : 5, parentid : 3 }];

      // Config object to set the id properties for the parent child relation
      var standardConfig =  { id : 'id', parentid : 'parentid'};

      // Creates an array of trees. For this example there will by only one tree
      var trees = tree_util.buildTrees(items, standardConfig);
      var tree = trees[0];
      var nodeWithChildren = tree.getNodeById(3);

      nodeWithChildren.removeAllDescendants();
      //Test
      nodeWithChildren.children.length.should.equal(0);
    });

    it('should return 0 for length for children property after function call on node with no child nodes', function() {
      // An array where the items has a parent child reference using id properties
      var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 },
                   { id : 4, parentid : 3 }, { id : 5, parentid : 3 }];

      // Config object to set the id properties for the parent child relation
      var standardConfig =  { id : 'id', parentid : 'parentid'};

      // Creates an array of trees. For this example there will by only one tree
      var trees = tree_util.buildTrees(items, standardConfig);
      var tree = trees[0];
      var leafNode = tree.getNodeById(5);

      leafNode.removeAllDescendants();
      //Test
      leafNode.children.length.should.equal(0);
    });

    it('all child nodes should have parent set to null after function call', function() {
      // An array where the items has a parent child reference using id properties
      var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 },
                   { id : 4, parentid : 3 }, { id : 5, parentid : 3 }];

      // Config object to set the id properties for the parent child relation
      var standardConfig =  { id : 'id', parentid : 'parentid'};

      // Creates an array of trees. For this example there will by only one tree
      var trees = tree_util.buildTrees(items, standardConfig);
      var tree = trees[0];
      var nodeWithChildren = tree.getNodeById(3);
      var childNodes = nodeWithChildren.children.concat([]);

      //Act
      nodeWithChildren.removeAllDescendants();

      //Test
      for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];
        expect(childNode.parent).to.equal(null);
      }
    });
  });

  describe('#node.removeParent', function() {
    it('should return null for parent property', function() {
      // An array where the items has a parent child reference using id properties
      var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 },
                   { id : 4, parentid : 3 }, { id : 5, parentid : 3 }];

      // Config object to set the id properties for the parent child relation
      var standardConfig =  { id : 'id', parentid : 'parentid'};

      // Creates an array of trees. For this example there will by only one tree
      var trees = tree_util.buildTrees(items, standardConfig);
      var tree = trees[0];
      var nodeWithParent = tree.getNodeById(3);

      //Act
      nodeWithParent.removeParent();

      //Test
      expect(nodeWithParent.parent).to.equal(null);
    });

    it('parent should not contain node in children array', function() {
      // An array where the items has a parent child reference using id properties
      var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 },
                   { id : 4, parentid : 3 }, { id : 5, parentid : 3 }];

      // Config object to set the id properties for the parent child relation
      var standardConfig =  { id : 'id', parentid : 'parentid'};

      // Creates an array of trees. For this example there will by only one tree
      var trees = tree_util.buildTrees(items, standardConfig);
      var tree = trees[0];
      var nodeWithParent = tree.getNodeById(3);
      var parent = nodeWithParent.parent

      //Act
      nodeWithParent.removeParent();

      //Test
      parent.children.indexOf(nodeWithParent).should.equal(-1);
    });
  });
});
