import { Composer } from "grammy";

import { getUserScores } from "../services/get-user-scores";
import { CommandsHelper } from "../util/commands-helper";
import { formatUserScoreMessage } from "../util/format-user-score-message";
import { generateLeaderboardKeyboard } from "../util/generate-leaderboard-keyboard";
import { parseLeaderboardInput } from "../util/parse-leaderboard-input";

const composer = new Composer();

composer.command("myscore", async (ctx) => {
  if (!ctx.from) return;

  const { searchKey, timeKey } = parseLeaderboardInput(
    ctx.match,
    ctx.chat.type === "private" ? "global" : undefined,
  );

  const keyboard = generateLeaderboardKeyboard(
    searchKey,
    timeKey,
    `myscore ${ctx.from.id}`,
  );

  const userId = ctx.from.id.toString();
  const chatId = ctx.chat.id.toString();
  const userScores = await getUserScores({
    userId,
    chatId,
    searchKey,
    timeKey,
  });

  if (userScores === null) return ctx.reply("No one has scored yet");

  const userScore = userScores[0];

  const message = formatUserScoreMessage(userScore, searchKey);

  ctx.reply(message, {
    disable_notification: true,
    reply_markup: keyboard,
    reply_parameters: {
      message_id: ctx.msgId,
    },
    link_preview_options: {
      is_disabled: true,
    },
  });
});

CommandsHelper.addNewCommand("myscore", "View your score.");

export const myScoreCommand = composer;
