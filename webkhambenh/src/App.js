import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './views/js/home'; 
import ThanhToan from './views/js/ThanhToan';
import DatLich from './views/js/DatLich';
import DanhSachBs from './views/js/DanhSachBs';
import QuanLyLich from './views/js/QuanLyLich';
import NotFound from './views/js/not-found';
import Auth from './views/js/Auth';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} /> 
        <Route path="/thanh-toan" component={ThanhToan} />
        <Route path="/dat-lich" component={DatLich} />
        <Route path="/danh-sach-bs" component={DanhSachBs} />
        <Route path="/quan-ly-lich" component={QuanLyLich} />
        <Route path="/dang-nhap-dang-ky" component={Auth} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;