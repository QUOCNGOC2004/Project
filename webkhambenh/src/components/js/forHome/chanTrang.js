import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import '../../css/forHome/chanTrang.css'

const ChanTrang = (props) => {
  return (
    <footer className="footer4-footer7 thq-section-padding">
      <div className="footer4-max-width thq-section-max-width">
        <div className="footer4-content">
          <div className="footer4-logo1">
            <img
              alt={props.logoAlt}
              src={props.logoSrc}
              className="footer4-logo2"
            />
          </div>
          <div className="footer4-links">
            <span className="thq-body-small">
              {props.link1 ?? (
                <Fragment>
                  <span className="footer4-text16">Trang chủ</span>
                </Fragment>
              )}
            </span>
            <span className="thq-body-small">
              {props.link2 ?? (
                <Fragment>
                  <span className="footer4-text18">Đăng nhập/Đăng ký</span>
                </Fragment>
              )}
            </span>
            <span className="thq-body-small">
              {props.link3 ?? (
                <Fragment>
                  <span className="footer4-text15">Danh sách bác sĩ</span>
                </Fragment>
              )}
            </span>
            <span className="thq-body-small">
              {props.link4 ?? (
                <Fragment>
                  <span className="footer4-text19">
                    Trang quản lý lịch đã đặt
                  </span>
                </Fragment>
              )}
            </span>
            <span className="thq-body-small">
              {props.link5 ?? (
                <Fragment>
                  <span className="footer4-text14">Liên hệ</span>
                </Fragment>
              )}
            </span>
          </div>
        </div>
        <div className="footer4-credits">
          <div className="thq-divider-horizontal"></div>
          <div className="footer4-row">
            <div className="footer4-container">
              <span className="thq-body-small">Nhóm 13 - Ứng dụng phân tán</span>
            </div>
            <div className="footer4-footer-links">
              <span className="footer4-text11 thq-body-small">
                {props.privacyLink ?? (
                  <Fragment>
                    <span className="footer4-text21">Chính sách bảo mật</span>
                  </Fragment>
                )}
              </span>
              <span className="thq-body-small">
                {props.termsLink ?? (
                  <Fragment>
                    <span className="footer4-text17">Điều khoản sử dụng</span>
                  </Fragment>
                )}
              </span>
              <span className="thq-body-small">
                {props.cookiesLink ?? (
                  <Fragment>
                    <span className="footer4-text20">Chính sách cookie</span>
                  </Fragment>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

ChanTrang.defaultProps = {
  link5: undefined,
  link3: undefined,
  link1: undefined,
  termsLink: undefined,
  link2: undefined,
  link4: undefined,
  logoAlt: 'Logo của trang web',
  cookiesLink: undefined,
  logoSrc: 'https://library.phenikaa-uni.edu.vn/sites/default/files/logo_vn.png',
  privacyLink: undefined,
}

ChanTrang.propTypes = {
  link5: PropTypes.element,
  link3: PropTypes.element,
  link1: PropTypes.element,
  termsLink: PropTypes.element,
  link2: PropTypes.element,
  link4: PropTypes.element,
  logoAlt: PropTypes.string,
  cookiesLink: PropTypes.element,
  logoSrc: PropTypes.string,
  privacyLink: PropTypes.element,
}

export default ChanTrang
