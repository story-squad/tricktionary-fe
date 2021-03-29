import { ReactionsDictionary } from '../../types/gameTypes';
import { addReaction } from './gameHelpers';

describe('addReaction', () => {
  it('returns a ReactionsDictionary with an updated reaction value', () => {
    // Function input
    const inputReactions: ReactionsDictionary = {
      1000: {
        100: 5,
        101: 10,
        102: 15, // this value should change
      },
      1001: {
        100: 6,
        101: 11,
        102: 16,
      },
    };
    const definitionId = 1000;
    const reactionId = 102;
    const value = 22;

    // Function output
    const outputReactions: ReactionsDictionary = {
      1000: {
        100: 5,
        101: 10,
        102: 22, // the updated value
      },
      1001: {
        100: 6,
        101: 11,
        102: 16,
      },
    };

    const output = addReaction(inputReactions, definitionId, reactionId, value);

    expect(output).toEqual(outputReactions);
  });
});
