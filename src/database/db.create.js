const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(
    {
        dialect:"sqlite",
        define: {
            timestamps: false
        },
        storage: './database.sqlite',
    }
);

const connectDataBase = async () => {
    await sequelize.sync()
        .then(() => {
            console.log('Tables are synchronized with the database');
        })
        .catch(err => {
            console.error('Synchronization error:', err);
        });

    await sequelize.authenticate();
    console.log("Connected to DB");
}

module.exports = { sequelize, connectDataBase };