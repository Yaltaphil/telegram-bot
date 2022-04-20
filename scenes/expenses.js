const { Markup, Scenes, Composer } = require('telegraf')

const { enter, leave } = Scenes.Stage

const expensesScene = new Scenes.BaseScene('expences-scene')

expensesScene.enter((ctx) => ctx.reply('Hi'))
expensesScene.leave((ctx) => ctx.reply('Bye'))
expensesScene.hears('bye', leave('expences-scene'))
expensesScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'))

module.exports = { expensesScene }
