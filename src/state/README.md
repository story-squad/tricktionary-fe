# State

## Recoil

This project uses Recoil for state-management. As a general rule:

- Any state that needs to be passed to multiple components
- Any state that needs to skip component layers to avoid prop-drilling
- Any state that common components will always require

should be made into an atom and subscribed to by those components. This will help keep props clean.

Subscribing a component to Recoil state is as easy as using a useState hook, and setting up an atom is very simple.
For examples, see https://recoiljs.org/

## Organization

The `gameState` holds all state related to the game (pretty much all of the state).

The `functionState` holds atoms that contain functions. Each atom mirrors the name of the function you wish to hold, with `Fn` appended.

To load a functional atom's state for use elsewhere in the app, follow the template in GameContainer:

```js
// In the state section
const [, setHandleSetHostFn] = useRecoilState(handleSetHostFn);

// When GameContainer mounts
useEffect(() => {
  ...
  /* Set up Recoil-stored handler functions */
  setHandleSendReactionFn(handleSendReaction);
  ...
}, []);

// The Recoil-stored handlers section. Use `function` keyword to hoist
function handleSendReaction() {
  return (definitionId: number, reactionId: number) => {
    socket.emit('send reaction', definitionId, reactionId);
  };
}
```
