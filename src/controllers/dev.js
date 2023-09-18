
var sequelize = require('../config/database')
const userController = require('./user.js')
const bulk_users = require('../_dev/request bodies/create_user_in_bulk.json')
const { dev: devClass } = require('../_dev/dev')
const dev = new devClass;
const {
    user,
} = sequelize.models

module.exports = {

    create_users: async (req, res) => {
        if (process.env.MODE !== 'dev') return res.send(403).json({ msg: 'Este endpoint só está disponível em ambiente de desenvolvimento.' })

        await user
            .bulkCreate(bulk_users, { individualHooks: true })
            .then(response => res.status(200).json(response))
            .catch(error => res.status(400).json({ error }))
    },

    test: async (req, res) => {
        if (process.env.MODE !== 'dev') return res.send(403).json({ msg: 'Este endpoint só está disponível em ambiente de desenvolvimento.' })
        
        res.send(200).json({msg: 'This is a test.'})
    },
}