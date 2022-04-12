module.exports = {
    setBotCommands: (bot) => {
        bot.telegram.setMyCommands([
            {
                command: "start",
                description: "Start using bot",
            },
            {
                command: "help",
                description: "Display help",
            },
            {
                command: "menu",
                description: "Display menu",
            },
            {
                command: "wizard",
                description: "wizard scene",
            },
        ]);
    },

    actionSendPicture: (bot, action, src, caption) => {
        bot.action(action, async (ctx) => {
            try {
                if (src) {
                    await ctx.replyWithPhoto(
                        { source: src },
                        { caption: caption }
                    );
                }
                await ctx.answerCbQuery();
            } catch (error) {
                console.error(error);
            }
        });
    },

    sendOptionsKeyboard: (ctx, bot, questionMessage = "") => {
        bot.telegram.sendMessage(ctx.chat.id, questionMessage, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "собачку", callback_data: "dog" },
                        { text: "котика", callback_data: "cat" },
                        { text: "картинку", callback_data: "picture" },
                    ],
                    [{ text: "Бросить кости", callback_data: "dice" }],
                    [
                        { text: "Пройти опрос", callback_data: "wizard" },
                        { text: "Записать расходы", callback_data: "expences" },
                    ],
                ],
            },
        });
    },
};
