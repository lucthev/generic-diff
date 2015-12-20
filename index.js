'use strict'

module.exports = diff

var assign = require('object-assign')

/**
 * diff(a, b [, eql]) diffs the array-like objects `a` and `b`, returning
 * a summary of the edits made. By default, strict equality (`===`) is
 * used to compare items in `a` and `b`; if this will not work (for example,
 * if the items in `a` and `b` are objects), a custom equality function,
 * `eql`, may be passed as a third argument.
 *
 * @param {Array} a
 * @param {Array} b
 * @param {Function} eql
 * @return {Array}
 */
function diff (a, b, eql) {
  eql = eql || strictEqual

  var N = a.length
  var M = b.length
  var MAX = N + M

  var V = {}
  var Vs = []

  V[1] = 0
  for (var D = 0; D <= MAX; D += 1) {
    for (var k = -D; k <= D; k += 2) {
      var x, y

      if (k === -D || (k !== D && V[k - 1] < V[k + 1])) {
        x = V[k + 1]
      } else {
        x = V[k - 1] + 1
      }

      y = x - k
      while (x < N && y < M && eql(a[x], b[y])) {
        x += 1
        y += 1
      }

      V[k] = x
      if (x >= N && y >= M) {
        Vs[D] = assign({}, V)
        return buildEdits(Vs, a, b)
      }
    }

    Vs[D] = assign({}, V)
  }

  // ?
  throw Error('Unreachable diff path reached')
}

// Used when no equality function is given to diff()
function strictEqual (a, b) {
  return a === b
}

/**
 * buildEdits(Vs, a, b) builds an array of edits from the edit graph,
 * `Vs`, of `a` and `b`.
 *
 * @param {Array} Vs
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 */
function buildEdits (Vs, a, b) {
  var edits = []

  var p = { x: a.length, y: b.length }
  for (var D = Vs.length - 1; p.x > 0 || p.y > 0; D -= 1) {
    var V = Vs[D]
    var k = p.x - p.y

    var xEnd = V[k]

    var down = (k === -D || (k !== D && V[k - 1] < V[k + 1]))
    var kPrev = down ? k + 1 : k - 1

    var xStart = V[kPrev]
    var yStart = xStart - kPrev

    var xMid = down ? xStart : xStart + 1

    while (xEnd > xMid) {
      pushEdit(edits, a[xEnd - 1], false, false)
      xEnd -= 1
    }

    if (yStart < 0) break

    if (down) {
      pushEdit(edits, b[yStart], true, false)
    } else {
      pushEdit(edits, a[xStart], false, true)
    }

    p.x = xStart
    p.y = yStart
  }

  return edits.reverse()
}

/**
 * pushEdit(edits, item, added, removed) adds the given item to the array
 * of edits. Similar edits are grouped together for conciseness.
 *
 * @param {Array} edits
 * @param {*} item
 * @param {Boolean} added
 * @param {Boolean} removed
 */
function pushEdit (edits, item, added, removed) {
  var last = edits[edits.length - 1]

  if (last && last.added === added && last.removed === removed) {
    last.items.unshift(item) // Not push: edits get reversed later
  } else {
    edits.push({
      items: [item],
      added: added,
      removed: removed
    })
  }
}
