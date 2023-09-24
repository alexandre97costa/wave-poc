const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (sequelize) => {
    sequelize.define('User',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Your name is required' },
                    is: {
                        args: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/g, // só letras e espaços, incluindo acentos
                        msg: 'Your name can only have letters and spaces'
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notNull: { msg: 'The email is required' },
                    isEmail: { msg: 'The email must be valid' }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'The password is required' },
                    notEmpty: { msg: 'Your password cannot be empty' },
                    min: {
                        args: [6],
                        msg: 'Your password needs to have at least 6 characters'
                    },
                    is: {
                        args: ['^[A-Za-zÀ-ÖØ-öø-ÿ\\.\\/\\d\\w@$!%*#?&]{6,}$'],
                        msg: 'Your password needs to have letters, numbers, and at least one of this characters: _ @ $ ! % * # ? &'
                    }
                }
            },
            is_admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            name: { singular: 'User', plural: 'Users' },
            underscored: true, // passa de 'createdAt' para 'created_at'. O postgres agradece :)
            freezeTableName: true, // não faz plurais nas relações com outras tabelas. Os devs agradecem :D
            paranoid: true, // na prática, faz com que os records não sejam eliminados, mas sim escondidos (soft-delete) 
            timestamps: true, // created_at, updated_at, e deleted_at
            hooks: {
                beforeCreate: (user) => {
                    // capitalizar o name
                    user.name =
                        user.name
                            .trim()
                            .split(' ')
                            .map(word => {
                                return word[0].toUpperCase() + word.substring(1, word.length)
                            })
                            .join(' ');

                    // encriptar password
                    return bcrypt.hash(user.password, 10)
                        .then(hash => { user.password = hash; })
                        .catch(err => { throw new Error(err); });
                },
                beforeUpdate: (user) => {
                    // se no update foi mudada a passe, é preciso encriptá-la
                    if (user.previous().hasOwnProperty('password')) {
                        return bcrypt.hash(user.password, 10)
                            .then(hash => {
                                user.password = hash;
                                console.log('nova: ', user.password)
                            })
                            .catch(err => { throw new Error(err); });
                    }
                },
                afterDestroy: async (user) => {

                    // quando o user for eliminado, eliminar tb records relacionados com ele

                    /* exemplo: 

                    await sequelize.models.reserva
                        .destroy({ where: { visitante_id: user.id }, individualHooks: true })
                    */

                }
            }
        }
    )
}