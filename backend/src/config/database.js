const { Sequelize } = require('sequelize');
const { buildRelationships } = require('./extra-setup.js');

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

let DATABASE_URL = () => {
	switch (process.env.DATABASE_TYPE) {
		case "LOCAL": return process.env.DB_URL_LOCAL;
		case "RAILWAY": return process.env.DB_URL_RAILWAY;
		case "SUPABASE": return process.env.DB_URL_SUPABASE;

		default: return process.env.DB_URL_LOCAL;
	}
}

const sequelize = new Sequelize(DATABASE_URL, databaseConfigs);


// init models & relations
const models = [
	require('../model/user'),
	require('../model/wave')
];

for (const model of models) { model(sequelize) };

buildRelationships(sequelize);

module.exports = sequelize;