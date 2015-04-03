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

## Examples



[diff]: http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927
