
var sequelize = require('../config/database')
const supabase = require('../config/supabase')
const userController = require('./user.js')
const bulk_users = require('../_dev/request bodies/create_user_in_bulk.json')
const bulk_waves = require('../_dev/request bodies/create_wave_in_bulk.json')
const { dev: devClass } = require('../_dev/dev')
const dev = new devClass;
const {
    User,
    Wave
} = sequelize.models

module.exports = {

    create_users: async (req, res) => {
        if (process.env.MODE !== 'dev') return res.status(403).json({ msg: 'Este endpoint só está disponível em ambiente de desenvolvimento.' })

        await User
            .bulkCreate(bulk_users, { individualHooks: true })
            .then(response => res.status(200).json(response))
            .catch(error => res.status(400).json({ error }))
    },

    create_waves: async (req, res) => {
        if (process.env.MODE !== 'dev') return res.status(403).json({ msg: 'Este endpoint só está disponível em ambiente de desenvolvimento.' })

        await Wave
            .bulkCreate(bulk_waves, { individualHooks: true })
            .then(response => res.status(200).json(response))
            .catch(error => res.status(400).json({ error }))
    },


    test_login: async (req, res) => {
        if (process.env.MODE !== 'dev') return res.status(403).json({ msg: 'Este endpoint só está disponível em ambiente de desenvolvimento.' })

        // res.status(200).json({msg: 'This is a test.'})

        await supabase.auth
            .signInWithPassword({
                email: 'example@email.com',
                password: 'password',
            })
            .then(({ data, error }) => {

                (!error) ?
                    res.status(200).json({ data }) :
                    res.status(error.status).json({ error })

            })
            .catch(error => res.status(400).json({ error }))

    },

    test_logout: async (req, res) => {
        if (process.env.MODE !== 'dev') return res.status(403).json({ msg: 'Este endpoint só está disponível em ambiente de desenvolvimento.' })

        // res.status(200).json({msg: 'This is a test.'})

        await supabase.auth
            .signOut()
            .then(({ error }) => {

                (!error) ?
                    res.status(200) :
                    res.status(error.status).json({ error })

            })
            .catch(error => res.status(400).json({ error }))

    },
}