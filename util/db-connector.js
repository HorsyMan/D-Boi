const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

const Immunes = sequelize.define('immunes', {
    userId: {
        type: Sequelize.STRING,
        unique: true,
    },
    description: Sequelize.TEXT,
    name: Sequelize.STRING,
});
const Slangs = sequelize.define('slangs', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    description: Sequelize.TEXT,
    addedBy: Sequelize.STRING,
});
const BlackLists = sequelize.define('blacklist', {
    userId: {
        type: Sequelize.STRING,
        unique: true,
    },
    description: Sequelize.TEXT,
    name: Sequelize.STRING,
});
module.exports = class {
    constructor() {

        Immunes.sync();
        Slangs.sync();
        BlackLists.sync();
    }
    getImmunes() {
        return Immunes;
    }
    getSlangs() {
        return Slangs;
    }
    getBlackLists() {
        return BlackLists;
    }
    getSequilize() {
        return Sequelize;
    }
}