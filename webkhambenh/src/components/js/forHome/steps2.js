import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import '../../css/forHome/steps2.css'

const Steps2 = (props) => {
  return (
    <div className="steps2-container1 thq-section-padding">
      <div className="steps2-max-width thq-section-max-width">
        <div className="steps2-container2 thq-grid-2">
          <div className="steps2-section-header">
            <h2 className="thq-heading-2">
              Dễ dàng quản lý lịch hẹn cá nhân
            </h2>
            <p className="thq-body-large">
              Theo dõi và quản lý lịch hẹn khám bệnh của bạn một cách thuận tiện. Xem lịch sử khám bệnh, nhận thông báo nhắc lịch, và dễ dàng hủy hoặc thay đổi lịch hẹn khi cần thiết.
            </p>
            <a href={props.lienKetQuanLyLich}>
              <div className="steps2-actions">
                <button className="thq-button-animated thq-button-filled steps2-button">
                  <span className="thq-body-small">Quản lý lịch hẹn</span>
                </button>
              </div>
            </a>
          </div>
          <div className="steps2-container3">
            <div className="steps2-container4 thq-card">
              <h2 className="thq-heading-2">
                {props.tieuDe1 ?? (
                  <Fragment>
                    <span className="steps2-text29">Trang chủ</span>
                  </Fragment>
                )}
              </h2>
              <span className="steps2-text14 thq-body-small">
                {props.moTa1 ?? (
                  <Fragment>
                    <span className="steps2-text25">
                      Giới thiệu website và mục đích sử dụng cho người dùng.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps2-text15 thq-heading-3">01</label>
            </div>
            <div className="steps2-container5 thq-card">
              <h2 className="thq-heading-2">
                {props.tieuDe2 ?? (
                  <Fragment>
                    <span className="steps2-text27">Trang đăng nhập/Đăng ký</span>
                  </Fragment>
                )}
              </h2>
              <span className="steps2-text17 thq-body-small">
                {props.moTa2 ?? (
                  <Fragment>
                    <span className="steps2-text28">
                      Cho phép người dùng tạo tài khoản hoặc đăng nhập để truy cập các tính năng bổ sung.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps2-text18 thq-heading-3">02</label>
            </div>
            <div className="steps2-container6 thq-card">
              <h2 className="thq-heading-2">
                {props.tieuDe3 ?? (
                  <Fragment>
                    <span className="steps2-text30">Danh sách bác sĩ</span>
                  </Fragment>
                )}
              </h2>
              <span className="steps2-text20 thq-body-small">
                {props.moTa3 ?? (
                  <Fragment>
                    <span className="steps2-text26">
                      Hiển thị danh sách bác sĩ với tùy chọn lọc theo chuyên khoa và lịch trống.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps2-text21 thq-heading-3">03</label>
            </div>
            <div className="steps2-container7 thq-card">
              <h2 className="thq-heading-2">
                {props.tieuDe4 ?? (
                  <Fragment>
                    <span className="steps2-text32">Trang chi tiết bác sĩ</span>
                  </Fragment>
                )}
              </h2>
              <span className="steps2-text23 thq-body-small">
                {props.moTa4 ?? (
                  <Fragment>
                    <span className="steps2-text31">
                      Cung cấp thông tin chi tiết về bác sĩ bao gồm hồ sơ, lịch làm việc và đánh giá.
                    </span>
                  </Fragment>
                )}
              </span>
              <label className="steps2-text24 thq-heading-3">04</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Steps2.defaultProps = {
  moTa1: undefined,
  moTa3: undefined,
  tieuDe2: undefined,
  moTa2: undefined,
  tieuDe1: undefined,
  tieuDe3: undefined,
  moTa4: undefined,
  tieuDe4: undefined,
  lienKetQuanLyLich: "/quan-ly-lich",
}

Steps2.propTypes = {
  moTa1: PropTypes.element,
  moTa3: PropTypes.element,
  tieuDe2: PropTypes.element,
  moTa2: PropTypes.element,
  tieuDe1: PropTypes.element,
  tieuDe3: PropTypes.element,
  moTa4: PropTypes.element,
  tieuDe4: PropTypes.element,
  lienKetQuanLyLich: PropTypes.string
}

export default Steps2
