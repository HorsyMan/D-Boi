const config = require('../config.json');
module.exports = class {
    constructor() {

    }
    async allow(words, Slangs) {
        for (let index = 0; index < words.length; index++) {
            try {
                const pure = await Slangs.destroy({ where: { name: `${args[index]}` } });
                if (!pure) {
                    console.log('Given word is already allowed!');
                    return;
                }
                console.log('Given word has been allowed!');
                return true;
            }
            catch (e) {
                console.log('An exception has thrown during the db request');
                return;
            }
        }
    }
    async catchSlang(message, BlackLists, Slangs) {
        const slangs = await Slangs.findAll({ attributes: ['name'] });
        //  console.log(slangs);
        for (let index = 0; index < slangs.length; index++) {
            const slang = slangs[index];
            console.log(slang.name);
            if (message.content.toLowerCase().toLowerCase().indexOf(' ' + slang.name + ' ') !== -1) {
                try {
                    // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                    const bl = await BlackLists.create({
                        name: 'Pezevenk',
                        description: `${message.createdAt} tarihinde tarafımdan eklendi!`,
                        userId: `${message.author.id}`,
                    });
                    message.reply('Warning. This is the first time you use slang!. Next time you will be kicked from the server');
                }
                catch (e) {
                    if (e.message === 'Validation error') {
                        message.channel.send(`<@!${message.author.id}> has been kicked from the server`);
                        const member = message.guild.members.cache.get(`${message.author.id}`);
                        member.kick();
                    }
                    else {
                        console.log(e.message);
                    }
                }
            }
        }
    }
    async deny(message, words, Slangs) {
        for (let index = 0; index < words.length; index++) {
            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                const slangs = await Slangs.create({
                    name: `${words[index]}`,
                    description: `${message.createdAt} has been added to list!`,
                    addedBy: `${message.author.username}`,
                });
                console.log(`${slangs.name} has been added to denial list.`);
                return true;
            }
            catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    console.log(`${words[index]} has already been denied!`);
                    return;
                }
                console.log(e.message);
                console.log('An exception has thrown during the db request');
                return;
            }
        }
    }
}