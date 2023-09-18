const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (sequelize) => {
    sequelize.define('user',
        {
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'O nome não pode estar vazio.' },
                    is: {
                        args: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/g, // só letras e espaços, incluindo acentos
                        msg: 'O nome só pode ter letras e espaços.'
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notNull: { msg: 'O email não pode estar vazio.' },
                    isEmail: { msg: 'O email inserido não é válido.' }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'A password não pode estar vazia.' },
                    notEmpty: { msg: 'A password não pode estar vazia.' },
                    min: {
                        args: [6],
                        msg: 'A password precisa de ter no minimo 6 carateres'
                    },
                    is: {
                        args: ['^[A-Za-zÀ-ÖØ-öø-ÿ\\.\\/\\d\\w@$!%*#?&]{6,}$'],
                        msg: 'A password precisa de ter letras, numeros, e um dos carateres especiais: _ @ $ ! % * # ? &.'
                    }
                }
            },
            is_admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                default: false
            }
        },
        {
            name: { singular: 'user', plural: 'users' },
            underscored: true, // passa de 'createdAt' para 'created_at'. O postgres agradece :)
            freezeTableName: true, // não faz plurais nas relações com outras tabelas. Os devs agradecem :D
            paranoid: true, // na prática, faz com que os records não sejam eliminados, mas sim escondidos (soft-delete) 
            timestamps: true, // created_at, updated_at, e deleted_at
            hooks: {
                beforeCreate: (user) => {
                    // capitalizar o nome
                    user.nome =
                        user.nome
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