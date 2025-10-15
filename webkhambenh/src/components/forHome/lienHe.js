import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './lienHe.css'

const LienHe  = (props) => {
  // Encode địa chỉ để sử dụng trong URL Google Maps
  const getGoogleMapsUrl = (address) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }

  return (
    <div className="contact10-container1 thq-section-padding">
      <div className="contact10-max-width thq-section-max-width">
        <div className="contact10-content1 thq-flex-row">
          <div className="contact10-content2">
            <h2 className="thq-heading-2">
              {props.tieuDe1 ?? (
                <Fragment>
                  <span className="contact10-text18">Liên Hệ Với Chúng Tôi</span>
                </Fragment>
              )}
            </h2>
            <p className="thq-body-large">
              {props.noiDung1 ?? (
                <Fragment>
                  <span className="contact10-text16">
                    Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn.
                  </span>
                </Fragment>
              )}
            </p>
          </div>
        </div>
        <div className="contact10-content3 thq-flex-row">
          <div className="contact10-container2">
            <img
              alt={props.anhTruSoChinh}
              src={props.anhTruSoChinhSrc}
              className="contact10-image1 thq-img-ratio-16-9"
            />
            <h3 className="contact10-text12 thq-heading-3">
              {props.truSoChinh ?? (
                <Fragment>
                  <span className="contact10-text20">Trụ Sở Chính</span>
                </Fragment>
              )}
            </h3>
            <p className="thq-body-large">
              {props.moTaTruSoChinh ?? (
                <Fragment>
                  <span className="contact10-text17">
                    123 Đường Chính, Thành Phố, Quốc Gia
                  </span>
                </Fragment>
              )}
            </p>
            <div className="contact10-container3">
              <a
                href={getGoogleMapsUrl(props.moTaTruSoChinh?.props?.children?.[0]?.props?.children ?? 'Bệnh viện Đại Học Phenikaa')}
                target="_blank"
                rel="noreferrer noopener"
                className="thq-button-flat thq-body-small"
              >
                Chỉ đường
              </a>
            </div>
          </div>
          <div className="contact10-container4">
            <img
              alt={props.anhChiNhanh}
              src={props.anhChiNhanhSrc}
              className="contact10-image2 thq-img-ratio-16-9"
            />
            <h3 className="contact10-text14 thq-heading-3">
              {props.chiNhanh ?? (
                <Fragment>
                  <span className="contact10-text21">Chi Nhánh</span>
                </Fragment>
              )}
            </h3>
            <p className="thq-body-large">
              {props.moTaChiNhanh ?? (
                <Fragment>
                  <span className="contact10-text19">
                    456 Đại Lộ Công Viên, Thành Phố, Quốc Gia
                  </span>
                </Fragment>
              )}
            </p>
            <div className="contact10-container5">
              <a
                href={getGoogleMapsUrl(props.moTaChiNhanh?.props?.children?.[0]?.props?.children ?? 'Đại học Phenikaa')}
                target="_blank"
                rel="noreferrer noopener"
                className="thq-button-flat thq-body-small"
              >
                Chỉ đường
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

LienHe.defaultProps = {
  noiDung1: undefined,
  anhChiNhanhSrc:
    'https://phenikaa-uni.edu.vn:3600/pu/vi/posts/nhung-buoc-phat-trien-vung-chac-cua-truong-dai-hoc-phenikaa.jpg',
  anhTruSoChinhSrc:
    'https://phenikaa-uni.edu.vn:3600/hs/vi/posts/djifly202407020912041801719891290906photo.jpg',
  moTaTruSoChinh: undefined,
  anhChiNhanh: 'Ảnh Chi Nhánh',
  tieuDe1: undefined,
  moTaChiNhanh: undefined,
  anhTruSoChinh: 'Ảnh Trụ Sở Chính',
  truSoChinh: undefined,
  chiNhanh: undefined,
}

LienHe.propTypes = {
  noiDung1: PropTypes.element,
  anhChiNhanhSrc: PropTypes.string,
  anhTruSoChinhSrc: PropTypes.string,
  moTaTruSoChinh: PropTypes.element,
  anhChiNhanh: PropTypes.string,
  tieuDe1: PropTypes.element,
  moTaChiNhanh: PropTypes.element,
  anhTruSoChinh: PropTypes.string,
  truSoChinh: PropTypes.element,
  chiNhanh: PropTypes.element,
}

export default LienHe
