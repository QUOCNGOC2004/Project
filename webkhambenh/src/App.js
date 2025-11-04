import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import Home from './views/tragChu/home'; 
import ThanhToan from './views/thanhToann/ThanhToan';
import DatLich from './views/datLichh/DatLich';
import DanhSachBs from './views/bacSi/DanhSachBs';
import QuanLyLich from './views/quanLyLich/QuanLyLich';
import NotFound from './views/tragChu/not-found';
import Auth from './views/login/Auth';
import Navbar8 from './components/forHome/navbar8';
import ChatBot from './views/chatBott/ChatBot';
import Profile from './views/caNhann/Profile';
import AdminPage from './views/admin/admin';
import AdminLogin from './views/admin/AdminLogin';
import { Fragment } from 'react';

// Tạo wrapper để dùng useLocation
function AppContent() {
  const location = useLocation();

  // Ẩn Navbar ở các path nhất định
  const hiddenNavbarPaths = ['/dang-nhap-dang-ky', '/adminPanel', '/admin'];
  const hideNavbar = hiddenNavbarPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && (
        <Navbar8
          moTaQuanLyLichHen={<span className="home-text100">Quản lý lịch hẹn của bạn</span>}
          nguoiDung={<span className="home-text101">Người dùng</span>}
          tinTuc={<span className="home-text102">Tin tức</span>}
          tieuDeThanhToan={<span className="home-text103">Thanh toán</span>}
          trangChu={<span className="home-text104">Trang chủ</span>}
          tieuDeQuanLyLichHen={<span className="home-text105">Quản lý lịch hẹn</span>}
          tieuDeDatLich={<span className="home-text106">Đặt lịch hẹn</span>}
          them={<span className="home-text107">Thêm</span>}
          moTaThanhToan={<span className="home-text108">Thanh toán trước tiền hẹn khám</span>}
          moTaDatLich={<span className="home-text109">Đặt lịch khám trước với bác sĩ</span>}
          gioiThieu={<span className="home-text110">Giới thiệu</span>}
          tieuDeDanhSachBacSi={<span className="home-text111">Danh sách bác sĩ</span>}
          moTaDanhSachBacSi={<span className="home-text112">Xem danh sách bác sĩ</span>}
          dangNhapDangKy={<span className="home-text113">Đăng nhập/Đăng ký</span>}
        />
      )}

      <Switch>
        <Route exact path="/" component={Home} /> 
        <Route path="/thanh-toan" component={ThanhToan} />
        <Route path="/dat-lich" component={DatLich} />
        <Route path="/danh-sach-bs" component={DanhSachBs} />
        <Route path="/quan-ly-lich" component={QuanLyLich} />
        <Route path="/dang-nhap-dang-ky" component={Auth} />
        <Route path="/profile" component={Profile} />
        <Route path="/chat" component={ChatBot} />
        <Route path="/admin" component={AdminLogin} />
        <Route path="/adminPanel" component={AdminPage} />
        <Route path="*" component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
