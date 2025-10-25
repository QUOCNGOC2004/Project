-- Tạo bảng users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    gioi_tinh VARCHAR(10), 
    so_dien_thoai VARCHAR(20), 
    ngay_sinh DATE
);

-- Tạo bảng doctors
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    gioi_tinh VARCHAR(10), 
    mo_ta_bac_si VARCHAR(255), 
    hoc_vi VARCHAR(255),
    kinh_nghiem INT,
    link_anh VARCHAR(1000)
);

-- Tạo bảng appointments
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors(id),
    user_id INTEGER REFERENCES users(id),
    ngay_dat_lich DATE NOT NULL,
    gio_dat_lich TIME NOT NULL,
    ten_benh_nhan VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    gioi_tinh VARCHAR(10) NOT NULL,
    ngay_sinh DATE NOT NULL,
    so_dien_thoai VARCHAR(20) NOT NULL,
    ly_do_kham TEXT,
    trang_thai VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Đổ dữ liệu vào bảng doctors
INSERT INTO doctors (name, email, phone, gioi_tinh, mo_ta_bac_si, hoc_vi, kinh_nghiem, link_anh) VALUES
('PGS.TS. BS Nguyễn Thanh Hồi', 'nguyenthanhh@example.com', '0901234567', 'Nam', 'Tổng Giám đốc Bệnh viện', 'Tiến sĩ', 20, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/d09837dc-0ab8-400e-b486-fe7027180151-image.webp'),
('GS.TS. BS. Đỗ Quyết', 'doquyet@example.com', '0987654321', 'Nam', 'Phó Tổng Giám Đốc Bệnh Viện', 'Tiến sĩ', 25, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/15362c14-c585-472a-9999-aacdd5919507-image.webp'),
('PGS.TS. BSNT Vũ Hồng Thăng', 'vuhongthang@example.com', '0912345678', 'Nam', 'Phó Tổng Giám Đốc Bệnh Viện', 'Tiến sĩ', 15, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/b17b466f-9ff2-4569-929f-cee64024d7d3-image.webp'),
('TS. BS Nguyễn Văn A', 'nguyenvana@example.com', '0923456789', 'Nam', 'Trưởng khoa Tim mạch', 'Tiến sĩ', 15, 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/anh-bac-si-27.jpg'),
('ThS. BS Trần Thị B', 'tranthib@example.com', '0934567890', 'Nữ', 'Phó khoa Nội tổng hợp', 'Thạc sĩ', 10, 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/anh-bac-si-12.jpg'),
('Sinh viên Nguyễn Văn C', 'nguyenvanc@example.com', '0945678901', 'Nam', 'Bác sĩ điều trị', 'Sinh viên thực tập', 1, 'https://media.istockphoto.com/id/1190555591/vector/medical-doctor-profile-icon-male-doctor-avatar-vector-illustration.jpg?s=612x612&w=is&k=20&c=3x8LX3OqSE3h5Udq6AWqBUvdKIwhUHeBuwP54E9Yh5c='),
('Sinh viên Nguyễn Văn D', 'nguyenvanD@example.com', '0945678901', 'Nam', 'Bác sĩ điều trị', 'Sinh viên thực tập', 2, 'https://media.istockphoto.com/id/1190555591/vector/medical-doctor-profile-icon-male-doctor-avatar-vector-illustration.jpg?s=612x612&w=is&k=20&c=3x8LX3OqSE3h5Udq6AWqBUvdKIwhUHeBuwP54E9Yh5c='),
('BSNT. Lê Thị Hương', 'lethuong@example.com', '0901111222', 'Nữ', 'Trưởng khoa Sản', 'Bác sĩ nội trú', 12, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/13aa557e-d400-4f0d-993c-d612ecbe1220-image.webp'),
('ThS. BS. Phạm Văn Khánh', 'phamvankhanh@example.com', '0911222333', 'Nam', 'Phó khoa Ung bướu', 'Thạc sĩ', 7, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/54a6467d-a770-4006-a11f-0edec6c019ae-image.webp'),
('Sinh viên Nguyễn Hữu Tài', 'nguyenhuutai@example.com', '0922333444', 'Nam', 'Bác sĩ phụ trách tư vấn thuốc', 'Sinh viên thực tập', 1, 'https://png.pngtree.com/png-clipart/20240618/original/pngtree-ai-generated-young-handsome-doctor-with-stethoscope-art-png-image_15357483.png'),
('TS. BS. Đặng Minh Châu', 'dangminhchau@example.com', '0933444555', 'Nữ', 'Giám đốc Trung tâm Chẩn đoán trước sinh', 'Tiến sĩ', 18, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/5e970faa-20b3-422c-8da5-6696c2d0e6cc-image.webp'),
('Sinh viên Nguyễn Thị Thu', 'nguyenthithu@example.com', '0944555666', 'Nữ', 'Sinh viên thực tập tại khoa Nội', 'Sinh viên thực tập', 2, 'https://kenh14cdn.com/2017/9-1483932467686.jpg'),
('BSCKI. Trần Văn Lâm', 'tranvanlam@example.com', '0955666777', 'Nam', 'Trưởng khoa Tim mạch can thiệp', 'Bác sĩ chuyên khoa', 14, 'https://png.pngtree.com/png-clipart/20230813/original/pngtree-flat-illustration-of-a-male-doctor-avatar-upper-body-in-youth-vector-picture-image_10580735.png'),
('BSCKII. Hoàng Thị Mai', 'hoangthimai@example.com', '0966777888', 'Nữ', 'Phó khoa Sản', 'Bác sĩ chuyên khoa', 11, 'https://media.istockphoto.com/id/1249974528/vi/vec-to/nh%C3%A2n-v%E1%BA%ADt-avatar-b%C3%A1c-s%C4%A9-%C4%91%E1%BB%A9ng-trong-h%C3%ACnh-tr%C3%B2n-ph%E1%BA%B3ng-thi%E1%BA%BFt-k%E1%BA%BF-vector-minh-h%E1%BB%8Da-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n.jpg?s=612x612&w=is&k=20&c=Dfrj4LilbelrqSnn0kypPqjegWzuxQol_nluYb-OhXc='),
('BSCKI. Lý Minh Tuấn', 'lyminhtuan@example.com', '0977888999', 'Nam', 'Bác sĩ điều trị cao cấp', 'Bác sĩ chuyên khoa', 9, 'https://png.pngtree.com/png-clipart/20230813/original/pngtree-flat-illustration-of-a-male-doctor-avatar-upper-body-in-youth-vector-picture-image_10580735.png'),
('BSNT. Nguyễn Quốc Bảo', 'nguyenquocbao@example.com', '0988999000', 'Nam', 'Bác sĩ nội trú khoa Nội', 'Bác sĩ nội trú', 3, 'https://png.pngtree.com/png-clipart/20230813/original/pngtree-flat-illustration-of-a-male-doctor-avatar-upper-body-in-youth-vector-picture-image_10580735.png'),
('BSNT. Trịnh Thị Hằng', 'trinhthihang@example.com', '0999000111', 'Nữ', 'Bác sĩ nội trú phẫu thuật', 'Bác sĩ nội trú', 4, 'https://media.istockphoto.com/id/1249974528/vi/vec-to/nh%C3%A2n-v%E1%BA%ADt-avatar-b%C3%A1c-s%C4%A9-%C4%91%E1%BB%A9ng-trong-h%C3%ACnh-tr%C3%B2n-ph%E1%BA%B3ng-thi%E1%BA%BFt-k%E1%BA%BF-vector-minh-h%E1%BB%8Da-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n.jpg?s=612x612&w=is&k=20&c=Dfrj4LilbelrqSnn0kypPqjegWzuxQol_nluYb-OhXc='),
('Sinh viên Phạm Văn Toàn', 'phamvantoan@example.com', '0911000222', 'Nam', 'Bác sĩ nội trú chuyên khoa tim', 'Sinh viên thực tập', 1, 'https://png.pngtree.com/png-clipart/20230813/original/pngtree-flat-illustration-of-a-male-doctor-avatar-upper-body-in-youth-vector-picture-image_10580735.png'),
('ThS. BS. Lê Thị Ngọc', 'lethingoc@example.com', '0911223344', 'Nữ', 'Phó khoa Sản', 'Thạc sĩ', 6, 'https://media.istockphoto.com/id/1249974528/vi/vec-to/nh%C3%A2n-v%E1%BA%ADt-avatar-b%C3%A1c-s%C4%A9-%C4%91%E1%BB%A9ng-trong-h%C3%ACnh-tr%C3%B2n-ph%E1%BA%B3ng-thi%E1%BA%BFt-k%E1%BA%BF-vector-minh-h%E1%BB%8Da-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n.jpg?s=612x612&w=is&k=20&c=Dfrj4LilbelrqSnn0kypPqjegWzuxQol_nluYb-OhXc='),
('BS. Phạm Thủy Ni Ni', 'dangminhhoa@example.com', '0339338271', 'Nữ', 'Bác sĩ điều trị sản phụ khoa', 'Bác sĩ', 5, 'https://nhakhoadelia.vn/wp-content/uploads/2024/04/25-1713601052.jpg'),
('ThS. DS. Phạm Huyền Trang', 'phamtrang@example.com', '0944556677', 'Nữ', 'Trưởng khoa Dược', 'Thạc sĩ', 12, 'https://media.istockphoto.com/id/1249974528/vi/vec-to/nh%C3%A2n-v%E1%BA%ADt-avatar-b%C3%A1c-s%C4%A9-%C4%91%E1%BB%A9ng-trong-h%C3%ACnh-tr%C3%B2n-ph%E1%BA%B3ng-thi%E1%BA%BFt-k%E1%BA%BF-vector-minh-h%E1%BB%8Da-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n.jpg?s=612x612&w=is&k=20&c=Dfrj4LilbelrqSnn0kypPqjegWzuxQol_nluYb-OhXc='),
('Sinh viên Nguyễn Văn Hưng', 'nguyenvanhung@example.com', '0955667788', 'Nam', 'Dược sĩ tư vấn', 'Sinh viên thực tập', 2, 'https://nhakhoakim.com/wp-content/uploads/2022/07/BS-Giao-Tuan-Cuong.jpg'),
('Sinh viên Trần Văn Nam', 'tranvannam@example.com', '0911223345', 'Nam', 'Sinh viên thực tập tại khoa Nội', 'Sinh viên thực tập', 1, 'https://cdn.medigoapp.com/a-files/other/2023-11-13t11:01:51.819z-votranminhtri1webp'),
('Sinh viên Lê Thị Hoa', 'lethihoa@example.com', '0922334456', 'Nữ', 'Sinh viên thực tập tại khoa Ngoại', 'Sinh viên thực tập', 2, 'https://nhakhoadelia.vn/wp-content/uploads/2024/04/28-1713601052.jpg'),
('Sinh viên Hannibal Lecter', 'phamquocviet@example.com', '0933445567', 'Nam', 'Sinh viên thực tập tại khoa Tim mạch', 'Sinh viên thực tập', 1, 'https://thanhbinhpsy.com/wp-content/uploads/2019/06/hannibal-lecter-1.jpg'),
('Sinh viên Nguyễn Thị Lan', 'nguyenthilan@example.com', '0944556678', 'Nữ', 'Sinh viên thực tập tại khoa Sản', 'Sinh viên thực tập', 2, 'https://nhakhoadelia.vn/wp-content/uploads/2024/04/25-1713601052.jpg');

CREATE TABLE user_bank_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE, 
    bank_name VARCHAR(255) NOT NULL, 
    account_holder VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    is_default BOOLEAN DEFAULT true, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Tạo khóa ngoại liên kết với bảng users
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL UNIQUE, 
    invoice_code VARCHAR(50) NOT NULL UNIQUE, 
    total_amount DECIMAL(12, 2) NOT NULL, 
    service_details JSONB, -- Lưu chi tiết các dịch vụ dưới dạng JSON
    payment_date TIMESTAMP WITH TIME ZONE, 
    transaction_id VARCHAR(255), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE RESTRICT
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, 
    action_type VARCHAR(100) NOT NULL, 
    ip_address VARCHAR(45), 
    user_agent TEXT, 
    details JSONB, -- Lưu trữ dữ liệu chi tiết về hành động 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Thời gian thực hiện
);

COMMENT ON COLUMN audit_logs.user_id IS 'ID người dùng thực hiện hành động. Có thể là NULL cho các hành động không cần đăng nhập (vd: đăng ký).';
COMMENT ON COLUMN audit_logs.action_type IS 'Một chuỗi định danh cho hành động (vd: LOGIN_FAILURE, UPDATE_PROFILE).';
COMMENT ON COLUMN audit_logs.ip_address IS 'Địa chỉ IP của client.';
COMMENT ON COLUMN audit_logs.user_agent IS 'Chuỗi User-Agent từ header của request.';
COMMENT ON COLUMN audit_logs.details IS 'Dữ liệu JSON chứa thông tin bổ sung, vd: { "appointmentId": 123, "changes": "status updated" }.';

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Them mot tai khoan admin co san
-- Mat khau la: admin123
INSERT INTO admins (username, password) VALUES ('admin', '$2a$10$13JO24QaAbQd5/gm/d8k1eOifimFWTnNDb.1aCTWKk5Fw0.32qoA6');


-- Tạo bảng để quản lý lịch làm việc (ca làm việc) của bác sĩ
CREATE TABLE doctor_schedules (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    work_date DATE NOT NULL, -- Ngày làm việc
    start_time TIME NOT NULL, -- Giờ bắt đầu ca
    end_time TIME NOT NULL,   -- Giờ kết thúc ca
    CONSTRAINT unique_doctor_work_schedule UNIQUE (doctor_id, work_date, start_time) -- Đảm bảo mỗi bác sĩ chỉ có 1 ca làm việc tại 1 thời điểm
);

COMMENT ON TABLE doctor_schedules IS 'Lưu trữ các ca làm việc của bác sĩ.';
COMMENT ON COLUMN doctor_schedules.work_date IS 'Ngày bác sĩ có lịch làm việc.';
COMMENT ON COLUMN doctor_schedules.start_time IS 'Thời gian bắt đầu ca làm việc.';
COMMENT ON COLUMN doctor_schedules.end_time IS 'Thời gian kết thúc ca làm việc.';


-- Tạo bảng để quản lý các khung giờ khám bệnh trong mỗi ca
CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER NOT NULL REFERENCES doctor_schedules(id) ON DELETE CASCADE,
    slot_time TIME NOT NULL, -- Giờ bắt đầu của khung giờ khám
    is_available BOOLEAN DEFAULT TRUE, -- Trạng thái: true = còn trống, false = đã được đặt
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL, -- Liên kết với cuộc hẹn nếu đã được đặt
    CONSTRAINT unique_slot_in_schedule UNIQUE (schedule_id, slot_time) -- Mỗi khung giờ trong 1 ca là duy nhất
);

COMMENT ON TABLE time_slots IS 'Lưu các khung giờ khám bệnh chi tiết trong một ca làm việc của bác sĩ.';
COMMENT ON COLUMN time_slots.slot_time IS 'Thời gian bắt đầu của một khung giờ khám (ví dụ: 08:00, 08:30).';
COMMENT ON COLUMN time_slots.is_available IS 'Cho biết khung giờ này còn trống hay không.';
COMMENT ON COLUMN time_slots.appointment_id IS 'Liên kết tới lịch hẹn đã đặt cho khung giờ này.';