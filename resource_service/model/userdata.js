const { sequelize, DataTypes } = require('../helper/dbsource');

const User = require('./user')

const UserData = sequelize.define('UserData', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    organizationName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'userId',
        }
    },
    CreateDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    UpdateDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'user_data',
    timestamps: false
});

UserData.belongsTo(User, { foreignKey: 'userId' })

module.exports = UserData;