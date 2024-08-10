const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2/promise');


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "chatbottests",
    password: "chatbottests"
});

const token = '';
const bot = new TelegramBot(token, { polling: true });

const commands = [
    { command: "start", description: "Запуск бота" },
    { command: "help", description: "Раздел помощи" },
    { command: "site", description: "Ссылка на сайт" },
    { command: "creator", description: "ФИО разработчика" },
    { command: "randomitem", description: "Случайный предмет" },
    { command: "deleteitem", description: "Удалить предмет по ID" },
    { command: "getitembyid", description: "Предмет по ID" }
];

bot.setMyCommands(commands);

bot.on('text', async msg => {
    const chatId = msg.chat.id;

    try {
        if (msg.text.startsWith('/start')) {
            await bot.sendMessage(chatId, `Вы запустили бота!`);

            if (msg.text.length > 6) {
                const refID = msg.text.slice(7);
                await bot.sendMessage(chatId, `Вы зашли по ссылке пользователя с ID ${refID}`);
            }

        } else if (msg.text === '/help') {
            await bot.sendMessage(chatId, `Раздел помощи`);

        } else if (msg.text === '/site') {
            await bot.sendMessage(chatId, '[Сайт Октагон](https://students.forus.ru/?ysclid=lzi7fy42w980728758)', {
                parse_mode: "MarkdownV2"
            });

        } else if (msg.text === '/creator') {
            await bot.sendMessage(chatId, `Ткачук Юрий`);

        } else if (msg.text === '/randomitem') {
            const [rows] = await db.query('SELECT * FROM items ORDER BY RAND() LIMIT 1');
            if (rows.length > 0) {
                const item = rows[0];
                await bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.desc}`);
            } else {
                await bot.sendMessage(chatId, 'Предметы не найдены.');
            }

        } else if (msg.text.startsWith('/deleteitem')) {
            const id = parseInt(msg.text.split(' ')[1]);
            if (isNaN(id)) {
                await bot.sendMessage(chatId, 'Ошибка: неверный ID.');
            } else {
                const [result] = await db.query('DELETE FROM items WHERE id = ?', [id]);
                if (result.affectedRows > 0) {
                    await bot.sendMessage(chatId, `Удачно: предмет с ID ${id} удален.`);
                } else {
                    await bot.sendMessage(chatId, 'Ошибка: предмет с таким ID не найден.');
                }
            }

        } else if (msg.text.startsWith('/getitembyid')) {
            const id = parseInt(msg.text.split(' ')[1]);
            if (isNaN(id)) {
                await bot.sendMessage(chatId, 'Ошибка: неверный ID.');
            } else {
                const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [id]);
                if (rows.length > 0) {
                    const item = rows[0];
                    await bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.desc}`);
                } else {
                    await bot.sendMessage(chatId, 'Ошибка: предмет с таким ID не найден.');
                }
            }

        } else {
            await bot.sendMessage(chatId, msg.text);
        }

    } catch (error) {
        console.error(error);
        await bot.sendMessage(chatId, 'Произошла ошибка.');
    }
});
