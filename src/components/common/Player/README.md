# Player

This is a simple container component that will display children if the Recoil state "isHost" is false.
Wrap JSX that the Players will see (not the Host), with this component:

```jsx
<Player>{...JSX}</Player>
```
