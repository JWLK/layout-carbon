'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class WorkspaceMember extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    WorkspaceMember.init(
        {
            // id가 기본적으로 들어있다.
            loggedInAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'WorkspaceMember',
            tableName: 'workspacemembers',
            charset: 'utf8',
            collate: 'utf8_general_ci', // 한글 저장
        },
    )
    return WorkspaceMember
}
