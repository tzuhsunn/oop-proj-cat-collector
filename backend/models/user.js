const createConnection = require('../utils/db');

const roleSearch = async (role) => {
    try {
        const conn = await createConnection();
        console.log('Connection successful');

        const roleQuery = 'SELECT id FROM roles WHERE role_name = ?;';
        const [roleRows] = await conn.query(roleQuery, [role]);

        if (roleRows.length === 0) {
            const err = `Role '${user.role}' does not exist.`
            conn.end();
            throw err;
        }

        conn.end();
        console.log(roleRows);
        return roleRows[0].id;
    } catch (err) {
        throw err;
    } 
}

const userSignUp = async (user) => {
    try {
        const conn = await createConnection();
        console.log('Connection successful');

        const roleQuery = 'SELECT id FROM roles WHERE role_name = ?;';
        const [roleRows] = await conn.query(roleQuery, [user.role]);
        const role_id = roleRows[0].id;

        const query = 'INSERT INTO users (name, email, password, provider, picture, role_id) VALUES (?, ?, ?, ?, ?, ?);';
        const values = [user.name, user.email, user.password, user.provider, user.picture, role_id];
        const [rows] = await conn.query(query, values);
        conn.end();
        return rows;
    } catch (err) {
        throw err;
    } 
}

const userSignIn = async (email) => {
    try {
        const conn = await createConnection();

        const query = 'SELECT * FROM users WHERE email = ?;';
        const values = [email];
        const [rows] = await conn.query(query, values);

        const roleQuery = 'SELECT role_name FROM roles WHERE id = ?;';
        const [roleRows] = await conn.query(roleQuery, rows[0].role_id);
        rows[0].role = roleRows[0].role_name

        conn.end();
        console.log(rows[0]);
        return rows[0];
    } catch (err) {
        throw err;
    }
}

const userProfile = async (email) => {

}

module.exports = {
    userSignUp,
    userSignIn,
    userProfile,
};