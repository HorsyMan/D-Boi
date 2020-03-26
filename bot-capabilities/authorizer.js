const config = require('../config.json');
module.exports = class {
    constructor() {
    }
    async isAuthorized(userId, Immunes) {
        if (`${userId}` === config.superUserId) {
            return userId;
        }
        const tag = await Immunes.findOne({ where: { userId: userId } });
        return tag;
    }
    async setAuth(userId, Immunes) {
        for (let index = 0; index < args.length; index++) {
            if (args[index].length !== '18') {
                console.log('Invalid User Id');
                return;
            }
            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                const immune = await Immunes.create({
                    name: 'authorized',
                    description: `Done @ ${message.createdAt} .`,
                    userId: `${args[index].replace('<', '').replace('>', '').replace('!', '').replace('@', '')}`,
                });
                console.log(`${args[index]} is now ${immune.name}.👼🏽`);
                return immune;
            }
            catch (e) {
                if (e.message === 'Validation error') {
                    console.log(`${args[index]} is already authorized! 😱`);
                    return;
                }
                else {
                    console.log(`Operation cannot be complated for ${args[index]}.`);
                    return;
                }
            }
        }
    }
    async unsetAuth(userId, Immunes) {
        for (let index = 0; index < args.length; index++) {
            if (args[index].length !== '18') {
                console.log('Invalid User Id');
            }
            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                const immune = await Immunes.destroy({ where: { userId: `${args[index].replace('<', '').replace('>', '').replace('!', '').replace('@', '')}` } });
                if (!immune) {
                    console.log(`${args[index]} is already unauthorized.👼🏽`);
                    return;
                }
                console.log(`${args[index]} is now unauthorized.👼🏽`);
                return immune;
            }
            catch (e) {
                console.log(`Operation cannot be complated for ${args[index]}.`);
                return;
            }
        }
    }

}