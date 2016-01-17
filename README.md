# generic-diff

Diff arrays or array-like objects, such as strings. Based on ["An O(ND) Difference Algorithm and its Variations" (Myers, 1986)][diff].

Note that if you're planning on diffing strings, it's probably better to use a package such as [fast-diff][], which, as the name implies, is faster (and probably more memory-efficient) than this package.

## diff( a, b [, eql] )

Diffs the array-like objects `a` and `b`, returning a summary of edits required to turn `a` into `b`. Defaults to using strict equality (`===`) to compare items in `a` and `b`. A comparison function, `eql`, can optionally be used for more nuanced comparisons; the signature of this function is `(item from a, item from b) => Boolean`.

The "summary of edits" is an array of objects with three properties: `items`, an array of one or more items from `a` or `b`, and boolean properties `added` and `removed`, indicating whether the item(s) should be added or removed from `a`, respectively. For example, if we’re diffing the strings `abc` and `abd`, the summary of changes would look like:

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

Diff two strings, creating an HTML representation of their differences:

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

For a slightly more involved example, [this gist][file-diff] demonstrates how to diff two files and produce an output similar to the UNIX `diff` command.

## LICENSE

MIT

[diff]: http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927
[fast-diff]: https://www.npmjs.com/package/fast-diff
[file-diff]: https://gist.github.com/lucthev/f7096f85442ec448cb64
