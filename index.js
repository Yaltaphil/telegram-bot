require("dotenv").config();
const { Telegraf, Markup, Scenes, session } = require("telegraf");
const {
    setBotCommands,
    sendOptionsKeyboard,
    actionSendPicture,
} = require("./utils");

const bot = new Telegraf(process.env.BOT_TOKEN);

setBotCommands(bot);

bot.start((ctx) => {
    ctx.reply(
        "Приветсвую. Сегодня я Ваш бот!",
        Markup.keyboard(["Привет!", "Покажи, пожалуйста, меню", "Пока"])
    );
});

bot.help((ctx) => ctx.reply(`/menu\n/wizard\n`));

bot.command("menu", async (ctx) => {
    await ctx.replyWithHTML(`Привет <b>${ctx.message.from.first_name}</b> !`);
    sendOptionsKeyboard(ctx, bot, "Что делаем?");
});

actionSendPicture(
    bot,
    "dog",
    "./images/pexels-bruno-oliveira-11563927.jpg",
    "Dog"
);
actionSendPicture(
    bot,
    "cat",
    "./images/pexels-evg-kowalievska-1170986.jpg",
    "Cat"
);

bot.action("dice", async (ctx) => {
    try {
        await ctx.replyWithDice();
        await ctx.answerCbQuery();
    } catch (error) {
        console.log(error);
    }
});

bot.action("picture", async (ctx) => {
    try {
        await ctx.replyWithPhoto(
            { url: "https://random.imagecdn.app/500/360" },
            { caption: `Случайная картинка` }
        );
        await ctx.answerCbQuery();
    } catch (error) {
        console.error(error);
    }
});

bot.hears(/привет/i, async (ctx, next) => {
    await ctx.reply("Привет!");
    return next();
});
bot.hears(/^пока$/i, async (ctx, next) => {
    await ctx.reply("Пока...");
    return next();
});
bot.hears(/Покажи, пожалуйста, меню/i, async (ctx, next) => {
    sendOptionsKeyboard(ctx, bot, "Что делаем?");
    return next();
});

bot.on("photo", (ctx) => {
    ctx.reply("Супер картинка");
    ctx.replyWithQuiz("Красота?", ["Да", "Не очень"], {
        correct_option_id: 0,
    });
});

const { superWizard } = require("./scenes/wizard");
const { expencesScene } = require("./scenes/expences");

const stage = new Scenes.Stage([superWizard, expencesScene]);

bot.use(session(), stage.middleware());
bot.action("wizard", async (ctx) => {
    await ctx.scene.enter("super-wizard");
});
bot.action("expences", async (ctx) => {
    await ctx.scene.enter("expences-scene");
});
bot.command("wizard", async (ctx) => {
    await ctx.scene.enter("super-wizard");
});
bot.launch().then(() => console.log(`Assistant bot launched...`));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
