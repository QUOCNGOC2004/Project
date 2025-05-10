import React, { useState, Fragment } from 'react'

import PropTypes from 'prop-types'

import '../../css/forHome/features24.css'

const Features24 = (props) => {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <div className="thq-section-padding">
      <div className="features24-container2 thq-section-max-width">
        <div className="features24-image-container">
          {activeTab === 0 && (
            <img
              alt={props.hinhAnh1Alt}
              src={props.hinhAnh1Src}
              className="features24-image1 thq-img-ratio-16-9"
            />
          )}
          {activeTab === 1 && (
            <img
              alt={props.hinhAnh2Alt}
              src={props.hinhAnh2Src}
              className="features24-image2 thq-img-ratio-16-9"
            />
          )}
          {activeTab === 2 && (
            <img
              alt={props.hinhAnh3Alt}
              src={props.hinhAnh3Src}
              className="features24-image3 thq-img-ratio-16-9"
            />
          )}
        </div>
        <div className="features24-tabs-menu">
          <div
            onClick={() => setActiveTab(0)}
            className="features24-tab-horizontal1"
          >
            <div className="features24-divider-container1">
              {activeTab === 0 && <div className="features24-container3"></div>}
            </div>
            <div className="features24-content1">
              <h2 className="thq-heading-2">
                {props.tieuDe1 ?? (
                  <Fragment>
                    <span className="features24-text4">
                      Giao diện thân thiện với người dùng
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.moTa1 ?? (
                  <Fragment>
                    <span className="features24-text5">
                      Thiết kế hiện đại và phản hồi nhanh cho trải nghiệm người dùng mượt mà
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
          <div
            onClick={() => setActiveTab(1)}
            className="features24-tab-horizontal2"
          >
            <div className="features24-divider-container2">
              {activeTab === 1 && <div className="features24-container4"></div>}
            </div>
            <div className="features24-content2">
              <h2 className="thq-heading-2">
                {props.tieuDe2 ?? (
                  <Fragment>
                    <span className="features24-text6">Tìm kiếm bác sĩ</span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.moTa2 ?? (
                  <Fragment>
                    <span className="features24-text3">
                      Khám phá danh sách bác sĩ với bộ lọc theo chuyên khoa và lịch hẹn
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
          <div
            onClick={() => setActiveTab(2)}
            className="features24-tab-horizontal3"
          >
            <div className="features24-divider-container3">
              {activeTab === 2 && <div className="features24-container5"></div>}
            </div>
            <div className="features24-content3">
              <h2 className="thq-heading-2">
                {props.tieuDe3 ?? (
                  <Fragment>
                    <span className="features24-text2">Đặt lịch hẹn</span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.moTa3 ?? (
                  <Fragment>
                    <span className="features24-text1">
                      Xem lịch hẹn của bác sĩ và đặt lịch dễ dàng
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Features24.defaultProps = {
  hinhAnh1Alt: 'Hình ảnh bác sĩ',
  moTa3: undefined,
  tieuDe3: undefined,
  hinhAnh3Src:
    'https://nld.mediacdn.vn/2019/10/7/20160301110559-1570438043637325659617.jpg',
  hinhAnh1Src:
    'https://worldcare.vn/assets/images/doctors/doctor-image-remove-background.png',
  moTa2: undefined,
  tieuDe1: undefined,
  hinhAnh3Alt: 'Hình ảnh đợi đến lượt khám bệnh',
  moTa1: undefined,
  hinhAnh2Src:
    'https://bcp.cdnchinhphu.vn/Uploaded/dothanhhoai/2017_12_13/kham%20benh1.jpg',
  hinhAnh2Alt: 'Hình ảnh lịch trống',
  tieuDe2: undefined,
}

Features24.propTypes = {
  hinhAnh1Alt: PropTypes.string,
  moTa3: PropTypes.element,
  tieuDe3: PropTypes.element,
  hinhAnh3Src: PropTypes.string,
  hinhAnh1Src: PropTypes.string,
  moTa2: PropTypes.element,
  tieuDe1: PropTypes.element,
  hinhAnh3Alt: PropTypes.string,
  moTa1: PropTypes.element,
  hinhAnh2Src: PropTypes.string,
  hinhAnh2Alt: PropTypes.string,
  tieuDe2: PropTypes.element,
}

export default Features24
