const TelegramBot = require('node-telegram-bot-api');

const token = '';

const bot = new TelegramBot(token,{polling: true});

const commands = [

    {

        command: "start",
        description: "Запуск бота"

    },

    {

        command: "help",
        description: "Раздел помощи"

    },
    {

        command: "site",
        description: "ссылка на сайт октагон"

    },
    {

        command: "creator",
        description: "фио разраба"

    },

]

bot.setMyCommands(commands);

bot.on('text', async msg => {

    try {

        if(msg.text.startsWith('/start')) {
            
            await bot.sendMessage(msg.chat.id, `Вы запустили бота!`);

            if(msg.text.length > 6) {

                const refID = msg.text.slice(7);

                await bot.sendMessage(msg.chat.id, `Вы зашли по ссылке пользователя с ID ${refID}`);

            }

        }
        else if(msg.text == '/help') {

            await bot.sendMessage(msg.chat.id, `Раздел помощи`);

        }
        else if(msg.text == '/site') {

            await bot.sendMessage(msg.chat.id,'[Сайт Октагон](https://students.forus.ru/?ysclid=lzi7fy42w980728758)',{
		 parse_mode: "MarkdownV2"
	    });

        }
        else if(msg.text == '/creator') {

            await bot.sendMessage(msg.chat.id, `Ткачук Юрий`);

        }
        else {

            await bot.sendMessage(msg.chat.id, msg.text);

        }

    }
    catch(error) {

        console.log(error);

    }

})

