const Authorizor = require('./authorizer');
const authorizer = new Authorizor();
const config = require('../config.json');
const DbConnector = require('../util/db-connector');
const dbconnection = new DbConnector();
//const Discord = require('discord.js');
//const message = new Discord.Message();
const VoiceCommands = require('./voice-commands');
const voiceManager = new VoiceCommands();
const Sequelize = require('sequelize');
const sequelize = dbconnection.getSequilize();
const SlangCommands = require('./slang-command');
const slangManager = new SlangCommands();
module.exports = class {
    constructor() {
    }
    async analyzeContext(message) {
        console.log(message.author.id);
        const isAuthorized = await authorization(userId, dbconnection.getImmunes());
        const userId = message.author.id;
        if (!(message.context.startsWith('!'))) {
            if (!(isAuthorized)) {
                await catchSlang(message, dbconnection.getBlackLists(), dbconnection.getSlangs());
            }
            return;
        }
        const command = message.content.toLowerCase().split(/ +/)[0];
        const args = message.content.split(/ +/).slice(1);
        switch (command) {
            case `${config.prefix}allow`:
                if (isAuthorized) {
                    await allow(message, args, dbconnection.getSlangs());
                }
                break;
            case `${config.prefix}authorize`:
                if (isAuthorized) {
                    await authorize(message.channel, userId, args, dbconnection.getImmunes());
                }
                else {
                    message.reply('You are not authorized to take this action!');
                }
                break;
            case `${config.prefix}bot`:
                bot(message.channel, userId);
                break;
            case `${config.prefix}cleanUpChat`:
                if (isAuthorized) {
                    await cleanUpChat(message);
                }
                else {
                    message.reply('You are not authorized to take this action!');
                }
                break;
            case `${config.prefix}deny`:
                if (isAuthorized) {
                    deny(message, args, dbconnection.getSlangs());
                }
                else {
                    message.reply('You are not authorized to take this action!');
                }
                break;
            case `${config.prefix}hi`:
                message.reply('My sincerely greetings!');
                break;
            case `${config.prefix}help`:
                help(message);
                break;
            case `${config.prefix}ping`:
                message.channel.send('Pong.');
                break;
            case `${config.prefix}play`:
                if (isAuthorized) {
                    play(message, args);
                }
                else {
                    message.reply('You are not authorized to take this action!');
                }
                break;
            case `${config.prefix}server`:
                message.channel.send(`The server: ${message.guild.name}`);
                break;
            case `${config.prefix}silence`:
                if (isAuthorized) {
                    silence(message, args);
                }
                else {
                    message.reply('You are not authorized to take this action!');
                }
                break;
            case `${config.prefix}stop`:
                if (isAuthorized) {
                    stop(message);
                }
                else {
                    message.reply('You are not authorized to take this action!');
                }
                break;
            case `${config.prefix}unauthorize`:
                if (isAuthorized) {
                    await unauthorize(message.channel, userId, args, dbconnection.getImmunes());
                }
                else {
                    message.reply('You are not authorized to take this action!');
                }
                break;
            default:
                unknownCommand(message);
                break;
        }

    }

}
async function allow(message, args, Slangs) {
    for (let i = 0; i < args.length; i++) {
        if (await slangManager.allow(args[i]).toLowerCase(), Slangs) {
            channel.send(`${args[i]} has been allowed to use in our text channels!`);
        }
        else {
            channel.send(`Unable to remove from slangs list: ${args[i]}. Please control the application log.`);
        }
    }
}
async function authorization(userId, Immunes) {
    return await authorizer.isAuthorized(userId, Immunes);
}
async function authorize(channel, userId, args, Immunes) {
    for (let i = 0; i < args.length; i++) {
        if (await authorizer.setAuth(args[i].replace('<', '').replace('>', '').replace('!', '').replace('@', ''), Immunes)) {
            channel.send(`${args[i]} has been authorized!`);
        }
        else {
            channel.send(`Unable to authorize ${args[i]} Please control the application log`);
        }
    }
}
function bot(channel) {
    channel.send(`It\'s your D-Boi! Activated and moderated by <@!${config.superUserId}>`);
}
async function catchSlang(message, BlackLists, Slangs) {
    const code = await slangManager.catchSlang(message, BlackLists, Slangs);
    switch (code) {
        case 1:
            message.reply('Warning. This is the first time you use slang!. Next time you will be kicked from the server');
            break;
        case 2:
            message.channel.send(`<@!${message.author.id}> has been kicked from the server`);
            break;
        default:
            break;
    }
}
async function cleanUpChat(message) {
    message.channel.send(`${config.waitDurationMs / 100} secconds left, every conversation goes to the darkness of our history.😢`);
    await sleep(config.waitDurationMs);
    const cname = message.channel.name;
    message.channel.delete();
    const nchannel = await message.guild.channels.create(cname, { type: 'text', reason: 'Channel has been cleaned up!' });
    nchannel.send('Channel has been cleaned up!');
}
async function deny(message, args, Slangs) {
    for (let i = 0; i < args.length; i++) {
        if (await slangManager.deny(message, args[i]).toLowerCase(), Slangs) {
            message.channel.send(`${args[i]} word has been denied in our text channels!`);
        }
        else {
            message.channel.send(`Unable to add slangs list: ${args[i]}. Please control the application log.`);
        }
    }
}
function help(message) {
    message.reply('Commands should start with ! tag.(F.e. : !ping). Available commands👇');
    let context = 'allow 👉 Allows word(s) to type in chat. By default all words are allowed. Example usage: !allow word1 word2';
    context += '\n' + 'authorize 👉 Authorize user(s) to modify and use important commands and avoid limitations. Example usage: !allow @user1';
    context += '\n' + 'bot 👉 Describes what I am';
    context += '\n' + `cleanUpChat 👉 Cleans chat after ${config.waitDurationMs / 100} seconds `;
    context += '\n' + 'deny 👉 Denies word(s) to type in chat. By default all words are allowed. Example usage: !deny word1 word2';
    context += '\n' + 'help 👉 lists commands';
    context += '\n' + 'hi 👉 Greetings command';
    context += '\n' + 'ping 👉 Pong';
    context += '\n' + 'play 👉 Plays given youtube link in a voice channel where you have been. Example usage: !play https://youtube.com/valid-uri';
    context += '\n' + 'server 👉 Gives a short brief about the server';
    context += '\n' + 'silence 👉 Silence given user in her/his voice channel. Example usage: !silence @user1';
    context += '\n' + 'stop 👉 Stop playing and lefts from current voice channel. Example usage: !stop';
    context += '\n' + 'unauthorize 👉 Unauthorize user(s) to modify and use important commands and avoid limitations. Example usage: !allow @user1';
    message.channel.send(`${context}`);
}
async function play(message, args) {
    if (await voiceManager.play(message, args[0])) {
        message.reply(`${args[0]} is now playing!`);
    }
    else {
        message.reply(`Unable to play ${args[0]} Please control the application log`);
    }
}
async function silence(message, args) {
    for (let i = 0; i < args.length; i++) {
        if (await voiceManager.silence(message, args[i])) {
            message.reply(`${args[i]} has been silenced!`);
        }
        else {
            message.reply(`Unable to silence ${args[i]} Please control the application log`);
        }
    }
}
async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
async function stop(message) {
    if (await voiceManager.stop(message)) {
        message.reply('I have left, see you');
    }
    else {
        message.reply('Unable to leave the channel  Please control the application log');
    }
}
async function unauthorize(channel, userId, args, Immunes) {
    for (let i = 0; i < args.length; i++) {
        if (await authorizer.unsetAuth(args[i].replace('<', '').replace('>', '').replace('!', '').replace('@', ''), Immunes)) {
            channel.send(`${args[i]} has been unauthorized!`);
        }
        else {
            channel.send(`Unable to unauthorize ${args[i]} Please control the application log`);
        }
    }
}
function unknownCommand(message) {
    message.channel.send('Unknown command!').then(() => message.react('🧐'));;
}