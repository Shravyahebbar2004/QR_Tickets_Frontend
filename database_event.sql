-- =========================================================
-- EVENT MANAGEMENT SYSTEM DATABASE
-- PostgreSQL Full SQL Setup
-- =========================================================

-- =========================================================
-- STEP 1 : CREATE DATABASE
-- =========================================================

CREATE DATABASE event_management;

-- Connect to database manually after creation
-- \c event_management;



-- =========================================================
-- STEP 2 : REQUIRED EXTENSIONS
-- =========================================================

-- Needed for UUID generation

CREATE EXTENSION IF NOT EXISTS pgcrypto;



-- =========================================================
-- STEP 3 : EVENTS TABLE
-- =========================================================

CREATE TABLE events (

    event_id SERIAL PRIMARY KEY,

    event_name VARCHAR(255) NOT NULL,

    event_description TEXT,

    event_date DATE NOT NULL,

    event_time TIME NOT NULL,

    venue VARCHAR(255) NOT NULL,

    organizer_name VARCHAR(255),

    organizer_email VARCHAR(255),

    max_participants INT,

    registration_deadline DATE,

    event_status VARCHAR(50) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =========================================================
-- STEP 4 : REGISTRATIONS TABLE
-- =========================================================

CREATE TABLE registrations (

    registration_id SERIAL PRIMARY KEY,

    full_name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    phone_number VARCHAR(20) UNIQUE NOT NULL,

    gender VARCHAR(20),

    college_name VARCHAR(255),

    department VARCHAR(255),

    year_of_study VARCHAR(50),

    city VARCHAR(100),

    state VARCHAR(100),

    emergency_contact VARCHAR(20),

    event_id INT NOT NULL,

    registration_status VARCHAR(50) DEFAULT 'CONFIRMED',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event
    FOREIGN KEY (event_id)
    REFERENCES events(event_id)
    ON DELETE CASCADE
);



-- =========================================================
-- STEP 5 : QR PASSES TABLE
-- =========================================================

CREATE TABLE qr_passes (

    pass_id SERIAL PRIMARY KEY,

    registration_id INT UNIQUE NOT NULL,

    qr_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),

    qr_image_url TEXT,

    pass_type VARCHAR(50) DEFAULT 'GENERAL',

    is_checked_in BOOLEAN DEFAULT FALSE,

    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    checked_in_at TIMESTAMP,

    valid_from TIMESTAMP,

    valid_until TIMESTAMP,

    CONSTRAINT fk_registration
    FOREIGN KEY (registration_id)
    REFERENCES registrations(registration_id)
    ON DELETE CASCADE
);



-- =========================================================
-- STEP 6 : SCAN LOGS TABLE
-- =========================================================

CREATE TABLE scan_logs (

    scan_id SERIAL PRIMARY KEY,

    pass_id INT NOT NULL,

    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    scan_status VARCHAR(50) NOT NULL,

    scanner_device VARCHAR(255),

    scanner_operator VARCHAR(255),

    entrance_gate VARCHAR(100),

    remarks TEXT,

    CONSTRAINT fk_pass
    FOREIGN KEY (pass_id)
    REFERENCES qr_passes(pass_id)
    ON DELETE CASCADE
);



-- =========================================================
-- STEP 7 : ADMINS TABLE
-- =========================================================

CREATE TABLE admins (

    admin_id SERIAL PRIMARY KEY,

    admin_name VARCHAR(255) NOT NULL,

    admin_email VARCHAR(255) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    role VARCHAR(50) DEFAULT 'SCANNER',

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- =========================================================
-- STEP 8 : INDEXES FOR PERFORMANCE
-- =========================================================

CREATE INDEX idx_registration_email
ON registrations(email);

CREATE INDEX idx_registration_phone
ON registrations(phone_number);

CREATE INDEX idx_qr_token
ON qr_passes(qr_token);

CREATE INDEX idx_checkin_status
ON qr_passes(is_checked_in);

CREATE INDEX idx_scan_time
ON scan_logs(scanned_at);



-- =========================================================
-- STEP 9 : SAMPLE EVENT DATA
-- =========================================================

INSERT INTO events (

    event_name,
    event_description,
    event_date,
    event_time,
    venue,
    organizer_name,
    organizer_email,
    max_participants,
    registration_deadline

)

VALUES (

    'Tech Fest 2026',
    'Annual Technology and Innovation Festival',
    '2026-06-15',
    '10:00:00',
    'Main Auditorium',
    'Tech Club',
    'techclub@gmail.com',
    1000,
    '2026-06-10'

);



-- =========================================================
-- STEP 10 : SAMPLE ADMIN DATA
-- =========================================================

INSERT INTO admins (

    admin_name,
    admin_email,
    password_hash,
    role

)

VALUES (

    'Main Admin',
    'admin@gmail.com',
    'hashed_password_here',
    'SUPER_ADMIN'

);



-- =========================================================
-- STEP 11 : REGISTER A USER
-- =========================================================

INSERT INTO registrations (

    full_name,
    email,
    phone_number,
    gender,
    college_name,
    department,
    year_of_study,
    city,
    state,
    emergency_contact,
    event_id

)

VALUES (

    'Rahul Sharma',
    'rahul@gmail.com',
    '9876543210',
    'Male',
    'ABC Engineering College',
    'Computer Science',
    '3rd Year',
    'Bangalore',
    'Karnataka',
    '9123456780',
    1

);



-- =========================================================
-- STEP 12 : GENERATE QR PASS
-- =========================================================

INSERT INTO qr_passes (

    registration_id,
    pass_type,
    valid_from,
    valid_until

)

VALUES (

    1,
    'GENERAL',
    '2026-06-15 08:00:00',
    '2026-06-15 18:00:00'

);



-- =========================================================
-- STEP 13 : VIEW GENERATED QR TOKEN
-- =========================================================

SELECT
    pass_id,
    qr_token
FROM qr_passes
WHERE registration_id = 1;



-- =========================================================
-- STEP 14 : VERIFY QR CODE
-- =========================================================

-- Replace UUID with actual scanned token

SELECT

    qp.pass_id,
    qp.qr_token,
    qp.is_checked_in,
    qp.pass_type,
    r.full_name,
    r.email,
    r.phone_number,
    e.event_name,
    e.venue

FROM qr_passes qp

JOIN registrations r
ON qp.registration_id = r.registration_id

JOIN events e
ON r.event_id = e.event_id

WHERE qp.qr_token =
'550e8400-e29b-41d4-a716-446655440000';



-- =========================================================
-- STEP 15 : CHECK IF PASS ALREADY USED
-- =========================================================

SELECT

    is_checked_in

FROM qr_passes

WHERE qr_token =
'550e8400-e29b-41d4-a716-446655440000';



-- =========================================================
-- STEP 16 : MARK USER AS CHECKED IN
-- =========================================================

UPDATE qr_passes

SET

    is_checked_in = TRUE,
    checked_in_at = CURRENT_TIMESTAMP

WHERE qr_token =
'550e8400-e29b-41d4-a716-446655440000';



-- =========================================================
-- STEP 17 : INSERT SCAN LOG
-- =========================================================

INSERT INTO scan_logs (

    pass_id,
    scan_status,
    scanner_device,
    scanner_operator,
    entrance_gate,
    remarks

)

VALUES (

    1,
    'SUCCESS',
    'Samsung Tablet',
    'Volunteer 1',
    'Gate A',
    'Entry allowed'

);



-- =========================================================
-- STEP 18 : INSERT FAILED SCAN LOG
-- =========================================================

INSERT INTO scan_logs (

    pass_id,
    scan_status,
    scanner_device,
    scanner_operator,
    entrance_gate,
    remarks

)

VALUES (

    1,
    'DUPLICATE',
    'Samsung Tablet',
    'Volunteer 1',
    'Gate A',
    'Pass already used'

);



-- =========================================================
-- STEP 19 : VIEW ALL REGISTRATIONS
-- =========================================================

SELECT

    r.registration_id,
    r.full_name,
    r.email,
    r.phone_number,
    r.college_name,
    e.event_name,
    r.registration_status,
    r.created_at

FROM registrations r

JOIN events e
ON r.event_id = e.event_id

ORDER BY r.created_at DESC;



-- =========================================================
-- STEP 20 : VIEW ALL PASSES
-- =========================================================

SELECT

    qp.pass_id,
    qp.qr_token,
    qp.pass_type,
    qp.is_checked_in,
    qp.generated_at,
    qp.checked_in_at,
    r.full_name,
    r.email

FROM qr_passes qp

JOIN registrations r
ON qp.registration_id = r.registration_id

ORDER BY qp.generated_at DESC;



-- =========================================================
-- STEP 21 : VIEW CHECKED IN USERS
-- =========================================================

SELECT

    r.full_name,
    r.email,
    qp.checked_in_at

FROM qr_passes qp

JOIN registrations r
ON qp.registration_id = r.registration_id

WHERE qp.is_checked_in = TRUE

ORDER BY qp.checked_in_at DESC;



-- =========================================================
-- STEP 22 : VIEW USERS NOT CHECKED IN
-- =========================================================

SELECT

    r.full_name,
    r.email

FROM qr_passes qp

JOIN registrations r
ON qp.registration_id = r.registration_id

WHERE qp.is_checked_in = FALSE;



-- =========================================================
-- STEP 23 : TOTAL REGISTRATIONS
-- =========================================================

SELECT COUNT(*) AS total_registrations
FROM registrations;



-- =========================================================
-- STEP 24 : TOTAL CHECKED IN
-- =========================================================

SELECT COUNT(*) AS total_checked_in
FROM qr_passes
WHERE is_checked_in = TRUE;



-- =========================================================
-- STEP 25 : TOTAL NOT CHECKED IN
-- =========================================================

SELECT COUNT(*) AS total_not_checked_in
FROM qr_passes
WHERE is_checked_in = FALSE;



-- =========================================================
-- STEP 26 : EVENT-WISE REGISTRATION COUNT
-- =========================================================

SELECT

    e.event_name,
    COUNT(r.registration_id) AS total_participants

FROM events e

LEFT JOIN registrations r
ON e.event_id = r.event_id

GROUP BY e.event_name;



-- =========================================================
-- STEP 27 : FULL SCAN HISTORY
-- =========================================================

SELECT

    sl.scan_id,
    r.full_name,
    sl.scan_status,
    sl.scanned_at,
    sl.scanner_device,
    sl.scanner_operator,
    sl.entrance_gate,
    sl.remarks

FROM scan_logs sl

JOIN qr_passes qp
ON sl.pass_id = qp.pass_id

JOIN registrations r
ON qp.registration_id = r.registration_id

ORDER BY sl.scanned_at DESC;



-- =========================================================
-- STEP 28 : DELETE A REGISTRATION
-- =========================================================

DELETE FROM registrations
WHERE registration_id = 1;



-- =========================================================
-- STEP 29 : UPDATE USER DETAILS
-- =========================================================

UPDATE registrations

SET

    phone_number = '9999999999',
    city = 'Mysore',
    updated_at = CURRENT_TIMESTAMP

WHERE registration_id = 1;



-- =========================================================
-- STEP 30 : CREATE VIEW FOR DASHBOARD
-- =========================================================

CREATE VIEW dashboard_summary AS

SELECT

    (SELECT COUNT(*) FROM registrations)
    AS total_registrations,

    (SELECT COUNT(*) FROM qr_passes
     WHERE is_checked_in = TRUE)
    AS total_checked_in,

    (SELECT COUNT(*) FROM qr_passes
     WHERE is_checked_in = FALSE)
    AS total_pending;



-- =========================================================
-- STEP 31 : VIEW DASHBOARD SUMMARY
-- =========================================================

SELECT * FROM dashboard_summary;



-- =========================================================
-- STEP 32 : OPTIONAL TRIGGER TO AUTO UPDATE updated_at
-- =========================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()

RETURNS TRIGGER AS $$

BEGIN

    NEW.updated_at = CURRENT_TIMESTAMP;

    RETURN NEW;

END;

$$ LANGUAGE plpgsql;



CREATE TRIGGER update_registration_updated_at

BEFORE UPDATE
ON registrations

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();



CREATE TRIGGER update_event_updated_at

BEFORE UPDATE
ON events

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();



-- =========================================================
-- DATABASE SETUP COMPLETE
-- =========================================================