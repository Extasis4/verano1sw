const {Sequelize, DataType} = require('sequelize');
const sequelize = new Sequelize({
    dialect:'postgres',
    database:'db_test',
    host:'localhost',
    port:5432
})
/*

});
const autoMigrations = new AutoMigrations(sequelize);

const MyModel = sequelize.define('MyModel', {
    name: {
        type: STRING,
        allowNull: false,
    },
    email: {
        type: STRING,
        allowNull: false,
    },
});

autoMigrations
    .generateScript()
    .then(script => {
        const filePath = 'database_migration.sql';
        const fs = require('fs');

        fs.writeFileSync(filePath, script);

        console.log(`Archivo de script generado exitosamente en ${filePath}`);
    })
    .catch(error => {
        console.error('Error al generar el script:', error);
    });

 */
module.exports = sequelize;