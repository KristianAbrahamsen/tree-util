# tree-util
Simple but powerfull library for building and working with tree structures.

Easy to build tree structures where the data items has a parent child relation through id properties.
An exaple of a data source with parent child relation can be a table in a relational database.

```js
var tree_util = require('tree-util')

// An array where the items has a parent child reference using id properties
var items = [{ id : 1 }, { id : 2, parentid : 1 }, { id : 3, parentid : 1 }, { id : 4, parentid : 1 }, { id : 5, parentid : 3 }];

// Config object to set the id properties for the parent child relation
var standardConfig =  { id : 'id', parentid : 'parentid'};

// Creates an array of trees. For this example there will by only one tree
var trees = tree_util.buildTrees(items, standardConfig);
```

Easy for checking ancestor or descendant relationships

```js
// Contiued from example above
var tree = trees[0];
var rootNode = tree.rootNode;
var leafNode = tree.getNodeById(5);

var isDescendant = leafNode.isDescendantOf(rootNode); //returns true
var isAncestor = rootNode.isAncestorOf(leafNode); //returns true
```

## License
(The MIT License)


Copyright (c) 2016 Kristian Marheim Abrahamsen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
