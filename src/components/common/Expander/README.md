# Expander

This is a container component that will display children when expanded.
Clicking the expander header will display/hide the children.
The component has a button at the end to close it.
Wrap JSX that will be seen on expansion with this component:

```jsx
<Expander>{...JSX}</Expander>
```

## Properties

The `Expander` component has the following properties:

- `headerText` - The header text for the Expander
- `closeText` - The text on the button that closes the Expander
