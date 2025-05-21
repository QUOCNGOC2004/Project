-- Tạo database
CREATE DATABASE webkhambenh;

-- Kết nối vào database
\c webkhambenh;

-- Tạo bảng users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng doctors 
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    co_so_kham VARCHAR(255),          
    chuyen_khoa VARCHAR(255),         
    mo_ta_chuc_vu VARCHAR(255),       
    hoc_vi VARCHAR(255),              
    kinh_nghiem INT,                 
    link_anh VARCHAR(255),
    chuc_vu VARCHAR(255)            
);

-- Đổ dữ liệu vào bảng doctors
INSERT INTO doctors (name, email, phone, co_so_kham, chuyen_khoa, mo_ta_chuc_vu, hoc_vi, kinh_nghiem, link_anh, chuc_vu) VALUES
('PGS.TS. BS Nguyễn Thanh Hồi', 'nguyenthanhh@example.com', '0901234567', 'Bệnh viện Đại học Phenikaa', 'Tim mạch', 'Tổng Giám đốc Bệnh viện', 'Tiến sĩ', 20, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/d09837dc-0ab8-400e-b486-fe7027180151-image.webp', 'Tổng giám đốc'),
('GS.TS. BS. Đỗ Quyết', 'doquyet@example.com', '0987654321', 'Phòng khám Đa khoa Đại học Phenikaa', 'Nội tổng hợp', 'Phó Tổng Giám Đốc Bệnh Viện', 'Tiến sĩ', 25, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/15362c14-c585-472a-9999-aacdd5919507-image.webp', 'Phó tổng giám đốc'),
('PGS.TS. BSNT Vũ Hồng Thăng', 'vuhongthang@example.com', '0912345678', 'Bệnh viện Đại học Phenikaa', 'Ngoại tổng hợp', 'Phó Tổng Giám Đốc Bệnh Viện', 'Tiến sĩ', 15, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/b17b466f-9ff2-4569-929f-cee64024d7d3-image.webp', 'Phó tổng giám đốc'),
('TS. BS Nguyễn Văn A', 'nguyenvana@example.com', '0923456789', 'Bệnh viện Đại học Phenikaa', 'Tim mạch', 'Trưởng khoa Tim mạch', 'Tiến sĩ', 15, '/placeholder.svg', 'Trưởng Khoa'),
('ThS. BS Trần Thị B', 'tranthib@example.com', '0934567890', 'Phòng khám Đa khoa Đại học Phenikaa', 'Nội tổng hợp', 'Phó khoa Nội tổng hợp', 'Thạc sĩ', 10, '/placeholder.svg', 'Phó Trưởng Khoa'),
('BS. Nguyễn Văn C', 'nguyenvanc@example.com', '0945678901', 'Sinh viên tòa A8', 'Ngoại tổng hợp', 'Bác sĩ điều trị', 'Bác sĩ', 8, '/placeholder.svg', 'Bác sĩ điều trị'),
('BS. Nguyễn Văn D', 'nguyenvanD@example.com', '0945678901', 'Sinh viên tòa A8', 'Ngoại tổng hợp', 'Bác sĩ điều trị', 'Bác sĩ', 8, '/placeholder.svg', 'Bác sĩ điều trị');