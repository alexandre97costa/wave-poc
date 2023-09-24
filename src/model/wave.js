const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Wave',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sound: {
                type: DataTypes.BLOB,
                allowNull: false
            },
            // pode ser util pra ter uma imagem do wave no site
            image_url: {
                type: DataTypes.STRING,
            },
            // só o owner pode ouvir
            is_private: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },

            // para o qr code
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },

            // para poupar nos pedidos à API de códigos QR, podemos guardar um binário aqui
            qr_binary: {
                type: DataTypes.STRING
            }

            // para guardar a info de altura das barras do produto
            plot_points: {
                type: DataTypes.ARRAY(DataTypes.SMALLINT)
            }
        },
        {
            name: { singular: 'wave', plural: 'waves' },
            underscored: true, // passa de 'createdAt' para 'created_at'. O postgres agradece :)
            freezeTableName: true, // não faz plurais nas relações com outras tabelas. Os devs agradecem :D
            paranoid: true, // na prática, faz com que os records não sejam eliminados, mas sim escondidos (soft-delete) 
            timestamps: true, // created_at, updated_at, e deleted_at
        }
    )
}