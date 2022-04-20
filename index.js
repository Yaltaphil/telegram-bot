require('dotenv').config()
const { Telegraf, Markup, Scenes, session } = require('telegraf')
const {
  setBotCommands,
  sendOptionsKeyboard,
  actionSendPicture,
} = require('./utils')

const { MongoClient } = require('mongodb')
const mongo = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongo.connect().then()

const bot = new Telegraf(process.env.BOT_TOKEN)

setBotCommands(bot)

bot.start((ctx) => {
  ctx.reply(
    'Приветствую. Сегодня я Ваш бот!',
    Markup.keyboard(['Привет!', 'Покажи, пожалуйста, меню', 'Пока']),
  )
})

bot.help((ctx) => ctx.reply(`/menu\n/wizard\n`))

bot.command('menu', async (ctx) => {
  await ctx.replyWithHTML(`Привет <b>${ctx.message.from.first_name}</b> !`)
  sendOptionsKeyboard(ctx, bot, 'Что делаем?')
})

actionSendPicture(
  bot,
  'dog',
  './images/pexels-bruno-oliveira-11563927.jpg',
  'Dog',
)
actionSendPicture(
  bot,
  'cat',
  './images/pexels-evg-kowalievska-1170986.jpg',
  'Cat',
)

bot.action('dice', async (ctx) => {
  try {
    await ctx.replyWithDice()
    await ctx.answerCbQuery()
  } catch (error) {
    console.log(error)
  }
})

bot.action('picture', async (ctx) => {
  try {
    await ctx.replyWithPhoto(
      { url: 'https://random.imagecdn.app/500/360' },
      { caption: `Случайная картинка` },
    )
    await ctx.answerCbQuery()
  } catch (error) {
    console.error(error)
  }
})

bot.hears(/привет/i, async (ctx, next) => {
  await ctx.reply('Привет!')
  return next()
})
bot.hears(/^пока$/i, async (ctx, next) => {
  await ctx.reply('Пока...')
  return next()
})
bot.hears(/Покажи, пожалуйста, меню/i, async (ctx, next) => {
  sendOptionsKeyboard(ctx, bot, 'Что делаем?')
  return next()
})

bot.on('photo', async (ctx) => {
  // mongo.connect(async () => {
  await mongo.db('bath-bot').
    collection('pictures').
    insertOne(ctx.message.photo[3])
  await ctx.reply('Супер картинка')
  await ctx.replyWithQuiz('Красота?', ['Да', 'Не очень'], {
    correct_option_id: 0,
  })
  const data = await mongo.db('bath-bot').
    collection('pictures').
    findOne({}, { file_id: true })

  await ctx.replyWithPhoto(data.file_id)
})
// });

const { superWizard } = require('./scenes/wizard')
const { expensesScene } = require('./scenes/expenses')

const stage = new Scenes.Stage([superWizard, expensesScene])

bot.use(session(), stage.middleware())
bot.action('wizard', async (ctx) => {
  await ctx.scene.enter('super-wizard')
})
bot.action('expenses', async (ctx) => {
  await ctx.scene.enter('expenses-scene')
})
bot.command('wizard', async (ctx) => {
  await ctx.scene.enter('super-wizard')
})
bot.launch().then(() => console.log(`Assistant bot launched...`))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports.handler = async function (event, context) {
  const message = JSON.parse(event.body)
  await bot.handleUpdate(message)
  return {
    statusCode: 200,
    body: '',
  }
}
