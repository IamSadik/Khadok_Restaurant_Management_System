const db = require('../config/configdb');

// Add table to DB (or update if exists)
exports.addTableToDB = (stakeholderId, tableType, availability, callback) => {
    // Check if the table entry already exists for the specific stakeholder_id and table_type
    const checkQuery = `
        SELECT * FROM interior WHERE stakeholder_id = ? AND table_type = ?
    `;
    
    db.query(checkQuery, [stakeholderId, tableType], (err, results) => {
        if (err) {
            console.error('Error checking table existence:', err);
            return callback(err);
        }

        if (results.length > 0) {
            // If entry exists, update the availability and bookable by adding the new availability
            const existingAvailability = results[0].availability;
            const updatedAvailability = existingAvailability + parseInt(availability);

            const updateQuery = `
                UPDATE interior
                SET availability = ?, bookable = ?
                WHERE stakeholder_id = ? AND table_type = ?
            `;

            db.query(updateQuery, [updatedAvailability, updatedAvailability, stakeholderId, tableType], callback);
        } else {
            // If entry does not exist, insert a new record with availability and bookable set to the same value
            const insertQuery = `
                INSERT INTO interior (stakeholder_id, table_type, availability, bookable)
                VALUES (?, ?, ?, ?)
            `;
            db.query(insertQuery, [stakeholderId, tableType, availability, availability], callback);
        }
    });
};


// Check if an image already exists for a stakeholder
exports.checkExistingImage = (stakeholderId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT pic FROM interior_pic
            WHERE stakeholder_id = ?
            LIMIT 1
        `;
        db.query(query, [stakeholderId], (err, results) => {
            if (err) {
                console.error("Error checking existing image in DB:", err);
                return reject(err);
            }

            // If an image exists, resolve with the result; otherwise, resolve with null
            resolve(results.length > 0 ? results[0].pic : null);
        });
    });
};

// Upload image to DB
exports.uploadImageToDB = (stakeholderId, filePath, callback) => {
    const query = `
        INSERT INTO interior_pic (stakeholder_id, pic)
        VALUES (?, ?)
    `;
    db.query(query, [stakeholderId, filePath], (err, results) => {
        if (err) {
            console.error("Error uploading image to DB:", err);
            return callback(err);
        }
        callback(null, results);
    });
};
// Delete image from DB
exports.deleteImageFromDB = (stakeholderId) => {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM interior_pic
            WHERE stakeholder_id = ?
        `;
        db.query(query, [stakeholderId], (err, results) => {
            if (err) {
                console.error("Error deleting image from DB:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};


// Get image from DB
exports.getImageFromDB = (stakeholderId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT pic FROM interior_pic
            WHERE stakeholder_id = ?
            LIMIT 1
        `;
        db.query(query, [stakeholderId], (err, results) => {
            if (err) {
                console.error('Error retrieving image from DB:', err);
                return reject(err);
            }

            if (results.length > 0) {
                resolve(results[0]?.pic); // Return the image file name
            } else {
                resolve(null); // No image found
            }
        });
    });
};


// Remove table from DB (update both availability and bookable)
exports.removeTableFromDB = (stakeholderId, tableType, tableCount, callback) => {
    const query = `
        UPDATE interior
        SET availability = availability - ?, 
            bookable = bookable - ?
        WHERE stakeholder_id = ? 
          AND table_type = ? 
          AND availability >= ? 
          AND bookable >= ?
    `;

    db.query(query, [tableCount, tableCount, stakeholderId, tableType, tableCount, tableCount], (err, results) => {
        if (err) {
            console.error('Error removing tables from DB:', err);
            return callback(err);
        }
        callback(null, results);
    });
};

// Fetch table data by stakeholder ID (including availability status for each table type)
exports.fetchTableInfoFromDB = (stakeholderId, callback) => {
    const query = `
        SELECT table_type, availability
        FROM interior
        WHERE stakeholder_id = ?
    `;

    db.query(query, [stakeholderId], (err, results) => {
        if (err) {
            console.error('Error fetching table data from DB:', err);
            return callback(err);
        }

        if (!results.length) {
            console.log('No table data found for stakeholder:', stakeholderId);
            return callback(null, {}); // Return an empty object if no data
        }

        // Initialize the tableData object with default availability values (0 or 1)
        const tableData = {
            '2': 0,
            '4': 0,
            '8': 0,
            '16': 0,
            '5': 0
        };

        // Map results to tableData, setting the availability for each table type
        results.forEach(row => {
            if (tableData.hasOwnProperty(row.table_type)) {
                tableData[row.table_type] = row.availability;
            }
        });

        
        callback(null, tableData); // Return the data with availability
    });
};


// Fetch table data by stakeholder ID (or restaurant ID for consumers)
exports.fetchTableInfoFromDB = (restaurantId, callback) => {
    const query = `
        SELECT table_type, availability
        FROM interior
        WHERE stakeholder_id = ?
    `;

    db.query(query, [restaurantId], (err, results) => {
        if (err) {
            console.error('Error fetching table data from DB:', err);
            return callback(err);
        }

        if (!results.length) {
            console.log('No table data found for restaurant:', restaurantId);
            return callback(null, {}); // Return an empty object if no data
        }

        // Initialize the tableData object with default availability values (0 or 1)
        const tableData = {
            '2': 0,
            '4': 0,
            '8': 0,
            '16': 0,
            '5': 0
        };

        // Map results to tableData, setting the availability for each table type
        results.forEach(row => {
            if (tableData.hasOwnProperty(row.table_type)) {
                tableData[row.table_type] = row.availability;
            }
        });

        callback(null, tableData); // Return the data with availability
    });
};



// Get image from DB
exports.getImageFromDB = (restaurantId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT pic FROM interior_pic
            WHERE stakeholder_id = ?
            LIMIT 1
        `;
        db.query(query, [restaurantId], (err, results) => {
            if (err) {
                console.error('Error retrieving image from DB:', err);
                return reject(err);
            }

            if (results.length > 0) {
                resolve(results[0]?.pic); // Return the image file name
            } else {
                resolve(null); // No image found
            }
        });
    });
};


// Fetch bookable table data by stakeholder ID (restaurant ID)
exports.fetchConsumerBookableTableInfoFromDB = (restaurantId, callback) => {
    const query = `
        SELECT table_type, bookable
        FROM interior
        WHERE stakeholder_id = ?
    `;

    db.query(query, [restaurantId], (err, results) => {
        if (err) {
            console.error('Error fetching bookable table data from DB:', err);
            return callback(err);
        }

        if (!results.length) {
            console.log('No bookable data found for restaurant:', restaurantId);
            return callback(null, {}); // Return an empty object if no data
        }

        // Initialize bookable data object with default values
        const bookableData = {
            '2': 0,
            '4': 0,
            '8': 0,
            '16': 0,
            '5': 0
        };

        // Map results to bookableData, setting the bookable count for each table type
        results.forEach(row => {
            if (bookableData.hasOwnProperty(row.table_type)) {
                bookableData[row.table_type] = row.bookable;
            }
        });

        callback(null, bookableData); // Return the bookable data
    });
};


// Fetch table bookable data by stakeholder ID (or restaurant ID for consumers)
exports.fetchBookableInfoFromDB = (restaurantId, callback) => {
    const query = `
        SELECT table_type, bookable
        FROM interior
        WHERE stakeholder_id = ?
    `;

    db.query(query, [restaurantId], (err, results) => {
        if (err) {
            console.error('Error fetching bookable data from DB:', err);
            return callback(err);
        }

        if (!results.length) {
            console.log('No bookable data found for restaurant:', restaurantId);
            return callback(null, {}); // Return an empty object if no data
        }

        // Initialize the tableData object with default bookable values (0 or 1)
        const tableData = {
            '2': 0,
            '4': 0,
            '8': 0,
            '16': 0,
            '5': 0
        };

        // Map results to tableData, setting the bookable value for each table type
        results.forEach(row => {
            if (tableData.hasOwnProperty(row.table_type)) {
                tableData[row.table_type] = row.bookable;
            }
        });

        callback(null, tableData); // Return the data with bookable values
    });
};
