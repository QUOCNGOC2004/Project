import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // Thay useHistory bằng useNavigate
import '../../css/forHome/navbar8.css';

const Navbar8 = (props) => {
  const [link5DropdownVisible, setLink5DropdownVisible] = useState(false);
  const navigate = useNavigate(); // Sử dụng useNavigate

  const handleDangNhapDangKyClick = () => {
    navigate('/dang-nhap-dang-ky'); // Sử dụng navigate
  };

  return (
    <header className="navbar8-container1">
      <header data-thq="thq-navbar" className="navbar8-navbar-interactive">
        <img
          alt={props.logoAlt}
          src={props.logoSrc}
          className="navbar8-image1"
        />
        <div data-thq="thq-navbar-nav" className="navbar8-desktop-menu">
          <nav className="navbar8-links1">
            <a
              href={props.trangChuUrl}
              className="navbar8-link11 thq-link thq-body-small"
            >
              {props.trangChu ?? (
                <Fragment>
                  <span className="navbar8-text18">Trang chủ</span>
                </Fragment>
              )}
            </a>
            <a
              href={props.tinTucUrl}
              className="thq-link thq-body-small"
            >
              {props.tinTuc ?? (
                <Fragment>
                  <span className="navbar8-text16">Tin tức</span>
                </Fragment>
              )}
            </a>
            <a
              href={props.gioiThieuUrl}
              className="navbar8-link31 thq-link thq-body-small"
            >
              {props.gioiThieu ?? (
                <Fragment>
                  <span className="navbar8-text24">Giới thiệu</span>
                </Fragment>
              )}
            </a>
            <div
              onClick={() => setLink5DropdownVisible(!link5DropdownVisible)}
              className="navbar8-link4-dropdown-trigger"
            >
              <span className="thq-link thq-body-small">
                {props.them ?? (
                  <Fragment>
                    <span className="navbar8-text21">Thêm</span>
                  </Fragment>
                )}
              </span>
              <div className="navbar8-icon-container1">
                {link5DropdownVisible && (
                  <div className="navbar8-container2">
                    <svg viewBox="0 0 1024 1024" className="navbar8-icon10">
                      <path d="M298 426h428l-214 214z"></path>{/*icon mũi tên xuống*/}
                    </svg>
                  </div>
                )}
                {!link5DropdownVisible && (
                  <div className="navbar8-container3">
                    <svg viewBox="0 0 1024 1024" className="navbar8-icon12">
                      <path d="M426 726v-428l214 214z"></path>{/*icon mũi tên lên*/}
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </nav>
          <div className="navbar8-buttons1">
            <button className="navbar8-action11 thq-button-animated thq-button-filled">
              <span>
                {props.nguoiDung ?? (
                  <Fragment>
                    <span className="navbar8-text15">Người dùng</span>
                  </Fragment>
                )}
              </span>
            </button>
            <button
              onClick={handleDangNhapDangKyClick}
              className="navbar8-action21 thq-button-outline thq-button-animated"
            >
              <span>
                {props.dangNhapDangKy ?? (
                  <Fragment>
                    <span className="navbar8-text27">Đăng nhập/Đăng ký</span>
                  </Fragment>
                )}
              </span>
            </button>
          </div>
        </div>
        {link5DropdownVisible && (
          <div className="navbar8-container7 thq-box-shadow">
            <div className="navbar8-link5-menu-list">
              <a href={props.lienKetThanhToan}>
                <div className="navbar8-menu-item5">
                  <img
                    alt={props.hinhAnhThanhToanAlt}
                    src={props.hinhAnhThanhToanSrc}
                    className="navbar8-page1-image2 thq-img-ratio-1-1"
                  />
                  <div className="navbar8-content5">
                    <span className="navbar8-page12 thq-body-large">
                      {props.tieuDeThanhToan ?? (
                        <Fragment>
                          <span className="navbar8-text17">Thanh toán</span>
                        </Fragment>
                      )}
                    </span>
                    <span className="thq-body-small">
                      {props.moTaThanhToan ?? (
                        <Fragment>
                          <span className="navbar8-text22">
                            Thanh toán trước tiền hẹn khám
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </a>
              <a href={props.lienKetDatLich}>
                <div className="navbar8-menu-item6">
                  <img
                    alt={props.hinhAnhDatLichAlt}
                    src={props.hinhAnhDatLichSrc}
                    className="navbar8-page2-image2 thq-img-ratio-1-1"
                  />
                  <div className="navbar8-content6">
                    <span className="navbar8-page22 thq-body-large">
                      {props.tieuDeDatLich ?? (
                        <Fragment>
                          <span className="navbar8-text20">Đặt lịch hẹn</span>
                        </Fragment>
                      )}
                    </span>
                    <span className="thq-body-small">
                      {props.moTaDatLich ?? (
                        <Fragment>
                          <span className="navbar8-text23">
                            Đặt lịch khám trước với bác sĩ
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </a>
              <a href={props.lienKetDanhSachBacSi}>
                <div className="navbar8-menu-item7">
                  <img
                    alt={props.hinhAnhDanhSachBacSiAlt}
                    src={props.hinhAnhDanhSachBacSiSrc}
                    className="navbar8-page3-image2 thq-img-ratio-1-1"
                  />
                  <div className="navbar8-content7">
                    <span className="navbar8-page32 thq-body-large">
                      {props.tieuDeDanhSachBacSi ?? (
                        <Fragment>
                          <span className="navbar8-text25">
                            Danh sách bác sĩ
                          </span>
                        </Fragment>
                      )}
                    </span>
                    <span className="thq-body-small">
                      {props.moTaDanhSachBacSi ?? (
                        <Fragment>
                          <span className="navbar8-text26">
                            Xem danh sách bác sĩ
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </a>
              <a href={props.lienKetQuanLyLichHen}>
                <div className="navbar8-menu-item8">
                  <img
                    alt={props.hinhAnhQuanLyLichHenAlt}
                    src={props.hinhAnhQuanLyLichHenSrc}
                    className="navbar8-page4-image2 thq-img-ratio-1-1"
                  />
                  <div className="navbar8-content8">
                    <span className="navbar8-page42 thq-body-large">
                      {props.tieuDeQuanLyLichHen ?? (
                        <Fragment>
                          <span className="navbar8-text19">
                            Quản lý lịch hẹn
                          </span>
                        </Fragment>
                      )}
                    </span>
                    <span className="thq-body-small">
                      {props.moTaQuanLyLichHen ?? (
                        <Fragment>
                          <span className="navbar8-text14">
                            Quản lý lịch hẹn của bạn
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}
      </header>
      {link5DropdownVisible && (
        <div
          onClick={() => setLink5DropdownVisible(false)}
          className="navbar8-container8"
        ></div>
      )}
    </header>
  );
};

Navbar8.defaultProps = {
  // Logo properties
  logoAlt: 'Logo của trang web',
  logoSrc: 'https://cdn.haitrieu.com/wp-content/uploads/2023/10/Icon-CTy-Tap-doan-Phuong-Hoan.png',

  // Navigation links
  trangChu: undefined,
  trangChuUrl: '/',
  tinTuc: undefined,
  tinTucUrl: 'https://hs.phenikaa-uni.edu.vn/vi/category/tin-tuc-su-kien',
  gioiThieu: undefined,
  gioiThieuUrl: 'https://phenikaamec.com/',
  them: undefined,

  // Action buttons
  nguoiDung: undefined,
  dangNhapDangKy: undefined,

  // Page 1 properties (Thanh toan)
  tieuDeThanhToan: undefined,
  moTaThanhToan: undefined,
  hinhAnhThanhToanAlt: 'Hình ảnh cho Thanh toán',
  hinhAnhThanhToanSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAD+CAMAAABWbIqvAAAAA1BMVEVH0P4JkrybAAAAR0lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8GxXIAARdOqd4AAAAASUVORK5CYII=',
  lienKetThanhToan: '/thanh-toan',

  // Page 2 properties (Dat lich)
  tieuDeDatLich: undefined,
  moTaDatLich: undefined,
  hinhAnhDatLichAlt: 'Hình ảnh cho Đặt lịch',
  hinhAnhDatLichSrc: 'data:image/jpeg;base64,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',
  lienKetDatLich: '/dat-lich',

  // Page 3 properties (Danh sach bac si)
  tieuDeDanhSachBacSi: undefined,
  moTaDanhSachBacSi: undefined,
  hinhAnhDanhSachBacSiAlt: 'Hình ảnh cho Danh sách bác sĩ',
  hinhAnhDanhSachBacSiSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASsAAACoCAMAAACPKThEAAAAA1BMVEX//wCKxvRFAAAASElEQVR4nO3BMQEAAADCoPVPbQo/oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAICXAcTgAAG6EJuyAAAAAElFTkSuQmCC',
  lienKetDanhSachBacSi: '/danh-sach-bs',

  // Page 4 properties (Quan ly lich hen)
  tieuDeQuanLyLichHen: undefined,
  moTaQuanLyLichHen: undefined,
  hinhAnhQuanLyLichHenAlt: 'Hình ảnh cho Trang quản lý lịch đã đặt',
  hinhAnhQuanLyLichHenSrc: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ8NDQ0NFREWFhURExUYHSggGBoxGxUVITEhJSk3Li4uFx8zODM4NygtLisBCgoKDQ0NDw0NDysZFRk3Nys3LS0tNzcrLS0rKys3Kys3LS0rNysrLSsrLSsrKysrLSsrKy0rNysrLSsrLSsrK//AABEIASwAqAMBIgACEQEDEQH/xAAaAAEBAQEBAQEAAAAAAAAAAAABAAIDBAUH/8QAGRABAQEBAQEAAAAAAAAAAAAAAAEREgIT/8QAGgEAAwEBAQEAAAAAAAAAAAAAAAECAwQFBv/EABkRAQEBAQEBAAAAAAAAAAAAAAABERIhAv/aAAwDAQACEQMRAD8A/UNGrRr0caw6NGi08XIrRq0aa5FotGjTxpIdFotFp4uQ2s2jRarGkhtZtVrNp40kNrFptZtUuRVmqiqXIKzTRTVGKjUVin2dFoDmeDDoWsm0htAFp4uHWdWi02sitFo0Wni5FotVrNqsaSG1m1Ws2njSQ2s2rQpci0IaakEDMVJGb62jQnI8GIIU2kVCZptIrRahaprFaKKNNpFaLVazabSK0atZU0kOgUaa5DaADUQkACCYfTCDleDCKmbTaRUIVTWKs1UWm1itGi0WqaxWs2ms02kitCtZ02shtA0GqQ6EjMhIBJIB9IIOd8/EEKGvyqzTWaprFWaazTbRVmms1TWKs6azVNYgqDaRaEDWUNQBQ1aMDSZIJ9EIOd89FQkbSUUVA2sooprJtfmiiqiqbfNFZprNNrKgqKprKEKjXpQGga0mdWga0mNR4T6gScz52VBANJVWTQbSUVmmiqayis01mm1lVZprNU1lFFVFU1lFCo016dGjRp4etaNZtFp4Na1Majwa+xqZTkfPHQgFSqhA2kqrJrNU1lFFQptJRWaazVRrKGaaKppKLQrWappKrRqtZ0z02s6LWbTkPWr6TnalYNfcQTifPkIA5UKWabSVVmms1TSVVmqinGkorNNZqo1lFZptZqo0lFGq1mqXKrWbVazaqReq1i1Ws2qkPVambUrDfe06xq1w48JvRo0aMB0Wi0U1xWi1WsmuJmm1m1TSCiqs02sVZtNZqmkFZprNVFwVmms1UXGazTWauGzUKlG+7q1jTrhx42N6NZ1aMEh0WjRoxUNrOq1nVYuG1m1aLTaRVmrRapcVZqoptIKzTWaqLgrNNZqlxms1qsVUUzUKlh9nVrnp1x48zHTVrnq0YMb0azo0YcjVo1nVp4uQ6NGjTxUitC0GuK0VBS4KKWaaoKzWqzVRUYrNarFVFM1KhZvpadcuj05scPLrq1z1aMHLerXPVow8dNGsatGHjejWdWjDw6tZ1aeLkIGjTOEVM01K1mq1mnDirFarNVFRipVLN6ej04z010zxhy69Lpy6OlhcunR1y06MGOmrXPVpYeOmrWNWjBjWrWdWjDa1azq08M6KgDFZpoqjFZprNOGzUqlKWtdOPR6PGeO3S6cuj0WDHXo9OPR6LCx10646dGB16WuerSwOmnXLV0MDrq1z6XRYbpqtY6F9DA1otZ0arDa1m1azaeBWpm1GqOE9NdOE9GemuDHbo9OM9NT0WE7dLpyno9FhOunXLo9FhOurpy6PRYHTo659LoYHXVrnp6LA6aNZ0aMJvRrOjRhtaLRotPAqmbUFPF0Z6cej06cGu3R6cejPRclrvPR6cOj0XJO/S6cej0XIduj049LouSd+l049LouRrv0enDo9DknfpdOPS6LkOvS6cuh0MDt0L6cuxfQw3S1OV9JKnh6XTh2e3Z4nXeej08/Z7Hha9HR6eftdl4NenpdPP2uy8LXp7PbzdrsvBr09nt5u12Ra9PZ7eb6L6Fo16u128va+iRr09rt5u12RvR2u3n7H0Sb0dp5+0R68Xa7cNWtO05Xfs9vPq0dllejs9vNp0uxlejtdvPq0dllejs/R5tWl0Mr0/RfR5tOjoZXp+i+jzatLoZXp+i+jzatHQyvT9F9Hm1aWnlen6Dt59WjRlentPN0TPK//2Q==',
  lienKetQuanLyLichHen: '/quan-ly-lich'
}
Navbar8.propTypes = {
  // Logo properties
  logoAlt: PropTypes.string,
  logoSrc: PropTypes.string,

  // Navigation links
  trangChu: PropTypes.element,
  trangChuUrl: PropTypes.string,
  tinTuc: PropTypes.element,
  tinTucUrl: PropTypes.string,
  gioiThieu: PropTypes.element,
  gioiThieuUrl: PropTypes.string,
  them: PropTypes.element,

  // Action buttons
  nguoiDung: PropTypes.element,
  dangNhapDangKy: PropTypes.element,

  // Page 1 properties (Thanh toan)
  tieuDeThanhToan: PropTypes.element,
  moTaThanhToan: PropTypes.element,
  hinhAnhThanhToanAlt: PropTypes.string,
  hinhAnhThanhToanSrc: PropTypes.string,
  lienKetThanhToan: PropTypes.string,

  // Page 2 properties (Dat lich)
  tieuDeDatLich: PropTypes.element,
  moTaDatLich: PropTypes.element,
  hinhAnhDatLichAlt: PropTypes.string,
  hinhAnhDatLichSrc: PropTypes.string,
  lienKetDatLich: PropTypes.string,

  // Page 3 properties (Danh sach bac si)
  tieuDeDanhSachBacSi: PropTypes.element,
  moTaDanhSachBacSi: PropTypes.element,
  hinhAnhDanhSachBacSiAlt: PropTypes.string,
  hinhAnhDanhSachBacSiSrc: PropTypes.string,
  lienKetDanhSachBacSi: PropTypes.string,

  // Page 4 properties (Quan ly lich hen)
  tieuDeQuanLyLichHen: PropTypes.element,
  moTaQuanLyLichHen: PropTypes.element,
  hinhAnhQuanLyLichHenAlt: PropTypes.string,
  hinhAnhQuanLyLichHenSrc: PropTypes.string,
  lienKetQuanLyLichHen: PropTypes.string
}

export default Navbar8
