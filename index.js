/* eslint-disable no-case-declarations */
/* eslint-disable indent */
// https://getemoji.com/ available emojis
const Discord = require('discord.js');
//const Sequelize = require('sequelize');
const client = new Discord.Client();
const config = require('./config.json');
//const ytdl = require('ytdl-core');
//const authorizer = require('./bot-capabilities/authorizer');
const CommandManager = require('./bot-capabilities/command-manager');
const commandManager = new CommandManager();
client.once('ready', () => {
    console.log('Ready!');

});
/*
client.on('debug', console.log);
*/
client.on('message', async message => {
    //console.log(message.content.toLowerCase());
    console.log(message.content);
    if (config.botUserId !== `${message.author.id}`) {
        await commandManager.analyzeContext(message);
    }
});

client.login(config.token);

