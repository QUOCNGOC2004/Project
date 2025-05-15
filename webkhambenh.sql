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
    chuc_vu VARCHAR(255),           
    hoc_vi VARCHAR(255),              
    kinh_nghiem TEXT,                 
    link_anh VARCHAR(255)             
);

-- đổ dữ liệu vào bảng doctors
INSERT INTO doctors (name, email, phone, co_so_kham, chuyen_khoa, chuc_vu, hoc_vi, kinh_nghiem, link_anh) VALUES
('Nguyễn Văn A', 'nguyenvana@example.com', '0901234567', 'Bệnh viện Bạch Mai', 'Tim mạch', 'Trưởng khoa', 'Tiến sĩ', '15 năm kinh nghiệm trong lĩnh vực tim mạch, đã thực hiện thành công nhiều ca phẫu thuật phức tạp.', 'https://example.com/images/nguyenvana.jpg'),
('Trần Thị B', 'tranthib@example.com', '0987654321', 'Bệnh viện Nhi Trung Ương', 'Nhi khoa', 'Bác sĩ chính', 'Thạc sĩ', '10 năm kinh nghiệm chăm sóc sức khỏe trẻ em, đặc biệt về các bệnh hô hấp.', 'https://example.com/images/tranthib.jpg');

