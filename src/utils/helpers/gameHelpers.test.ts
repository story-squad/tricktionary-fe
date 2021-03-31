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
  it('returns a ReactionsDictionary with updated values given a valid array', () => {
    // Function input
    const inputReactionsDict1: ReactionsDictionary = {
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
    const inputReactionsDict2: ReactionsDictionary = {
      15: {
        8: 1,
        13: 2,
        42: 3,
      },
      16: {
        8: 4,
        13: 5,
        42: 6,
      },
    };
    const inputReactionsList1: GetReactionsItem[] = [
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
    const inputReactionsList2: GetReactionsItem[] = [
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
      {
        definition_id: 16,
        reaction_id: 8,
        count: 7,
      },
      {
        definition_id: 16,
        reaction_id: 13,
        count: 6,
      },
      {
        definition_id: 16,
        reaction_id: 42,
        count: 3,
      },
    ];

    // Expected output
    const outputReactionsDict1: ReactionsDictionary = {
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
    const outputReactionsDict2: ReactionsDictionary = {
      15: {
        8: 7,
        13: 6,
        42: 3,
      },
      16: {
        8: 7,
        13: 6,
        42: 3,
      },
    };

    // Action
    const output1 = updateReactionCounts(
      inputReactionsDict1,
      inputReactionsList1,
    );
    const output2 = updateReactionCounts(
      inputReactionsDict2,
      inputReactionsList2,
    );

    // Assertion
    expect(output1).toEqual(outputReactionsDict1);
    expect(output2).toEqual(outputReactionsDict2);
  });
  it('returns the original ReactionsDictionary given an empty array', () => {
    // Function input
    const inputReactionsDict: ReactionsDictionary = {
      15: {
        8: 1,
        13: 2,
        42: 3,
      },
      16: {
        8: 4,
        13: 5,
        42: 6,
      },
    };

    // Action
    const output = updateReactionCounts(inputReactionsDict, []);

    // Assertion
    expect(output).toEqual(inputReactionsDict);
  });
  it('returns the original ReactionsDictionary given an invalid array', () => {
    // Function input
    const inputReactionsDict: ReactionsDictionary = {
      15: {
        8: 1,
        13: 2,
        42: 3,
      },
      16: {
        8: 4,
        13: 5,
        42: 6,
      },
    };
    const inputReactionsList: any = [
      [42, 'the meaning of life', { foo: 'bar', soap: 'bar', candy: 'bar' }],
    ];
    // Action
    const output = updateReactionCounts(inputReactionsDict, []);

    // Assertion
    expect(output).toEqual(inputReactionsDict);
  });
});
