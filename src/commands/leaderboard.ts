import { Composer } from "grammy";

import { getLeaderboardScores } from "../services/get-leaderboard-scores";
import { CommandsHelper } from "../util/commands-helper";
import { formatLeaderboardMessage } from "../util/format-leaderboard-message";
import { generateLeaderboardKeyboard } from "../util/generate-leaderboard-keyboard";
import { parseLeaderboardInput } from "../util/parse-leaderboard-input";

const composer = new Composer();

composer.command("leaderboard", async (ctx) => {
  const { searchKey, timeKey } = parseLeaderboardInput(
    ctx.match,
    ctx.chat.type === "private" ? "global" : undefined,
  );

  const keyboard = generateLeaderboardKeyboard(searchKey, timeKey);

  const chatId = ctx.chat.id.toString();
  const memberScores = await getLeaderboardScores({
    chatId,
    searchKey,
    timeKey,
  });

  ctx.reply(formatLeaderboardMessage(memberScores, searchKey, timeKey), {
    disable_notification: true,
    reply_markup: keyboard,
    link_preview_options: {
      is_disabled: true,
    },
  });
});

CommandsHelper.addNewCommand("leaderboard", "View the leaderboard.");

export const leaderboardCommand = composer;
