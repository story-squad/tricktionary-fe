# Header

This component renders a `<header>` with the Tricktionary logo. The header is clickable when both a callback function and URL are defined in the props.

## Properties

The `Header` component has the following properties:

both of the following are optional and must both be defined to allow clicking:

- `onClick` (optional) - A callback function to run when the Header is clicked
- `to` (optional) - A URL to pass to the `<Link to={to}>`
