const userService = require('../services/userService');

exports.getUsers = (req, res) => {
    const users = userService.getAll();
    res.status(200).json(users);
};

exports.createUser = (req, res) => {
    try {
        const user = userService.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateUser = (req, res) => {
    try {
        const user = userService.update(req.params.id, req.body);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.deleteUser = (req, res) => {
    try {
        userService.remove(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
