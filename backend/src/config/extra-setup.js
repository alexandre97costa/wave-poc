function initializeEntities(sequelize) {
    const models = [
        require('../model/user'),
        require('../model/wave')
    ];

    for (const model of models) { model(sequelize) };
}

function buildRelationships(sequelize) {
    const { User, Wave } = sequelize.models

    // relações 

    // ? owner
    User.hasMany(Wave, { foreignKey: 'owner_id' })
    Wave.belongsTo(User, { foreignKey: 'owner_id', onDelete: 'CASCADE' })

    // ? listen
    User.belongsToMany(Wave, { through: 'Listen' })
    Wave.belongsToMany(User, { through: 'Listen' })

    // ? favourites
    User.belongsToMany(Wave, { through: 'Favourite' })
    Wave.belongsToMany(User, { through: 'Favourite' })
}

module.exports = { initializeEntities, buildRelationships };