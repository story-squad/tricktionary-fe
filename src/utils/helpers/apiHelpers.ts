import { getReactions } from '../../api/apiRequests';
import { ReactionItem } from '../../types/commonTypes';
import { EMOJI_IDS } from '../constants';

// GET reactions/emojis from API then filter using .env list
export const getSelectedReactions = async (): Promise<ReactionItem[]> => {
  let emojis = [] as ReactionItem[];
  await getReactions()
    .then(
      (res) =>
        (emojis = res.data.available.filter((reaction: ReactionItem) =>
          JSON.parse(EMOJI_IDS).includes(reaction.id),
        )),
    )
    .catch((err) => console.log(err));
  return emojis;
};
