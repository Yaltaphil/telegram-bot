const { Markup, Scenes, Composer } = require("telegraf");

const { enter, leave } = Scenes.Stage;

const expencesScene = new Scenes.BaseScene("expences-scene");

expencesScene.enter((ctx) => ctx.reply("Hi"));
expencesScene.leave((ctx) => ctx.reply("Bye"));
expencesScene.hears("bye", leave("expences-scene"));
expencesScene.on("message", (ctx) => ctx.replyWithMarkdown("Send `hi`"));


module.exports = { expencesScene };
