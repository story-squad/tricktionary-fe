import { getReactions } from '../../api/apiRequests';
import { ReactionItem } from '../../types/commonTypes';
import { REACTION_IDS } from '../constants';

// GET reactions/emojis from API then filter using .env list
export const getSelectedReactions = async (): Promise<ReactionItem[]> => {
  let emojis = [] as ReactionItem[];
  const reactionIds = JSON.parse(REACTION_IDS);
  await getReactions()
    .then(
      (res) =>
        (emojis = res.data.available.filter((reaction: ReactionItem) =>
          reactionIds.includes(reaction.id),
        )),
    )
    .catch((err) => console.log(err));
  return emojis;
};
