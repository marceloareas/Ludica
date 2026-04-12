const bcrypt = require('bcrypt');

let users = [];
let idCounter = 1;

function validateUser(data) {
    if (!data.name || typeof data.name !== 'string') {
        throw new Error('Name is required and must be a string');
    }

    if (!data.email || typeof data.email !== 'string') {
        throw new Error('Email is required and must be a string');
    }
}

exports.getAll = () => users;

exports.create = (data) => {
    validateUser(data);

    if (!data.password) {
        throw new Error('Password is required');
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);

    const newUser = {
        id: idCounter++,
        name: data.name,
        userName: data.userName,
        email: data.email,
        password: hashedPassword,
        birthDate: data.birthDate,
        createAt: new Date().toISOString()
    };

    users.push(newUser);

    return {
        id: newUser.id,
        name: newUser.name,
        userName: newUser.userName,
        email: newUser.email,
        birthDate: newUser.birthDate,
    };
};

exports.update = (id, data) => {
    const index = users.findIndex(u => u.id == id);

    if (index === -1) {
        throw new Error('User not found');
    }

    validateUser(data);

    let updatedPassword = users[index].password;

    if (data.password) {
        updatedPassword = bcrypt.hashSync(data.password, 10);
    }

    users[index] = {
        id: users[index].id,
        name: data.name,
        userName: data.userName,
        email: data.email,
        password: updatedPassword,
        birthDate: data.birthDate,
    };

    return {
        id: users[index].id,
        name: users[index].name,
        userName: users[index].userName,
        email: users[index].email,
        birthDate: users[index].birthDate
    };
};

exports.remove = (id) => {
    const index = users.findIndex(u => u.id == id);

    if (index === -1) {
        throw new Error('User not found');
    }

    users.splice(index, 1);
};