# State

## Recoil

This project uses Recoil for state-management. As a general rule:

- Any state that needs to be passed to multiple component trees
- Any state that common components will always requre

should be made into an atom and subscribed to by those components. This will help keep props clean.

Subscribing a component to Recoil state is as easy as using a useState hook, and setting up an atom is very simple.
For examples, see https://recoiljs.org/
