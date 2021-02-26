# CharCounter

This component will display a character counter and character limit. This component is used for display only and will not control the number of characters that can be input.

## Properties

The `CharCounter` component has the following properties:

- `string` - the string that will contain the characters to be counted
- `max` - the maximum character limit to be used for an input

## Styling

The `<p>` within `CharCounter` will change its `className` to `full` when the character count matches or exceeds the `max`
