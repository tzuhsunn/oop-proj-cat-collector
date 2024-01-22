const createConnection = require('../utils/db');

const addCat = async (catData, mainImageOriginalName) => {
    try {
        const conn = await createConnection();
        const product_id = productData.id;
        // Get category id
        const query = 'SELECT id FROM users WHERE name = ?';
        let userId = '';
        const [rows] = await conn.query(query, [catData.userEmail]);
        
        // insert data to database
        const inserQuery = 'INSERT INTO collectItem (user_id, breed_id, image_url) VALUES (?, ?, ?);';
        const values = [rows[0].id, catData.breedId, mainImageOriginalName];
        const [cat] = await conn.query(inserQuery, values);
        
        conn.end();
        return cat[0].id;
    } catch (err) {
        throw err;
    } 
};

const listAllCats = async () => {
    try {
        const query = `
        SELECT
            c.id,
            c.name_zh,
            c.name_en,
            c.image_url,
            c.description
        FROM breeds AS c
        `;
        const conn = await createConnection();
        const [rows] = await conn.query(query);
        conn.end();
        return rows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addCat,
    listAllCats,
};