var should = require('chai').should();
var assert = require('chai').assert;
var tree_util = require('../index.js');
var builder = tree_util.builder;

var emptyObjectArray = [];
var emptyConfig = {};
var standardConfig =  { id : 'id', parentid : 'parentid'};
var singleTreeOneNodeObjArray = [{ id : 1 }];
var singleTreeTwoNodeObjArray = [{ id : 1 }, { id : 2, parentid : 1 }];

describe('#builder.build', function() {
  it('missing param objectArray should throw exception', function() {
    assert.throws(function() { builder.build() }, 'objectArray is mandatory');
  });

  it('missing param config should throw exception', function() {
    assert.throws(function() { builder.build(emptyObjectArray) }, 'config is mandatory');
  });

  it('config has not id property set, should throw exception', function() {
    assert.throws(function() { builder.build(emptyObjectArray, emptyConfig) }, 'config property id is not set');
  });

  it('config has not parentid property set, should throw exception', function() {
    assert.throws(function() { builder.build(emptyObjectArray, { id : 'id' }) }, 'config property parentid is not set');
  });

  it('empty input aray returns empty array of trees', function() {
    builder.build(emptyObjectArray, standardConfig).should.deep.equal([]);
  });

  it('aray with one object should return an array containing one tree', function() {
    builder.build(singleTreeOneNodeObjArray, standardConfig).length.should.equal(1);
  });

  it('aray with one root and one child node should return an array containing one tree', function() {
    builder.build(singleTreeTwoNodeObjArray, standardConfig).length.should.equal(1);
  });
});
