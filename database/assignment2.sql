-- Assignment 2 - SQL Practice

-- 1. Insertar un nuevo registro en classification
INSERT INTO classification (classification_name)
VALUES ('Electric');

-- 2. Insertar un nuevo vehículo en inventory
INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
VALUES ('DeLorean', 'DMC-12', 1982, 'Futuristic car with gull-wing doors.', 
        '/images/delorean.jpg', '/images/delorean-thumb.jpg', 
        35000.00, 12000, 'Silver', 1);

-- 3. Seleccionar un vehículo específico por su ID (primary key)
SELECT * FROM inventory
WHERE inv_id = 1;  

-- 4. Actualizar un registro específico usando la PK
UPDATE inventory
SET price = 36000.00
WHERE inv_id = 1;

-- 5. Eliminar un registro específico usando la PK
DELETE FROM inventory
WHERE inv_id = 1;

UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');