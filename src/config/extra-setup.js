function applyExtraSetup(sequelize) {
    const { user, wave } = sequelize.models

    // relações 

    user.hasMany(wave, { foreignKey: 'owner_id' })
    wave.belongsTo(user, { foreignKey: 'owner_id', onDelete: 'CASCADE' })
}

module.exports = { applyExtraSetup };