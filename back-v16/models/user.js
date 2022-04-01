'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.User.hasMany(models.Workspace, {
                as: 'Owned',
                foreignKey: 'OwnerId',
            })
            models.User.belongsToMany(models.Workspace, {
                through: models.WorkspaceMember,
                as: 'Workspaces',
            })
        }
    }
    User.init(
        {
            //DataTypes -> STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
            email: {
                type: DataTypes.STRING(50),
                allowNull: false, // 필수
                unique: true, // 고유한 값
            },
            nickname: {
                type: DataTypes.STRING(50),
                allowNull: false, // 필수
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false, // 필수
            },
            security: {
                type: DataTypes.INTEGER(30),
                allowNull: false, // 필수
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci', // 한글 저장
        },
    )
    return User
}
