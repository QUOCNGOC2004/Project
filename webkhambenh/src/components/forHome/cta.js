import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './cta.css'

const CTA = (props) => {
  return (
    <div className="thq-section-padding">
      <div className="thq-section-max-width">
        <div className="cta26-accent2-bg">
          <div className="cta26-accent1-bg">
            <div className="cta26-container2">
              <div className="cta26-content">
                <span className="thq-heading-2">
                  {props.heading1 ?? (
                    <Fragment>
                      <span className="cta26-text4">
                        Đặt lịch khám ngay hôm nay
                      </span>
                    </Fragment>
                  )}
                </span>
                <p className="thq-body-large">
                  {props.content1 ?? (
                    <Fragment>
                      <span className="cta26-text5">
                        Hãy chọn bác sĩ phù hợp với bạn và đặt lịch khám ngay
                        hôm nay để được phục vụ tốt nhất.
                      </span>
                    </Fragment>
                  )}
                </p>
              </div>
              <a href={props.lienKetDatLich}>
                <div className="cta26-actions">
                  <button
                    type="button"
                    className="thq-button-filled cta26-button"
                  >
                    <span>
                      {props.action1 ?? (
                        <Fragment>
                          <span className="cta26-text6">Đặt lịch khám</span>
                        </Fragment>
                      )}
                    </span>
                  </button>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CTA.defaultProps = {
  heading1: undefined,
  content1: undefined,
  action1: undefined,
  lienKetDatLich: '/dat-lich',
}

CTA.propTypes = {
  heading1: PropTypes.element,
  content1: PropTypes.element,
  action1: PropTypes.element,
  lienKetDatLich: PropTypes.string,
}

export default CTA
