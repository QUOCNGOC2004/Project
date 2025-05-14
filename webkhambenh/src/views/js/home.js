import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'

import Navbar8 from '../../components/js/forHome/navbar8'
import ListAnh from '../../components/js/forHome/listAnh'
import Features24 from '../../components/js/forHome/features24'
import CTA from '../../components/js/forHome/cta'
import Features25 from '../../components/js/forHome/features25'
import Steps2 from '../../components/js/forHome/steps2'
import DanhGia from '../../components/js/forHome/danhGia'
import LienHe from '../../components/js/forHome/lienHe'
import ChanTrang from '../../components/js/forHome/chanTrang'
import '../../views/css/home.css'

const Home = (props) => {
  return (
    <div className="home-container">
      <Helmet>
        <title>Hệ thống đặt lịch khám bệnh trực tuyến</title>
        <meta property="og:title" content="Hệ thống đặt lịch khám bệnh trực tuyến" />
      </Helmet>
      <ListAnh
        action2={
          <Fragment>
            <span className="home-text114">Tìm bác sĩ</span>
          </Fragment>
        }
        action1={
          <Fragment>
            <span className="home-text115">Đặt lịch ngay</span>
          </Fragment>
        }
        heading1={
          <Fragment>
            <span className="home-text116">
              Chào mừng đến với Hệ thống đặt lịch khám bệnh trực tuyến
            </span>
          </Fragment>
        }
        content1={
          <Fragment>
            <span className="home-text117">
              Đặt lịch khám bệnh dễ dàng chỉ với vài cú nhấp chuột. Tìm bác sĩ phù hợp với nhu cầu của bạn và quản lý lịch hẹn một cách thuận tiện.
            </span>
          </Fragment>
        }
      ></ListAnh>
      <Features24
        moTa3={
          <Fragment>
            <span className="home-text118">
              Đến đúng thời gian thay vì đợi đến lượt khám bệnh.
            </span>
          </Fragment>
        }
        tieuDe3={
          <Fragment>
            <span className="home-text119">Đặt lịch hẹn</span>
          </Fragment>
        }
        moTa2={
          <Fragment>
            <span className="home-text120">
              Ưu tiên khám bệnh với bác sĩ chuyên khoa phù hợp và lịch trống.
            </span>
          </Fragment>
        }
        tieuDe1={
          <Fragment>
            <span className="home-text121">Đội ngũ bác sĩ tận tâm</span>
          </Fragment>
        }
        moTa1={
          <Fragment>
            <span className="home-text122">
              Đội ngũ bác sĩ tận tâm, chuyên nghiệp và có kinh nghiệm.
            </span>
          </Fragment>
        }
        tieuDe2={
          <Fragment>
            <span className="home-text123">Ưu tiên khám bệnh </span>
          </Fragment>
        }
      ></Features24>
      <CTA
        heading1={
          <Fragment>
            <span className="home-text124">Đặt lịch khám ngay hôm nay</span>
          </Fragment>
        }
        content1={
          <Fragment>
            <span className="home-text125">
              Hãy chọn bác sĩ phù hợp với bạn và đặt lịch khám ngay hôm nay để
              được phục vụ tốt nhất.
            </span>
          </Fragment>
        }
        action1={
          <Fragment>
            <span className="home-text126">Đặt lịch khám</span>
          </Fragment>
        }
      ></CTA>
      <Features25
        moTa3={
          <Fragment>
            <span className="home-text127">
              Chỉ việc đến khám bệnh, không gây mất thời gian.
            </span>
          </Fragment>
        }
        moTa1={
          <Fragment>
            <span className="home-text128">
              Website của chúng tôi cung cấp giao diện thân thiện giúp dễ dàng điều hướng và đặt lịch một cách thuận tiện.
            </span>
          </Fragment>
        }
        tieuDe2={
          <Fragment>
            <span className="home-text129">
              Lọc theo chuyên khoa và lịch trống
            </span>
          </Fragment>
        }
        tieuDe1={
          <Fragment>
            <span className="home-text130">Giao diện thân thiện</span>
          </Fragment>
        }
        moTa2={
          <Fragment>
            <span className="home-text131">
              Dễ dàng lọc danh sách bác sĩ theo chuyên khoa và lịch trống để tìm bác sĩ phù hợp với nhu cầu của bạn.
            </span>
          </Fragment>
        }
        tieuDe3={
          <Fragment>
            <span className="home-text132">Thanh toán tiện lợi</span>
          </Fragment>
        }
      ></Features25>
      
      <Steps2
        moTa1={
          <Fragment>
            <span className="home-text184">
            Trở thành Hệ thống y tế hàn lâm đẳng cấp quốc tế, hướng tới các giá trị Chân – Thiện – Mỹ bằng nghiên cứu đột phá, chất lượng điều trị xuất sắc, dịch vụ chăm sóc hoàn hảo và giáo dục nâng tầm tri thức.
            </span>
          </Fragment>
        }
        moTa3={
          <Fragment>
            <span className="home-text185">
              Chính trực,xuất sắc,tận tâm cống hiến,sáng tạo.
            </span>
          </Fragment>
        }
        tieuDe2={
          <Fragment>
            <span className="home-text186">Sứ mệnh</span>
          </Fragment>
        }
        moTa2={
          <Fragment>
            <span className="home-text187">
            Vì một cộng đồng khỏe mạnh, nhân văn và thông thái hơn bằng tài năng, y đức, lòng trắc ẩn và tinh thần sẵn sàng cống hiến, phụng sự.
            </span>
          </Fragment>
        }
        tieuDe1={
          <Fragment>
            <span className="home-text188">Tầm nhìn</span>
          </Fragment>
        }
        tieuDe3={
          <Fragment>
            <span className="home-text189">Giá trị cốt lõi</span>
          </Fragment>
        }
        moTa4={
          <Fragment>
            <span className="home-text190">
              Hãy trải nghiệm và cảm nhận sự hài lòng từ dịch vụ của chúng tôi.
            </span>
          </Fragment>
        }
        tieuDe4={
          <Fragment>
            <span className="home-text191">Trải nghiệm và cảm nhận</span>
          </Fragment>
        }
      ></Steps2>
      <DanhGia
        ngheNghiep2={
          <Fragment>
            <span className="home-text192">Giáo viên</span>
          </Fragment>
        }
        ngheNghiep1={
          <Fragment>
            <span className="home-text193">Kỹ sư phần mềm</span>
          </Fragment>
        }
        tenNguoi1={
          <Fragment>
            <span className="home-text194">Nguyễn Văn A</span>
          </Fragment>
        }
        tenNguoi3={
          <Fragment>
            <span className="home-text195">Trần Văn C</span>
          </Fragment>
        }
        danhGia2={
          <Fragment>
            <span className="home-text196">
              Khả năng lọc bác sĩ theo chuyên khoa giúp tôi dễ dàng tìm được bác sĩ phù hợp với nhu cầu của mình.
            </span>
          </Fragment>
        }
        tenNguoi2={
          <Fragment>
            <span className="home-text197">Lê Thị B</span>
          </Fragment>
        }
        ngheNghiep4={
          <Fragment>
            <span className="home-text198">Y tá</span>
          </Fragment>
        }
        tenNguoi4={
          <Fragment>
            <span className="home-text199">Phạm Thị D</span>
          </Fragment>
        }
        noiDung={
          <Fragment>
            <span className="home-text200">
              Đọc những chia sẻ từ bệnh nhân về trải nghiệm của họ với dịch vụ y tế của chúng tôi.
            </span>
          </Fragment>
        }
        ngheNghiep3={
          <Fragment>
            <span className="home-text201">Quản lý Marketing</span>
          </Fragment>
        }
        danhGia1={
          <Fragment>
            <span className="home-text202">
              Tôi đã có trải nghiệm tuyệt vời khi đặt lịch khám qua website này. Quy trình đơn giản và hiệu quả.
            </span>
          </Fragment>
        }
        tieuDe={
          <Fragment>
            <span className="home-text203">Phản hồi từ bệnh nhân</span>
          </Fragment>
        }
        danhGia3={
          <Fragment>
            <span className="home-text204">
              Tôi rất khuyến nghị nền tảng này cho bất kỳ ai muốn đặt lịch khám bệnh trực tuyến. Nó thân thiện và tiện lợi.
            </span>
          </Fragment>
        }
        danhGia4={
          <Fragment>
            <span className="home-text205">
              Là một chuyên gia y tế, tôi đánh giá cao hiệu quả và độ chính xác của hệ thống đặt lịch trên website này.
            </span>
          </Fragment>
        }
      ></DanhGia>
      <LienHe
        noiDung1={
          <Fragment>
            <span className="home-text206">
              Liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất.
            </span>
          </Fragment>
        }
        moTaTruSoChinh={
          <Fragment>
            <span className="home-text207">P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội</span>
          </Fragment>
        }
        tieuDe1={
          <Fragment>
            <span className="home-text208">Liên hệ</span>
          </Fragment>
        }
        moTaChiNhanh={
          <Fragment>
            <span className="home-text209">P. Nguyễn Trác, Yên Nghĩa, Hà Đông, Hà Nội</span>
          </Fragment>
        }
        truSoChinh={
          <Fragment>
            <span className="home-text210">Trụ sở chính</span>
          </Fragment>
        }
        chiNhanh={
          <Fragment>
            <span className="home-text211">Chi nhánh</span>
          </Fragment>
        }
      ></LienHe>
      <ChanTrang
        link5={
          <Fragment>
            <span className="home-text212">Liên hệ</span>
          </Fragment>
        }
        link3={
          <Fragment>
            <span className="home-text213">Danh sách bác sĩ</span>
          </Fragment>
        }
        link1={
          <Fragment>
            <span className="home-text214">Trang chủ</span>
          </Fragment>
        }
        termsLink={
          <Fragment>
            <span className="home-text215">Điều khoản sử dụng</span>
          </Fragment>
        }
        link2={
          <Fragment>
            <span className="home-text216">Đăng nhập/Đăng ký</span>
          </Fragment>
        }
        link4={
          <Fragment>
            <span className="home-text217">Trang quản lý lịch đã đặt</span>
          </Fragment>
        }
        cookiesLink={
          <Fragment>
            <span className="home-text218">Chính sách cookie</span>
          </Fragment>
        }
        privacyLink={
          <Fragment>
            <span className="home-text219">Chính sách bảo mật</span>
          </Fragment>
        }
      ></ChanTrang>
    </div>
  )
}

export default Home
