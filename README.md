# generic-diff

Diff arrays or array-like objects, such as strings. Based on ["An O(ND) Difference Algorithm and its Variations" (Myers, 1986)][diff].

## diff( a, b [, eql] )

Diffs the array-like objects `a` and `b`, returning a summary of edits required to turn `a` into `b`. Defaults to using strict equality (`===`) to compare items in `a` and `b`. A comparison function, `eql`, can optionally be used for more nuanced comparisons; the signature of this function is `(item from a, item from b) => Boolean`.

The “summary of changes” is an array of objects with three properties: `items`, an array of one or more items from `a` or `b`, and boolean properties `added` and `removed`, indicating whether the item(s) should be added or removed from `a`, respectively. For example, if we’re diffing the strings `abc` and `abd`, the summary of changes would look like:

```js
[{
  items: ['a', 'b'],
  added: false,
  removed: false
}, {
  items: ['c'],
  added: false,
  removed: true
}, {
  items: ['d'],
  added: true,
  removed: false
}]
```

## Example

Diff two strings, character by character:

```js
var diff = require('generic-diff')

var changes = diff('falafel', 'fallacy')
changes = changes.map(function (edit) {
  if (edit.added) {
    return '<ins>' + edit.items.join('') + '</ins>'
  } else if (edit.removed) {
    return '<del>' + edit.items.join('') + '</del>'
  } else {
    return edit.items.join('')
  }
}).join('')

console.log(changes)
// 'fal<del>afe</del>l<ins>acy</ins>'
```

Diff two files line-by-line, producing a diff-like output:

```js
#!/usr/bin/env node
'use strict'

var diff = require('generic-diff')
var fs = require('fs')
var os = require('os')

// Takes an array of edits containing “one or more” items each, and turns
// it into an array of edits with exactly one item per edit.
function flatten (changes) {
  return changes.reduce(function (arr, edit) {
    return arr.concat(edit.items.map(function (item) {
      return {
        item: item,
        added: edit.added,
        removed: edit.removed
      }
    }))
  }, [])
}

// Read two files passed in on the command line, splitting them at
// newlines.
var before = process.argv[2]
before = fs.readFileSync(before, { encoding: 'utf-8' })
before = before.split(/\r?\n/)

var after = process.argv[3]
after = fs.readFileSync(after, { encoding: 'utf-8' })
after = after.split(/\r?\n/)

// Perform the diff. Prepend added lines with a '+', removed lines with
// a '-', and unchanged lines with a space.
var changes = flatten(diff(before, after))
changes = changes.map(function (edit) {
  var pre = ' '

  if (edit.added) {
    pre = '+'
  } else if (edit.removed) {
    pre = '-'
  }

  return pre + edit.item
})

// That’s it!
console.log(changes.join(os.EOL))
```

[Sample output from the above script](https://gist.github.com/lucthev/f7096f85442ec448cb64).

[diff]: http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927

## LICENSE

MIT
