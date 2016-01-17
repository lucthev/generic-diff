'use strict'

var test = require('tape')
var arrayDiff = require('./')

test('diff', function (t) {
  t.plan(13)

  t.equal(diff('', ''), '', 'Identical empty')
  t.equal(diff('', 'a'), '+a', 'Empty, non-empty')
  t.equal(diff('a', ''), '-a', 'Non-empty, empty')
  t.equal(diff('a', 'a'), 'a', 'Identical non-empty')
  t.equal(diff('a', 'b'), '-a,+b', 'Full swap')
  t.equal(diff('a', 'ab'), 'a,+b', 'Appending')
  t.equal(diff('a', 'ba'), '+b,a', 'Prepending')
  t.equal(diff('ab', 'b'), '-a,b', 'Removal from front')
  t.equal(diff('ab', 'a'), 'a,-b', 'Removal from back')
  t.equal(diff('abc', 'ac'), 'a,-b,c', 'Removal from middle')
  t.equal(diff('ac', 'abc'), 'a,+b,c', 'Adding in the middle')
  t.equal(diff('abcde', 'afghe'), 'a,-bcd,+fgh,e', 'Swapping in the middle')
  t.equal(diff('abcdefghi', 'abcjklghim'), 'abc,-def,+jkl,ghi,+m', 'Longer diff')
})

test('Uniformity', function (t) {
  t.plan(12)

  t.ok(isUniform('', ''), 'Identical empty')
  t.ok(isUniform('', 'a'), 'Empty, non-empty')
  t.ok(isUniform('a', ''), 'Non-empty, empty')
  t.ok(isUniform('a', 'a'), 'Identical non-empty')
  t.ok(isUniform('a', 'b'), 'Full swap')
  t.ok(isUniform('a', 'ab'), 'Appending')
  t.ok(isUniform('a', 'ba'), 'Prepending')
  t.ok(isUniform('ab', 'b'), 'Removal from front')
  t.ok(isUniform('ab', 'a'), 'Removal from back')
  t.ok(isUniform('abc', 'ac'), 'Removal from middle')
  t.ok(isUniform('ac', 'abc'), 'Adding in the middle')
  t.ok(isUniform('abcde', 'afghe'), 'Swapping in the middle')
})

test('Custom equality', function (t) {
  t.plan(1)

  var a = [{ x: 1 }, { x: 2 }, { x: 3 }]
  var b = [{ x: 2 }, { x: 3 }, { x: 1 }]
  var changes = arrayDiff(a, b, function (a, b) {
    return a.x === b.x
  })

  var str = changes.map(function (edit) {
    edit.items = edit.items.map(function (item) {
      return item.x
    })

    if (edit.added) {
      return '+' + edit.items.join('')
    } else if (edit.removed) {
      return '-' + edit.items.join('')
    } else {
      return edit.items.join('')
    }
  }).join(',')

  t.equal(str, '-1,23,+1', 'Custom equality')
})

function diff (a, b) {
  var changes = arrayDiff(a, b)

  return changes.map(function (edit) {
    if (edit.added) {
      return '+' + edit.items.join('')
    } else if (edit.removed) {
      return '-' + edit.items.join('')
    } else {
      return edit.items.join('')
    }
  }).join(',')
}

function isUniform (a, b) {
  var changes = arrayDiff(a, b)

  return changes.every(function (item) {
    // Every change should have boolean added and removed properties
    return (
      Boolean(item.added) === item.added &&
      Boolean(item.removed) === item.removed
    )
  })
}
