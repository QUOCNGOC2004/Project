import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import '../../css/forHome/lienHe.css'

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
    'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npK7Je1tEbooa3tEGt0S5OoQC71ZhjfJRBvnfqcVCm2hWUAwqutag0-euSeVmBVKVkTn2EbzHsl9tS74lDyo4Su9nHnBmgekSJiDNJ_FnMKqEn9pClu0mGpEXRt7v_ow8VkufL_=w408-h306-k-no',
  anhTruSoChinhSrc:
    'https://phenikaamec.com/_next/image?url=https%3A%2F%2Fcdn.phenikaamec.com%2Fphenikaa-mec%2Fgioi-thieu%2F10-2-2024%2F741ab769-024d-4998-89ba-51e77e8e143c-a%C2%BA%C2%A2nh-gia%C2%BB%C2%9Bi-thia%C2%BB%C2%87u-chung-(1).webp&w=1200&q=75',
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
