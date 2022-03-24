'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Workspace extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Workspace.belongsTo(models.User, {
                as: 'Owner',
                foreignKey: 'OwnerId',
            })
            models.Workspace.belongsToMany(models.User, {
                through: models.WorkspaceMember,
                as: 'Members',
            })
        }
    }
    Workspace.init(
        {
            //DataTypes -> STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
            name: {
                type: DataTypes.STRING(50),
                allowNull: false, // 필수
                unique: true, // 고유한 값
            },
            url: {
                type: DataTypes.STRING(50),
                allowNull: false, // 필수
                unique: true, // 고유한 값
            },
        },
        {
            sequelize,
            modelName: 'Workspace',
            tableName: 'workspaces',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci', // 한글 저장
        },
    )
    return Workspace
}
