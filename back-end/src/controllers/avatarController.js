const avatarService = require('../services/avatarService');

exports.saveAvatar = async (req, res) => {

    try {

        const userId = req.params.id;
        const aparencia = req.body.config;

        const avatar = await avatarService
            .createOrUpdateAvatar(
                userId,
                aparencia
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

        res.json(avatar || null);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};