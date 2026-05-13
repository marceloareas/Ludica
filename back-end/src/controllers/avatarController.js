const avatarService = require('../services/avatarService');

exports.saveAvatar = async (req, res) => {

    try {

        const avatar = await avatarService
            .createOrUpdateAvatar(
                req.params.id,
                req.body.aparencia_json
            );

        res.json(avatar);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

exports.getAvatar = async (req, res) => {

    try {

        const avatar = await avatarService
            .getAvatar(req.params.id);

        res.json(avatar);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};