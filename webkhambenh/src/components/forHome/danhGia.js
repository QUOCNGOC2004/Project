import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './danhGia.css'

const DanhGia = (props) => {
  return (
    <div className="thq-section-padding">
      <div className="testimonial17-max-width thq-section-max-width">
        <div className="testimonial17-container10">
          <h2 className="thq-heading-2">
            {props.tieuDe ?? (
              <Fragment>
                <span className="testimonial17-text35">
                  Phản hồi từ bệnh nhân
                </span>
              </Fragment>
            )}
          </h2>
          <span className="testimonial17-text11 thq-body-small">
            {props.noiDung ?? (
              <Fragment>
                <span className="testimonial17-text32">
                  Đọc những chia sẻ từ bệnh nhân về trải nghiệm của họ với dịch vụ y tế của chúng tôi.
                </span>
              </Fragment>
            )}
          </span>
        </div>
        <div className="thq-grid-2">
          <div className="thq-animated-card-bg-2">
            <div className="thq-animated-card-bg-1">
              <div
                data-animated="true"
                className="thq-card testimonial17-card1"
              >
                <div className="testimonial17-container12">
                  <img
                    alt={props.hinhAnh1Alt}
                    src={props.hinhAnh1Src}
                    className="testimonial17-image1"
                  />
                  <div className="testimonial17-container13">
                    <strong className="thq-body-large">
                      {props.tenNguoi1 ?? (
                        <Fragment>
                          <span className="testimonial17-text26">Nguyễn Văn A</span>
                        </Fragment>
                      )}
                    </strong>
                    <span className="thq-body-small">
                      {props.ngheNghiep1 ?? (
                        <Fragment>
                          <span className="testimonial17-text25">
                            Kỹ sư phần mềm
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
                <span className="testimonial17-text14 thq-body-small">
                  {props.danhGia1 ?? (
                    <Fragment>
                      <span className="testimonial17-text34">
                        Tôi đã có trải nghiệm tuyệt vời khi đặt lịch khám qua website này. Quy trình đơn giản và hiệu quả.
                      </span>
                    </Fragment>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="thq-animated-card-bg-2">
            <div className="thq-animated-card-bg-1">
              <div
                data-animated="true"
                className="thq-card testimonial17-card2"
              >
                <div className="testimonial17-container14">
                  <img
                    alt={props.hinhAnh2Alt}
                    src={props.hinhAnh2Src}
                    className="testimonial17-image2"
                  />
                  <div className="testimonial17-container15">
                    <strong className="thq-body-large">
                      {props.tenNguoi2 ?? (
                        <Fragment>
                          <span className="testimonial17-text29">
                            Lê Thị B
                          </span>
                        </Fragment>
                      )}
                    </strong>
                    <span className="thq-body-small">
                      {props.ngheNghiep2 ?? (
                        <Fragment>
                          <span className="testimonial17-text24">Giáo viên</span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
                <span className="testimonial17-text17 thq-body-small">
                  {props.danhGia2 ?? (
                    <Fragment>
                      <span className="testimonial17-text28">
                        Khả năng lọc bác sĩ theo chuyên khoa giúp tôi dễ dàng tìm được bác sĩ phù hợp với nhu cầu của mình.
                      </span>
                    </Fragment>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="thq-animated-card-bg-2">
            <div className="thq-animated-card-bg-1">
              <div
                data-animated="true"
                className="thq-card testimonial17-card3"
              >
                <div className="testimonial17-container16">
                  <img
                    alt={props.hinhAnh3Alt}
                    src={props.hinhAnh3Src}
                    className="testimonial17-image3"
                  />
                  <div className="testimonial17-container17">
                    <strong className="thq-body-large">
                      {props.tenNguoi3 ?? (
                        <Fragment>
                          <span className="testimonial17-text27">
                            Trần Văn C
                          </span>
                        </Fragment>
                      )}
                    </strong>
                    <span className="thq-body-small">
                      {props.ngheNghiep3 ?? (
                        <Fragment>
                          <span className="testimonial17-text33">
                            Quản lý Marketing
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
                <span className="testimonial17-text20 thq-body-small">
                  {props.danhGia3 ?? (
                    <Fragment>
                      <span className="testimonial17-text36">
                        Tôi rất khuyến nghị nền tảng này cho bất kỳ ai muốn đặt lịch khám bệnh trực tuyến. Nó thân thiện và tiện lợi.
                      </span>
                    </Fragment>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="thq-animated-card-bg-2">
            <div className="thq-animated-card-bg-1">
              <div
                data-animated="true"
                className="thq-card testimonial17-card4"
              >
                <div className="testimonial17-container18">
                  <img
                    alt={props.hinhAnh4Alt}
                    src={props.hinhAnh4Src}
                    className="testimonial17-image4"
                  />
                  <div className="testimonial17-container19">
                    <strong className="thq-body-large">
                      {props.tenNguoi4 ?? (
                        <Fragment>
                          <span className="testimonial17-text31">
                            Phạm Thị D
                          </span>
                        </Fragment>
                      )}
                    </strong>
                    <span className="thq-body-small">
                      {props.ngheNghiep4 ?? (
                        <Fragment>
                          <span className="testimonial17-text30">Y tá</span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                </div>
                <span className="testimonial17-text23 thq-body-small">
                  {props.danhGia4 ?? (
                    <Fragment>
                      <span className="testimonial17-text37">
                        Là một chuyên gia y tế, tôi đánh giá cao hiệu quả và độ chính xác của hệ thống đặt lịch trên website này.
                      </span>
                    </Fragment>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

DanhGia.defaultProps = {
  ngheNghiep2: undefined,
  ngheNghiep1: undefined,
  hinhAnh3Alt: 'Hình ảnh Trần Văn C',
  tenNguoi1: undefined,
  hinhAnh1Src:
    'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-2.jpg',
  tenNguoi3: undefined,
  danhGia2: undefined,
  tenNguoi2: undefined,
  ngheNghiep4: undefined,
  tenNguoi4: undefined,
  hinhAnh4Src:
    'https://img.lovepik.com/element/40121/0265.png_860.png',
  hinhAnh1Alt: 'Hình ảnh Nguyễn Văn A',
  hinhAnh2Src:
    'https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-7.jpg',
  hinhAnh3Src:
    'https://phanmemmkt.vn/wp-content/uploads/2024/09/Hinh-anh-dai-dien-mac-dinh-Facebook.jpg',
  hinhAnh2Alt: 'Hình ảnh Lê Thị B',
  hinhAnh4Alt: 'Hình ảnh Phạm Thị D',
  noiDung: undefined,
  ngheNghiep3: undefined,
  danhGia1: undefined,
  tieuDe: undefined,
  danhGia3: undefined,
  danhGia4: undefined,
}

DanhGia.propTypes = {
  ngheNghiep2: PropTypes.element,
  ngheNghiep1: PropTypes.element,
  hinhAnh3Alt: PropTypes.string,
  tenNguoi1: PropTypes.element,
  hinhAnh1Src: PropTypes.string,
  tenNguoi3: PropTypes.element,
  danhGia2: PropTypes.element,
  tenNguoi2: PropTypes.element,
  ngheNghiep4: PropTypes.element,
  tenNguoi4: PropTypes.element,
  hinhAnh4Src: PropTypes.string,
  hinhAnh1Alt: PropTypes.string,
  hinhAnh2Src: PropTypes.string,
  hinhAnh3Src: PropTypes.string,
  hinhAnh2Alt: PropTypes.string,
  hinhAnh4Alt: PropTypes.string,
  noiDung: PropTypes.element,
  ngheNghiep3: PropTypes.element,
  danhGia1: PropTypes.element,
  tieuDe: PropTypes.element,
  danhGia3: PropTypes.element,
  danhGia4: PropTypes.element,
}

export default DanhGia
