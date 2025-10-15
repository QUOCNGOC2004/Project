import React, { useState, Fragment } from 'react'

import PropTypes from 'prop-types'

import './features25.css'

const Features25 = (props) => {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <div className="thq-section-padding">
      <div className="features25-container2 thq-section-max-width">
        <div className="features25-tabs-menu">
          <div
            onClick={() => setActiveTab(0)}
            className="features25-tab-horizontal1"
          >
            <div className="features25-divider-container1">
              {activeTab === 0 && <div className="features25-container3"></div>}
            </div>
            <div className="features25-content1">
              <h2 className="thq-heading-2">
                {props.tieuDe1 ?? (
                  <Fragment>
                    <span className="features25-text4">
                      Giao diện thân thiện với người dùng
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.moTa1 ?? (
                  <Fragment>
                    <span className="features25-text2">
                      Website của chúng tôi cung cấp giao diện thân thiện giúp dễ dàng điều hướng và đặt lịch một cách thuận tiện.
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
          <div
            onClick={() => setActiveTab(1)}
            className="features25-tab-horizontal2"
          >
            <div className="features25-divider-container2">
              {activeTab === 1 && <div className="features25-container4"></div>}
            </div>
            <div className="features25-content2">
              <h2 className="thq-heading-2">
                {props.tieuDe2 ?? (
                  <Fragment>
                    <span className="features25-text3">
                      Lọc theo chuyên khoa và lịch trống
                    </span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.moTa2 ?? (
                  <Fragment>
                    <span className="features25-text5">
                      Dễ dàng lọc danh sách bác sĩ theo chuyên khoa và lịch trống để tìm bác sĩ phù hợp với nhu cầu của bạn.
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
          <div
            onClick={() => setActiveTab(2)}
            className="features25-tab-horizontal3"
          >
            <div className="features25-divider-container3">
              {activeTab === 2 && <div className="features25-container5"></div>}
            </div>
            <div className="features25-content3">
              <h2 className="thq-heading-2">
                {props.tieuDe3 ?? (
                  <Fragment>
                    <span className="features25-text6">Thiết kế phản hồi</span>
                  </Fragment>
                )}
              </h2>
              <span className="thq-body-small">
                {props.moTa3 ?? (
                  <Fragment>
                    <span className="features25-text1">
                      Trải nghiệm giao diện thích ứng với mọi kích thước màn hình, đảm bảo trải nghiệm nhất quán trên mọi thiết bị.
                    </span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="features25-image-container">
          {activeTab === 0 && (
            <img
              alt={props.hinhAnh1Alt}
              src={props.hinhAnh1Src}
              className="features25-image1 thq-img-ratio-16-9"
            />
          )}
          {activeTab === 1 && (
            <img
              alt={props.hinhAnh2Alt}
              src={props.hinhAnh2Src}
              className="features25-image2 thq-img-ratio-16-9"
            />
          )}
          {activeTab === 2 && (
            <img
              alt={props.hinhAnh3Alt}
              src={props.hinhAnh3Src}
              className="features25-image3 thq-img-ratio-16-9"
            />
          )}
        </div>
      </div>
    </div>
  )
}

Features25.defaultProps = {
  moTa3: undefined,
  hinhAnh1Alt: 'Hình ảnh giao diện thân thiện',
  moTa1: undefined,
  hinhAnh3Alt: 'Hình ảnh thanh toán tiện lợi',
  tieuDe2: undefined,
  tieuDe1: undefined,
  hinhAnh1Src:
    'https://subiz.com.vn/blog/wp-content/uploads/2023/12/subiz-trang-web-than-thien-voi-nguoi-dung-e1703588784483.png',
  hinhAnh3Src:
    'https://png.pngtree.com/element_our/20200610/ourlarge/pngtree-mobile-payment-successful-payment-image_2250250.jpg',
  moTa2: undefined,
  tieuDe3: undefined,
  hinhAnh2Alt: 'Hình ảnh lọc theo chuyên khoa và lịch trống',
  hinhAnh2Src:
    'https://media.istockphoto.com/id/1213515925/vi/vec-to/kh%C3%A1i-ni%E1%BB%87m-c%E1%BB%A7a-%C4%91%E1%BB%99i-ng%C5%A9-y-t%E1%BA%BF.jpg?s=612x612&w=0&k=20&c=Cx2WpYwUG_hu71r2-sZkV6ae8DlTuonaM64t8vmHsSI=',
}

Features25.propTypes = {
  moTa3: PropTypes.element,
  hinhAnh1Alt: PropTypes.string,
  moTa1: PropTypes.element,
  hinhAnh3Alt: PropTypes.string,
  tieuDe2: PropTypes.element,
  tieuDe1: PropTypes.element,
  hinhAnh1Src: PropTypes.string,
  hinhAnh3Src: PropTypes.string,
  moTa2: PropTypes.element,
  tieuDe3: PropTypes.element,
  hinhAnh2Alt: PropTypes.string,
  hinhAnh2Src: PropTypes.string,
}

export default Features25
