// Mock data store
let users = [
    {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        comments: "Test user 1"
    },
    {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@example.com",
        phone: "0987654321",
        comments: "Test user 2"
    }
];

let currentId = 2;

// Mock data service methods
module.exports = {
    getAllUsers: () => {
        return Promise.resolve([...users]);
    },

    findUsers: (searchTerm) => {
        const results = users.filter(user => 
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return Promise.resolve(results);
    },

    getUserById: (id) => {
        const user = users.find(u => u.id === parseInt(id));
        return Promise.resolve(user ? [user] : []);
    },

    createUser: (userData) => {
        currentId++;
        const newUser = {
            id: currentId,
            ...userData
        };
        users.push(newUser);
        return Promise.resolve({ insertId: currentId });
    },

    updateUser: (id, userData) => {
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
            users[index] = {
                ...users[index],
                ...userData
            };
            return Promise.resolve({ affectedRows: 1 });
        }
        return Promise.resolve({ affectedRows: 0 });
    },

    deleteUser: (id) => {
        const initialLength = users.length;
        users = users.filter(u => u.id !== parseInt(id));
        return Promise.resolve({ affectedRows: initialLength - users.length });
    }
}; 