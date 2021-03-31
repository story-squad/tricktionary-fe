import { GetReactionsItem, ReactionsDictionary } from '../../types/gameTypes';
import { addReaction, updateReactionCounts } from './gameHelpers';

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

    // Expected output
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

    // Action
    const output = addReaction(inputReactions, definitionId, reactionId, value);

    // Assertion
    expect(output).toEqual(outputReactions);
  });
});

describe('updateReactionCounts', () => {
  it('Returns a ReactionsDictionary with updated values given a valid array', () => {
    // Function input
    const inputReactionsDict: ReactionsDictionary = {
      15: {
        8: 0,
        13: 0,
        42: 0,
      },
      16: {
        8: 0,
        13: 0,
        42: 0,
      },
    };
    const inputReactionsList: GetReactionsItem[] = [
      {
        definition_id: 15,
        reaction_id: 8,
        count: 7,
      },
      {
        definition_id: 15,
        reaction_id: 13,
        count: 6,
      },
      {
        definition_id: 15,
        reaction_id: 42,
        count: 3,
      },
    ];

    // Expected output
    const outputReactionsDict: ReactionsDictionary = {
      15: {
        8: 7,
        13: 6,
        42: 3,
      },
      16: {
        8: 0,
        13: 0,
        42: 0,
      },
    };

    // Action
    const output = updateReactionCounts(inputReactionsDict, inputReactionsList);

    // Assertion
    expect(output).toEqual(outputReactionsDict);
  });
  it('Returns the original ReactionsDictionary given an empty array', () => {});
  it('Returns the original ReactionsDictionary given an invalid array', () => {});
});
