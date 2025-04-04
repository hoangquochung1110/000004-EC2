const mockDataService = require('../services/mockDataService');

//view users
exports.view = async (req,res) => {
    try {
        const rows = await mockDataService.getAllUsers();
        let removeUser = req.query.removed;
        res.render('home', { rows, removeUser });
    } catch (err) {
        console.log(err);
        res.render('home', { rows: [] });
    }
}

// find user by search
exports.find = async (req, res) => {
    try {
        let searchTerm = req.body.search;
        const rows = await mockDataService.findUsers(searchTerm);
        res.render('home', { rows });
    } catch (err) {
        console.log(err);
        res.render('home', { rows: [] });
    }
}

exports.form = (req, res) => {
    res.render('add-user');
}

// add new user 
exports.create = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, comments } = req.body;
        await mockDataService.createUser({ first_name, last_name, email, phone, comments });
        res.render('add-user', { alert: 'User added Successfully.' });
    } catch (err) {
        console.log(err);
        res.render('add-user', { alert: 'Error adding user.' });
    }
}

// edit user 
exports.edit = async (req, res) => {    
    try {
        const rows = await mockDataService.getUserById(req.params.id);
        res.render('edit-user', { rows });
    } catch (err) {
        console.log(err);
        res.render('edit-user', { rows: [] });
    }
}

// Update user 
exports.update = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, comments } = req.body;
        await mockDataService.updateUser(req.params.id, { first_name, last_name, email, phone, comments });
        const rows = await mockDataService.getUserById(req.params.id);
        res.render('edit-user', { rows, alert: `${first_name} has been updated` });
    } catch (err) {
        console.log(err);
        res.render('edit-user', { rows: [], alert: 'Error updating user.' });
    }
}

//delete
exports.delete = async (req, res) => {
    try {
        await mockDataService.deleteUser(req.params.id);
        let removeUser = encodeURIComponent('Record successfully removed');
        res.redirect('/?removed=' + removeUser);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
}

//view
exports.viewall = async (req, res) => {
    try {
        const rows = await mockDataService.getUserById(req.params.id);
        res.render('view-user', { rows });
    } catch (err) {
        console.log(err);
        res.render('view-user', { rows: [] });
    }
}