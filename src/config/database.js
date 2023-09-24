const { Sequelize } = require('sequelize');
const { buildRelationships } = require('./extra-setup.js');

const databaseConfigs = {
	dialect: 'postgres',
<<<<<<< Updated upstream
	logging: console.log,
	dialectOptions: {
		ssl: { rejectUnauthorized: false }
	},
=======
	logging: false,
	// logging: console.log,
	// dialectOptions: {
	// 	ssl: { rejectUnauthorized: (process.env.DATABASE_TYPE = "LOCAL") }
	// },
>>>>>>> Stashed changes
	define: {
		// hooks globais, atingem todos os modelos
		hooks: {
			afterCreate: model => {
				const ignoreModels = [
					// mete aqui as tabelas que NÃO queres ter a aparecer na consola quando são criadas.
<<<<<<< Updated upstream
=======
					'uma-cena-qualquer'
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
const sequelize = 
	process.env.DATABASE_TYPE = "LOCAL" ?
=======
const sequelize =
	process.env.DATABASE_TYPE == "LOCAL" ?
>>>>>>> Stashed changes
		new Sequelize(
			"wave-poc", "postgres", "postgres",
			databaseConfigs
		) :
		new Sequelize(
			process.env.DATABASE_URL,
			databaseConfigs
<<<<<<< Updated upstream
		) ;
		
=======
		);

>>>>>>> Stashed changes

const models = [
	require('../model/user'),
	require('../model/wave')
]
for (const model of models) {
	model(sequelize)
}
buildRelationships(sequelize);
module.exports = sequelize