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
    co_so_kham VARCHAR(255),
    chuyen_khoa VARCHAR(255),
    mo_ta_chuc_vu VARCHAR(255),
    hoc_vi VARCHAR(255),
    kinh_nghiem INT,
    link_anh VARCHAR(255),
    chuc_vu VARCHAR(255)
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
INSERT INTO doctors (name, email, phone, co_so_kham, chuyen_khoa, mo_ta_chuc_vu, hoc_vi, kinh_nghiem, link_anh, chuc_vu) VALUES
('PGS.TS. BS Nguyễn Thanh Hồi', 'nguyenthanhh@example.com', '0901234567', 'Bệnh viện Đại học Phenikaa', 'Tim mạch', 'Tổng Giám đốc Bệnh viện', 'Tiến sĩ', 20, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/d09837dc-0ab8-400e-b486-fe7027180151-image.webp', 'Tổng giám đốc'),
('GS.TS. BS. Đỗ Quyết', 'doquyet@example.com', '0987654321', 'Phòng khám Đa khoa Đại học Phenikaa', 'Nội tổng hợp', 'Phó Tổng Giám Đốc Bệnh Viện', 'Tiến sĩ', 25, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/15362c14-c585-472a-9999-aacdd5919507-image.webp', 'Phó tổng giám đốc'),
('PGS.TS. BSNT Vũ Hồng Thăng', 'vuhongthang@example.com', '0912345678', 'Bệnh viện Đại học Phenikaa', 'Ngoại tổng hợp', 'Phó Tổng Giám Đốc Bệnh Viện', 'Tiến sĩ', 15, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/b17b466f-9ff2-4569-929f-cee64024d7d3-image.webp', 'Phó tổng giám đốc'),
('TS. BS Nguyễn Văn A', 'nguyenvana@example.com', '0923456789', 'Bệnh viện Đại học Phenikaa', 'Tim mạch', 'Trưởng khoa Tim mạch', 'Tiến sĩ', 15, 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/anh-bac-si-27.jpg', 'Trưởng Khoa'),
('ThS. BS Trần Thị B', 'tranthib@example.com', '0934567890', 'Phòng khám Đa khoa Đại học Phenikaa', 'Nội tổng hợp', 'Phó khoa Nội tổng hợp', 'Thạc sĩ', 10, 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/anh-bac-si-12.jpg', 'Phó Trưởng Khoa'),
('Sinh viên Nguyễn Văn C', 'nguyenvanc@example.com', '0945678901', 'Sinh viên tòa A8', 'Ngoại tổng hợp', 'Bác sĩ điều trị', 'Sinh viên thực tập', 1, 'https://media.istockphoto.com/id/1190555591/vector/medical-doctor-profile-icon-male-doctor-avatar-vector-illustration.jpg?s=612x612&w=is&k=20&c=3x8LX3OqSE3h5Udq6AWqBUvdKIwhUHeBuwP54E9Yh5c=', 'Sinh viên thực tập'),
('Sinh viên Nguyễn Văn D', 'nguyenvanD@example.com', '0945678901', 'Sinh viên tòa A8', 'Ngoại tổng hợp', 'Bác sĩ điều trị', 'Sinh viên thực tập', 2, 'https://media.istockphoto.com/id/1190555591/vector/medical-doctor-profile-icon-male-doctor-avatar-vector-illustration.jpg?s=612x612&w=is&k=20&c=3x8LX3OqSE3h5Udq6AWqBUvdKIwhUHeBuwP54E9Yh5c=', 'Sinh viên thực tập'),
('BSNT. Lê Thị Hương', 'lethuong@example.com', '0901111222', 'Bệnh viện Đại học Phenikaa', 'Khoa sản', 'Trưởng khoa Sản', 'Bác sĩ nội trú', 12, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/13aa557e-d400-4f0d-993c-d612ecbe1220-image.webp', 'Trưởng Khoa'),
('ThS. BS. Phạm Văn Khánh', 'phamvankhanh@example.com', '0911222333', 'Phòng khám Đa khoa Đại học Phenikaa', 'Ung bướu', 'Phó khoa Ung bướu', 'Thạc sĩ', 7, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/54a6467d-a770-4006-a11f-0edec6c019ae-image.webp', 'Phó Trưởng Khoa'),
('Sinh viên Nguyễn Hữu Tài', 'nguyenhuutai@example.com', '0922333444', 'Sinh viên tòa A8', 'Khoa Dược', 'Bác sĩ phụ trách tư vấn thuốc', 'Sinh viên thực tập', 1, 'https://png.pngtree.com/png-clipart/20240618/original/pngtree-ai-generated-young-handsome-doctor-with-stethoscope-art-png-image_15357483.png', 'Sinh viên thực tập'),
('TS. BS. Đặng Minh Châu', 'dangminhchau@example.com', '0933444555', 'Bệnh viện Đại học Phenikaa', 'Y học bào thai', 'Giám đốc Trung tâm Chẩn đoán trước sinh', 'Tiến sĩ', 18, 'https://cdn.phenikaamec.com/phenikaa-mec/image/5-14-2025/5e970faa-20b3-422c-8da5-6696c2d0e6cc-image.webp', 'Giám đốc trung tâm'),
('Sinh viên Nguyễn Thị Thu', 'nguyenthithu@example.com', '0944555666', 'Sinh viên tòa A8', 'Nội tổng hợp', 'Sinh viên thực tập tại khoa Nội', 'Sinh viên thực tập', 2, 'https://kenh14cdn.com/2017/9-1483932467686.jpg', 'Sinh viên thực tập'),
('BSCKI. Trần Văn Lâm', 'tranvanlam@example.com', '0955666777', 'Bệnh viện Đại học Phenikaa', 'Tim mạch', 'Trưởng khoa Tim mạch can thiệp', 'Bác sĩ chuyên khoa', 14, 'https://png.pngtree.com/png-clipart/20230813/original/pngtree-flat-illustration-of-a-male-doctor-avatar-upper-body-in-youth-vector-picture-image_10580735.png', 'Trưởng Khoa'),
('BSCKII. Hoàng Thị Mai', 'hoangthimai@example.com', '0966777888', 'Phòng khám Đa khoa Đại học Phenikaa', 'Khoa sản', 'Phó khoa Sản', 'Bác sĩ chuyên khoa', 11, 'https://media.istockphoto.com/id/1249974528/vi/vec-to/nh%C3%A2n-v%E1%BA%ADt-avatar-b%C3%A1c-s%C4%A9-%C4%91%E1%BB%A9ng-trong-h%C3%ACnh-tr%C3%B2n-ph%E1%BA%B3ng-thi%E1%BA%BFt-k%E1%BA%BF-vector-minh-h%E1%BB%8Da-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n.jpg?s=612x612&w=is&k=20&c=Dfrj4LilbelrqSnn0kypPqjegWzuxQol_nluYb-OhXc=', 'Phó Trưởng Khoa'),
('BSCKI. Lý Minh Tuấn', 'lyminhtuan@example.com', '0977888999', 'Bệnh viện Đại học Phenikaa', 'Ung bướu', 'Bác sĩ điều trị cao cấp', 'Bác sĩ chuyên khoa', 9, 'https://png.pngtree.com/png-clipart/20230813/original/pngtree-flat-illustration-of-a-male-doctor-avatar-upper-body-in-youth-vector-picture-image_10580735.png', 'Bác sĩ điều trị'),
('BSNT. Nguyễn Quốc Bảo', 'nguyenquocbao@example.com', '0988999000', 'Phòng khám Đa khoa Đại học Phenikaa', 'Nội tổng hợp', 'Bác sĩ nội trú khoa Nội', 'Bác sĩ nội trú', 3, 'https://png.pngtree.com/png-clipart/20230813/original/pngtree-flat-illustration-of-a-male-doctor-avatar-upper-body-in-youth-vector-picture-image_10580735.png', 'Bác sĩ điều trị'),
('BSNT. Trịnh Thị Hằng', 'trinhthihang@example.com', '0999000111', 'Bệnh viện Đại học Phenikaa', 'Ngoại tổng hợp', 'Bác sĩ nội trú phẫu thuật', 'Bác sĩ nội trú', 4, 'https://media.istockphoto.com/id/1249974528/vi/vec-to/nh%C3%A2n-v%E1%BA%ADt-avatar-b%C3%A1c-s%C4%A9-%C4%91%E1%BB%A9ng-trong-h%C3%ACnh-tr%C3%B2n-ph%E1%BA%B3ng-thi%E1%BA%BFt-k%E1%BA%BF-vector-minh-h%E1%BB%8Da-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n.jpg?s=612x612&w=is&k=20&c=Dfrj4LilbelrqSnn0kypPqjegWzuxQol_nluYb-OhXc=', 'Bác sĩ điều trị'),
('Sinh viên Phạm Văn Toàn', 'phamvantoan@example.com', '0911000222', 'Sinh viên tòa A8', 'Tim mạch', 'Bác sĩ nội trú chuyên khoa tim', 'Sinh viên thực tập', 1, 'https://png.pngtree.com/png-clipart/20230813/original/pngtree-flat-illustration-of-a-male-doctor-avatar-upper-body-in-youth-vector-picture-image_10580735.png', 'Sinh viên thực tập'),
('ThS. BS. Lê Thị Ngọc', 'lethingoc@example.com', '0911223344', 'Phòng khám Đa khoa Đại học Phenikaa', 'Khoa sản', 'Phó khoa Sản', 'Thạc sĩ', 6, 'https://media.istockphoto.com/id/1249974528/vi/vec-to/nh%C3%A2n-v%E1%BA%ADt-avatar-b%C3%A1c-s%C4%A9-%C4%91%E1%BB%A9ng-trong-h%C3%ACnh-tr%C3%B2n-ph%E1%BA%B3ng-thi%E1%BA%BFt-k%E1%BA%BF-vector-minh-h%E1%BB%8Da-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n.jpg?s=612x612&w=is&k=20&c=Dfrj4LilbelrqSnn0kypPqjegWzuxQol_nluYb-OhXc=', 'Phó Trưởng Khoa'),
('BS. Đặng Minh Hòa', 'dangminhhoa@example.com', '0933445566', 'Bệnh viện Đại học Phenikaa', 'Khoa sản', 'Bác sĩ điều trị sản phụ khoa', 'Bác sĩ', 5, 'https://media.istockphoto.com/id/1249974528/vi/vec-to/nh%C3%A2n-v%E1%BA%ADt-avatar-b%C3%A1c-s%C4%A9-%C4%91%E1%BB%A9ng-trong-h%C3%ACnh-tr%C3%B2n-ph%E1%BA%B3ng-thi%E1%BA%BFt-k%E1%BA%BF-vector-minh-h%E1%BB%8Da-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n.jpg?s=612x612&w=is&k=20&c=Dfrj4LilbelrqSnn0kypPqjegWzuxQol_nluYb-OhXc=', 'Bác sĩ điều trị'),
('ThS. DS. Phạm Huyền Trang', 'phamtrang@example.com', '0944556677', 'Phòng khám Đa khoa Đại học Phenikaa', 'Khoa Dược', 'Trưởng khoa Dược', 'Thạc sĩ', 12, 'https://media.istockphoto.com/id/1249974528/vi/vec-to/nh%C3%A2n-v%E1%BA%ADt-avatar-b%C3%A1c-s%C4%A9-%C4%91%E1%BB%A9ng-trong-h%C3%ACnh-tr%C3%B2n-ph%E1%BA%B3ng-thi%E1%BA%BFt-k%E1%BA%BF-vector-minh-h%E1%BB%8Da-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n.jpg?s=612x612&w=is&k=20&c=Dfrj4LilbelrqSnn0kypPqjegWzuxQol_nluYb-OhXc=', 'Trưởng Khoa'),
('Sinh viên Nguyễn Văn Hưng', 'nguyenvanhung@example.com', '0955667788', 'Sinh viên tòa A8', 'Khoa Dược', 'Dược sĩ tư vấn', 'Sinh viên thực tập', 2, 'https://nhakhoakim.com/wp-content/uploads/2022/07/BS-Giao-Tuan-Cuong.jpg', 'Sinh viên thực tập'),
('Sinh viên Trần Văn Nam', 'tranvannam@example.com', '0911223345', 'Bệnh viện Đại học Phenikaa', 'Nội tổng hợp', 'Sinh viên thực tập tại khoa Nội', 'Sinh viên thực tập', 1, 'https://cdn.medigoapp.com/a-files/other/2023-11-13t11:01:51.819z-votranminhtri1webp', 'Sinh viên thực tập'),
('Sinh viên Lê Thị Hoa', 'lethihoa@example.com', '0922334456', 'Bệnh viện Đại học Phenikaa', 'Ngoại tổng hợp', 'Sinh viên thực tập tại khoa Ngoại', 'Sinh viên thực tập', 2, 'https://nhakhoadelia.vn/wp-content/uploads/2024/04/28-1713601052.jpg', 'Sinh viên thực tập'),
('Sinh viên Hannibal Lecter', 'phamquocviet@example.com', '0933445567', 'Phòng khám Đa khoa Đại học Phenikaa', 'Tim mạch', 'Sinh viên thực tập tại khoa Tim mạch', 'Sinh viên thực tập', 1, 'https://thanhbinhpsy.com/wp-content/uploads/2019/06/hannibal-lecter-1.jpg', 'Sinh viên thực tập'),
('Sinh viên Nguyễn Thị Lan', 'nguyenthilan@example.com', '0944556678', 'Phòng khám Đa khoa Đại học Phenikaa', 'Khoa sản', 'Sinh viên thực tập tại khoa Sản', 'Sinh viên thực tập', 2, 'https://nhakhoadelia.vn/wp-content/uploads/2024/04/25-1713601052.jpg', 'Sinh viên thực tập');