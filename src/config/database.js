const { Sequelize } = require('sequelize');
const { buildRelationships } = require('./extra-setup.js');

const databaseConfigs = {
	dialect: 'postgres',
	logging: console.log,
	dialectOptions: {
		ssl: { rejectUnauthorized: false }
	},
	define: {
		// hooks globais, atingem todos os modelos
		hooks: {
			afterCreate: model => {
				const ignoreModels = [
					// mete aqui as tabelas que NÃO queres ter a aparecer na consola quando são criadas.
					'uma-cena-qualquer'
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

const sequelize = 
	process.env.DATABASE_TYPE = "LOCAL" ?
		new Sequelize(
			"wave-poc", "postgres", "postgres",
			databaseConfigs
		) :
		new Sequelize(
			process.env.DATABASE_URL,
			databaseConfigs
		) ;
		

const models = [
	require('../model/user'),
	require('../model/wave')
]
for (const model of models) {
	model(sequelize)
}
buildRelationships(sequelize);
module.exports = sequelize