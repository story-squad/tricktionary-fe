# Types / Interfaces

## Common and state types/interfaces

Any types/interfaces that will be required throughout the app should be placed in the types folder in their respective xyzTypes.ts file and exported individually.

## Component props

Component prop interfaces should be declared in the component file, as they are specific to each component and will not be used outside of the component.
The naming convention for these interfaces is

```js
interface ComponentNameProps {}
```
