'use strict'

module.exports = diff

function diff (a, b) {
  var N = a.length
  var M = b.length
  var MAX = N + M

  var V = []

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
      while (x < N && y < M && a[x] === b[y]) {
        x += 1
        y += 1
      }

      V[k] = x
      if (x >= N && y >= M) {
        return D
      }
    }
  }

  // ?
  throw Error('Unreachable diff path reached')
}
