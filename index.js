require('dotenv').config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
  {
    command: 'start', 
    description: 'start bot'
  },
  {
    command: 'menu',
    description: 'menu'
  },
  {
    command: 'inline_keyboard',
    description: 'inline keyboard'
  }
])

bot.command('start', async (ctx) => {
  await ctx.react('❤');
  await ctx.reply('Hello! I am Alma bot',
    {
      reply_parameters: { message_id: ctx.msg.message_id }
    }
  );
});

const menuKeyboard = new InlineKeyboard()
  .text('order status', 'order-status')
  .text('write to support', 'support')

const backKeyboard = new InlineKeyboard()
  .text('< back to menu', 'back')

bot.command('menu', async (ctx) => {
  await ctx.reply('choose menu option',
    {
      reply_markup: menuKeyboard
    }
  )
});

bot.callbackQuery('order-status', async (ctx) => {
  await ctx.callbackQuery.message.editText('order status: delivery',
    {
      reply_markup: backKeyboard
    }
  )
  await ctx.answerCallbackQuery()
});

bot.callbackQuery('support', async (ctx) => {
  await ctx.callbackQuery.message.editText('write your question',
    {
      reply_markup: backKeyboard
    }
  )
  await ctx.answerCallbackQuery()
});

bot.callbackQuery('back', async (ctx) => {
  await ctx.callbackQuery.message.editText('back to menu',
    {
      reply_markup: menuKeyboard
    }
  )
  await ctx.answerCallbackQuery()
});
// bot.command('share', async (ctx) => {
//   const shareKeyboard = new Keyboard().requestLocation('geolocation').requestContact('contact')
//     .requestPoll('poll').placeholder('share info').resized();

//   await ctx.reply('What do you want to share:', {
//     reply_markup: shareKeyboard
//   })
// })

bot.command('inline_keyboard', async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text('1', 'button-1')
    .text('2', 'button-2')
    .text('3')

  await ctx.reply('Choose the number:', {
    reply_markup: inlineKeyboard
  })
})

// bot.callbackQuery(['button-1', 'button-2', 'button-3'], async (ctx) => {
bot.callbackQuery(/button-[1-3]/, async (ctx) => {
  await ctx.answerCallbackQuery('the number is')
  await ctx.reply(`you choose number ${ctx.callbackQuery.data}`)
});

// bot.on('callback_query:data', async (ctx) => {
//   await ctx.answerCallbackQuery()
//   await ctx.reply(`you choose number ${ctx.callbackQuery.data}`)
// })

bot.on(':contact', async (ctx) => {
  await ctx.reply('tnx for your contact!')
})

// bot.command('mood', async (ctx) => {
//    const moodKeyboard = new Keyboard().text('good').row().text('norm').row()
//      .text('bad').resized().oneTime();

//   const moodLabels = ['good', 'norm', 'bad'];
//   const rows = moodLabels.map((label) => {
//     return [
//       Keyboard.text(label)
//     ]
//   });
//   const moodKeyboard = Keyboard.from(rows).resized();

//   await ctx.reply('How is your mood?', {
//     reply_markup: moodKeyboard
//   });
// });

bot.hears('good', async (ctx) => {
  await ctx.reply('great!', {
    reply_markup: { remove_keyboard: true }
  });
})

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not to connect with Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

bot.start();