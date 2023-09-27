const { Sequelize } = require('sequelize');
const { initializeEntities, buildRelationships } = require('./extra-setup.js');

const databaseConfigs = {
	dialect: 'postgres',
	logging: false,
	// dialectOptions: {
	// 	ssl: { rejectUnauthorized: false }
	// },
	define: {
		// hooks globais, atingem todos os modelos
		hooks: {
			afterCreate: model => {
				const ignoreModels = [
					// mete aqui as tabelas que NÃO queres ter a aparecer na consola quando são criadas.
				]
				if (!ignoreModels.includes(model.constructor.name)) {
					console.log('\x1b[37m\x1b[46m ' + model.constructor.name + '(#' + model.id + ') criado \x1b[0m ')
				}
			},
			afterUpdate: model => {
				console.log('\x1b[37m\x1b[43m ' + model.constructor.name + '(#' + model.id + ') atualizado \x1b[0m ')
			},
			afterDestroy: model => {
				console.log('\x1b[37m\x1b[41m ' + model.constructor.name + '(#' + model.id + ') eliminado ⚠ \x1b[0m ')
			}
		}
	}
}

let DATABASE_URL;
switch (process.env.DATABASE_TYPE) {
	case "LOCAL": 	 DATABASE_URL = process.env.DB_URL_LOCAL;		break;
	case "RAILWAY":  DATABASE_URL = process.env.DB_URL_RAILWAY;		break;
	case "SUPABASE": DATABASE_URL = process.env.DB_URL_SUPABASE;	break;

	default: DATABASE_URL = "Please define a database type in the .env file."; break;
};

const sequelize = new Sequelize(DATABASE_URL, databaseConfigs);

initializeEntities(sequelize);
buildRelationships(sequelize);

module.exports = sequelize;