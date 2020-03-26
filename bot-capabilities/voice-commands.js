const config = require('../config.json');
const ytdl = require('ytdl-core');
module.exports = class {
    constructor() {

    }
    async play(message, link) {
        message.reply(`Lets try to play: ${link} ? 🎵`);
        const request = message.guild.members.cache.get(`${message.author.id}`);
        let current = 'https://youtu.be/MDE-_UyRBbs?t=9';
        if (args[0].indexOf('http://www.youtube.com') === -1 && args[0].indexOf('https://www.youtube.com') === -1 && args[0].indexOf('http://youtube.com') === -1 && args[0].indexOf('https://youtube.com') === -1) {
            message.reply('This does not seem as valid YT link!');
            current = 'https://www.youtube.com/watch?v=fI8wGoq2NNI';
        }
        else {
            current = link;
        }
        request.voice.channel.join().then(connection => {
            console.log('joined channel');
            console.log(`${current}`);
            const dispatcher = connection.play(ytdl(current));
            dispatcher.on('start', () => {
                console.log('link is now playing!');
            });
            dispatcher.on('finish', () => {
                console.log('link has finished playing!');
                connection.channel.leave();
            });

        });
    }
    async silence(message, personList) {
        for (let index = 0; index < personList.length; index++) {
            const member = message.guild.members.cache.get(`${personList[index].replace('<', '').replace('>', '').replace('!', '').replace('@', '')}`);
            member.voice.setMute();
            message.channel.send(`Have fun with being muted! <@!${personList[index].replace('<', '').replace('>', '').replace('!', '').replace('@', '')}> 🔕`);
        }
    }
    async stop(message) {
        message.channel.send('🤚🏿');
        const chan = message.guild.members.cache.get(`${message.author.id}`);
        chan.voice.channel.leave();
    }
}