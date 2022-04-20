require('dotenv').config()
const { Markup, Scenes, Composer } = require('telegraf')
const { MongoClient } = require('mongodb')
const mongo = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongo.connect()

const stepHandler = new Composer()
stepHandler.action('next', async (ctx) => {
  await ctx.reply('Step 2. Via inline button')
  return ctx.wizard.next()
})
stepHandler.command('next', async (ctx) => {
  await ctx.reply('Step 2. Via command')
  return ctx.wizard.next()
})
stepHandler.use((ctx) =>
  ctx.replyWithMarkdown(
    'Press `Next` button or type /next',
    Markup.inlineKeyboard([Markup.button.callback('next', 'next')]),
  ),
)

const superWizard = new Scenes.WizardScene(
  'super-wizard',
  async (ctx) => {
    await ctx.reply(
      'шаг1',
      Markup.inlineKeyboard([Markup.button.callback('➡️ Next', '/next')]),
    )
    return ctx.wizard.next()
  },
  stepHandler,
  async (ctx) => {
    await ctx.reply('Step 3')
    return ctx.wizard.next()
  },
  async (ctx) => {
    ctx.state.age = ctx.message.text
    await mongo.db('bath-bot').collection('politikan').insertOne(ctx.state)
    await ctx.replyWithMarkdown(`__Work Done!!!__\n${ctx.state.age}`)
    return await ctx.scene.leave()
  },
)

module.exports = { superWizard }
