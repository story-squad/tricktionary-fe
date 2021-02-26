# CharCounter

This component will display a character counter and character limit. This component is used for display only and will not control the number of characters that can be input.

## Properties

The `CharCounter` component has the following properties:

- `string` - the string that will contain the characters to be counted
- `max` - the maximum character limit to be used for an input

## Styling

If the target input and `CharCounter` are wrapped in a `<div className="char-counter-wrapper">`, then the `CharCounter` will be placed within the input at the bottom-right:

```jsx
<div className="char-counter-wrapper">
  <input ...props />
  <CharCounter ...props />
</div>
```

Add `lower` or `higher` to `<div className="char-counter-wrapper">` to position the counter as needed:

```jsx
<div className="char-counter-wrapper lower"></div>
<div className="char-counter-wrapper higher"></div>
```

The `<p>` within `CharCounter` will change its `className` to `full` when the character count matches or exceeds the `max`
