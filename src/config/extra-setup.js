function buildRelationships(sequelize) {
    const { user, wave } = sequelize.models

    // relações 

    // ? owner
    user.hasMany(wave, { foreignKey: 'owner_id' })
    wave.belongsTo(user, { foreignKey: 'owner_id', onDelete: 'CASCADE' })

    // ? listen
    user.belongsToMany(wave, { through: 'listen'})
    wave.belongsToMany(user, { through: 'listen'})
    
    // ? favourites
    user.belongsToMany(wave, { through: 'favourite'})
    wave.belongsToMany(user, { through: 'favourite'})
}

module.exports = { buildRelationships };