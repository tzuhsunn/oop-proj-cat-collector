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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

const callRecommendCatsAPI = async (pastBreeds) => {
  try {
    const response = await fetch('https://tzuhsun.online/cat/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ past_breeds: pastBreeds }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommendation');
    }

    const data = await response.json();
    console.log(data);
    return data.number;
  } catch (error) {
    throw error;
  }
};

const recommendCats = async () => {
    try {
        const randomNumbers = Array.from({ length: 5 }, () => getRandomInt(0, 36));
        console.log(randomNumbers);
        const recommendedNumber = await callRecommendCatsAPI(randomNumbers);
        console.log(recommendedNumber);
        const result = recommendedNumber + 38;
        const query = `
        SELECT
            c.id,
            c.name_zh,
            c.name_en,
            c.image_url,
            c.description
        FROM breeds AS c WHERE c.id = ${result}
        `;
        const conn = await createConnection();
        const [rows] = await conn.query(query, [result]);
        conn.end();
        return rows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addCat,
    listAllCats,
    recommendCats
};