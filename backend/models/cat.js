const createConnection = require('../utils/db');

const addProduct = async (productData, colorsArray, variantsArray, mainImageOriginalName, imagesOriginalNames) => {
    try {
        const conn = await createConnection();
        const product_id = productData.id;
        // Get category id
        const query = 'SELECT id FROM categories WHERE category_name = ?';
        let categoryId = '';
        const [rows] = await conn.query(query, [productData.category]);
        
        if (rows.length === 0) {
            const insertQuery = 'INSERT INTO categories (category_name) VALUES (?)';
            const [insertResults] = await conn.query(insertQuery, [productData.category]);
            categoryId = insertResults.insertId;
        }
        categoryId = rows[0].id;

        // insert product
        const productInsertQuery = 'INSERT INTO products (id, title, description, price, texture, wash, place, note, story, main_image, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const productValues = [productData.id, productData.title, productData.description, productData.price, productData.texture, productData.wash, productData.place, productData.note, productData.story, mainImageOriginalName, categoryId];
        const productInsertResults = await conn.query(productInsertQuery, productValues);

        // // insert colors
        if (colorsArray && colorsArray.length > 0) {
            for (const color of colorsArray) {
                const selectQuery = 'SELECT * FROM colors WHERE code = ?';
                const [selectResults] = await conn.query(selectQuery, [color.code]);
                if (selectResults.length === 0) {
                    const colorInsertQuery = 'INSERT INTO colors (name, code) VALUES (?, ?)';
                    await conn.query(colorInsertQuery, [color.name, color.code]);
                }
            }
        }

        // insert variants
        if (variantsArray && variantsArray.length > 0) {
            for (const variant of variantsArray) {
                const variantInsertQuery = 'INSERT INTO variants (product_id, color_code, size, stock) VALUES (?, ?, ?, ?)';
                await conn.query(variantInsertQuery, [product_id, variant.color_code, variant.size, variant.stock]);
            }
        }

        // insert images
        if (imagesOriginalNames && imagesOriginalNames.length > 0) {
            for (const image of imagesOriginalNames) {
                const imageInsertQuery = 'INSERT INTO images (product_id, image_path) VALUES (?, ?)';
                await conn.query(imageInsertQuery, [product_id, image]);
            }
        }
        
        conn.end();
        return product_id;
    } catch (err) {
        throw err;
    } 
};

const getProductsList = async (category, isAllCategory, page, PAGE_SIZE) => {
    const query = `
        SELECT
            p.id,
            c.category_name AS category,
            p.title,
            p.description,
            p.price,
            p.texture,
            p.wash,
            p.place,
            p.note,
            p.story,
            p.main_image
        FROM products AS p
        JOIN categories AS c ON p.category_id = c.id
        ${isAllCategory ? '' : 'WHERE c.category_name = ?'} 
        LIMIT ?, ?;
    `;
    const offset = page * PAGE_SIZE;  
    const queryParams = isAllCategory ? [offset, PAGE_SIZE+1] : [category, offset, PAGE_SIZE+1];

    try {
        return new Promise((resolve, reject) => {
            connection.query(query, queryParams, (err, results) => {
                if (err) {
                    reject(err);
                }
        
                const products = results.map((product) => {
                    return {
                        id: product.id,
                        category: product.category,
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        texture: product.texture,
                        wash: product.wash,
                        place: product.place,
                        note: product.note,
                        story: product.story,
                        colors: [], 
                        sizes: [],
                        variants: [],
                        main_image: product.main_image,
                        images: [],
                    };
                });
        
                const productIds = products.map((product) => product.id);
                const colorsQuery = `SELECT v.product_id, c.code AS color_code, c.name AS color_name FROM variants AS v LEFT JOIN colors AS c ON v.color_code = c.code WHERE v.product_id IN (${productIds.join(', ')})`;
                const variantsQuery = `SELECT * FROM variants AS v WHERE v.product_id IN (${productIds.join(', ')})`;
                const imagesQuery = `SELECT i.product_id, i.image_path FROM images AS i WHERE i.product_id IN (${productIds.join(', ')})`;
        
                connection.query(colorsQuery, (err, colorResults) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
        
                    products.forEach((product) => {
                        const resColors = [];
                        const productColors = colorResults.filter((color) => color.product_id === product.id);
                        productColors.forEach(color => {
                            if (!resColors.some(c => c.code === color.color_code)) {
                                resColors.push({
                                code: color.color_code, 
                                name: color.color_name
                              });
                            }
                          });
                        product.colors = resColors;
                    });
        
                    connection.query(variantsQuery, (err, variantsResults) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
        
                        const sizeArray = [];
                        products.forEach((product) => {
                            const productVariants = variantsResults
                                .filter((variant) => variant.product_id === product.id)
                                .map((variant) => ({
                                    color_code: variant.color_code,
                                    size: variant.size,
                                    stock: variant.stock
                                }));
                            product.variants = productVariants;
        
                            productVariants.forEach((sizeInfo) => {
                                const existingSize = sizeArray.find((s) => s === sizeInfo.size);
                                if (!existingSize) {
                                    sizeArray.push(sizeInfo.size);
                                }
                            });
                            product.sizes = sizeArray;
                        });
        
                        connection.query(imagesQuery, (err, imageResults) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            products.forEach((product) => {
                                const productImages = imageResults.filter((image) => image.product_id === product.id);
                                product.images = productImages.map((image) => image.image_path);
                            });
                            
                            const slicedProducts = products.slice(0, PAGE_SIZE);
                            const response = { data: slicedProducts };
        
                            if (results.length > PAGE_SIZE) {
                                response.next_paging = page + 1;
                            }
                    
                            resolve(response);
                        });
                    });
                });
            });
        });

    } catch (error) {
        throw error;
    }
};

const getProductDetail = async (detailID) => {
    try {
        const query = `
        SELECT
            p.id,
            cat.category_name AS category,
            p.title,
            p.description,
            p.price,
            p.texture,
            p.wash,
            p.place,
            p.note,
            p.story,
            p.main_image,
            c.code AS color_code,
            c.name AS color_name,
            v.size,
            v.stock,
            i.image_path
        FROM products AS p
        JOIN categories AS cat ON p.category_id = cat.id
        LEFT JOIN variants AS v ON p.id = v.product_id
        LEFT JOIN colors AS c ON v.color_code = c.code
        LEFT JOIN images AS i ON p.id = i.product_id
        WHERE p.id = ?
        `;
        const conn = await createConnection();
        console.log('Connection successful');
        const [rows] = await conn.query(query, [detailID]);
        const formattedData = formatData(rows);

        return formattedData;

    } catch (error) {
        throw error;
    }
};

const searchProduct = async (keyword) => {
    try {
        const query = `
        SELECT
            p.id,
            cat.category_name AS category,
            p.title,
            p.description,
            p.price,
            p.texture,
            p.wash,
            p.place,
            p.note,
            p.story,
            p.main_image,
            c.code AS color_code,
            c.name AS color_name,
            v.size,
            v.stock,
            i.image_path
        FROM products AS p
        JOIN categories AS cat ON p.category_id = cat.id
        LEFT JOIN variants AS v ON p.id = v.product_id
        LEFT JOIN colors AS c ON v.color_code = c.code
        LEFT JOIN images AS i ON p.id = i.product_id
        WHERE p.title LIKE ?
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [`%${keyword}%`], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    const formattedData = formatData(results);
                    resolve(formattedData);
                }
            });
        });

    } catch (error) {
        throw error;
    }
};

module.exports = {
    getProductsList,
    getProductDetail,
    searchProduct,
    addProduct
};

function formatData(rawData) {
    const formattedData = [];
    const idToIndexMap = {};
  
    rawData.forEach((item) => {
      if (!idToIndexMap[item.id]) {
        const formattedItem = {
          id: item.id,
          category: item.category,
          title: item.title,
          description: item.description,
          price: item.price,
          texture: item.texture,
          wash: item.wash,
          place: item.place,
          note: item.note,
          story: item.story,
          colors: [],
          sizes: [],
          variants: [],
          main_image: `${process.env.IP}/uploads/${item.main_image}`,
          images: [],
        };
  
        formattedData.push(formattedItem);
        idToIndexMap[item.id] = formattedData.length;
      }
  
      const currentItem = formattedData[idToIndexMap[item.id]-1];
  
      // Colors
      const colorIndex = currentItem.colors.findIndex((color) => color.code === item.color_code);
      if (colorIndex === -1) {
        currentItem.colors.push({
          code: item.color_code,
          name: item.color_name,
        });
      }
  
      // Sizes
      if (!currentItem.sizes.includes(item.size)) {
        currentItem.sizes.push(item.size);
      }
  
      // Variants
      const varientIndex = currentItem.variants.findIndex((v) => v.color_code === item.color_code && v.size === item.size);
      if (varientIndex === -1) {
        currentItem.variants.push({
            color_code: item.color_code,
            size: item.size,
            stock: item.stock,
          });
      }
      // Images
      if (!currentItem.images.includes(`${process.env.IP}/uploads/${item.image_path}`)) {
        currentItem.images.push(`${process.env.IP}/uploads/${item.image_path}`);
      }
    });
  
    return formattedData;
}