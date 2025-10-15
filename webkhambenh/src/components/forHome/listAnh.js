import React, { Fragment } from 'react'
import Script from 'dangerous-html/react'
import PropTypes from 'prop-types'

import './listAnh.css'

const ListAnh = (props) => {
  return (
    <div className="hero17-header78">
      <div className="hero17-column thq-section-padding thq-section-max-width">
        <div className="hero17-content1">
          <h1 className="hero17-text1 thq-heading-1">
            {props.tieuDe ?? (
              <Fragment>
                <span className="hero17-text7">
                  Chào mừng đến với Hệ thống đặt lịch khám bệnh trực tuyến
                </span>
              </Fragment>
            )}
          </h1>
          <p className="hero17-text2 thq-body-large">
            {props.noiDung ?? (
              <Fragment>
                <span className="hero17-text8">
                  Đặt lịch khám bệnh dễ dàng chỉ với vài cú nhấp chuột. Tìm bác sĩ phù hợp với nhu cầu của bạn và quản lý lịch hẹn một cách thuận tiện.
                </span>
              </Fragment>
            )}
          </p>
        </div>
        <div className="hero17-actions">
          <a href={props.lienKetChatBot}>
            <button className="thq-button-filled hero17-button1">
              <span className="thq-body-small">
                {props.nutChinh ?? (
                  <Fragment>
                    <span className="hero17-text6">Hỏi Chat bot</span>
                  </Fragment>
                )}
              </span>
            </button>
          </a>
          <a href={props.lienKetTimBS}>
            <button className="thq-button-outline hero17-button2">
              <span className="thq-body-small">
                {props.nutPhu ?? (
                  <Fragment>
                    <span className="hero17-text5">Tìm bác sĩ</span>
                  </Fragment>
                )}
              </span>
            </button>
          </a>
        </div>
      </div>
      <div className="hero17-content2">
        <div className="hero17-row-container1 thq-animated-group-container-horizontal thq-mask-image-horizontal">
          <div className="thq-animated-group-horizontal">
            <img
              alt={props.image1Alt}
              src={props.image1Src}
              className="hero17-placeholder-image10 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image2Alt}
              src={props.image2Src}
              className="hero17-placeholder-image11 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image3Alt}
              src={props.image3Src}
              className="hero17-placeholder-image12 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image4Alt}
              src={props.image4Src}
              className="hero17-placeholder-image13 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image5Alt}
              src={props.image5Src}
              className="hero17-placeholder-image14 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image6Alt}
              src={props.image6Src}
              className="hero17-placeholder-image15 thq-img-scale thq-img-ratio-1-1"
            />
          </div>
          <div className="thq-animated-group-horizontal">
            <img
              alt={props.image1Alt}
              src={props.image1Src}
              className="hero17-placeholder-image16 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image2Alt}
              src={props.image2Src}
              className="hero17-placeholder-image17 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image3Alt}
              src={props.image3Src}
              className="hero17-placeholder-image18 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image4Alt}
              src={props.image4Src}
              className="hero17-placeholder-image19 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image5Alt}
              src={props.image5Src}
              className="hero17-placeholder-image20 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt="Hero Image"
              src="https://images.unsplash.com/photo-1534312527009-56c7016453e6?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDIxfHxhYnN0cmFjdHxlbnwwfHx8fDE3MTA4NzA5MzB8MA&amp;ixlib=rb-4.0.3&amp;w=1500"
              className="hero17-placeholder-image21 thq-img-scale thq-img-ratio-1-1"
            />
          </div>
        </div>
        <div className="hero17-row-container2 thq-animated-group-container-horizontal thq-mask-image-horizontal">
          <div className="thq-animated-group-horizontal-reverse">
            <img
              alt={props.image7Alt}
              src={props.image7Src}
              className="hero17-placeholder-image22 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image8Alt}
              src={props.image8Src}
              className="hero17-placeholder-image23 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image9Alt}
              src={props.image9Src}
              className="hero17-placeholder-image24 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image10Alt}
              src={props.image10Src}
              className="hero17-placeholder-image25 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image11Alt}
              src={props.image11Src}
              className="hero17-placeholder-image26 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image12Alt}
              src={props.image12Src}
              className="hero17-placeholder-image27 thq-img-scale thq-img-ratio-1-1"
            />
          </div>
          <div className="thq-animated-group-horizontal-reverse">
            <img
              alt={props.image7Alt}
              src={props.image7Src}
              className="hero17-placeholder-image28 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image8Alt}
              src={props.image8Src}
              className="hero17-placeholder-image29 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image9Alt}
              src={props.image9Src}
              className="hero17-placeholder-image30 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image10Alt}
              src={props.image10Src}
              className="hero17-placeholder-image31 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt={props.image11Alt}
              src={props.image11Src}
              className="hero17-placeholder-image32 thq-img-scale thq-img-ratio-1-1"
            />
            <img
              alt="Hero Image"
              src="https://images.unsplash.com/photo-1568214379698-8aeb8c6c6ac8?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDEyfHxncmFmaWN8ZW58MHx8fHwxNzE1Nzk0OTk5fDA&amp;ixlib=rb-4.0.3&amp;w=1500"
              className="hero17-placeholder-image33 thq-img-scale thq-img-ratio-1-1"
            />
          </div>
        </div>
      </div>
      <div>
        <div className="hero17-container2">
          <Script
            html={`<style>
  @keyframes scroll-x {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - 16px));
    }
  }

  @keyframes scroll-y {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-100% - 16px));
    }
  }
</style>
`}
          ></Script>
        </div>
      </div>
    </div>
  )
}

ListAnh.defaultProps = {
  image3Src:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSBXhp_AiWPXZnUMRNWO-Js-zUxYY3o0C5ow&s',
  image8Alt: 'Hero Image',
  image2Src:
    'https://phenikaa-uni.edu.vn:3600/pu/vi/posts/ldh8770.jpg',
  image6Alt: 'Hero Image',
  image11Src:
    'https://giadinh.phenikaa.com/wp-content/uploads/2023/11/z4919661580419_184e64379360e52660e732212dbe734d.jpg',
  image5Alt: 'Hero Image',
  image1Alt: 'Doctor with patient',
  image7Src:
    'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2024/6/26/2-1719369319067948038979.jpg',
  image7Alt: 'Hero Image',
  image12Alt: 'Hero Image',
  image2Alt: 'Calendar',
  image6Src:
    'https://phenikaa-uni.edu.vn:3600/pu/vi/posts/dsc00085.jpg',
  image12Src:
    'https://giadinh.phenikaa.com/wp-content/uploads/2023/10/394411851_783911837077925_858415320901022008_n.jpg',
  image3Alt: 'Hero Image',
  image9Src:
    'https://giadinh.mediacdn.vn/zoom/700_438/296230595582509056/2025/2/26/avatar1740538920502-1740538920957236578117.jpg',
  image11Alt: 'Hero Image',
  action2: undefined,
  action1: undefined,
  image8Src:
    'https://phenikaa-uni.edu.vn:3600/pu/vi/posts/kykhoa00989-compressed.jpg',
  image5Src:
    'https://phenikaa-uni.edu.vn:3600/fn/vi/posts/anh-title.jpg',
  image4Src:
    'https://vcdn1-vnexpress.vnecdn.net/2023/07/14/image003-7397-1689327306.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=Gf67p9m_j67uZf_PHOYrZQ',
  image10Alt: 'Hero Image',
  image4Alt: 'Hero Image',
  heading1: undefined,
  content1: undefined,
  image10Src:
    'https://phenikaa-uni.edu.vn:3600/pu/vi/gian-thong-tin-phenikaa-thu-hut-dong-dao-bac-si-tre-tai-nang-tai-ngay-hoi-viec-lam/dsc1363-enhanced-nr.jpg',
  image9Alt: 'Hero Image',
  image1Src:
    'https://nld.mediacdn.vn/291774122806476800/2025/4/16/anh-chup-man-hinh-2025-04-16-luc-172821-1744799608713885340391.png',
  nutPhu: undefined,
  nutChinh: undefined,
  tieuDe: undefined,
  noiDung: undefined,
  lienKetChatBot: '/chat',
  lienKetTimBS: '/danh-sach-bs'
}

ListAnh.propTypes = {
  image3Src: PropTypes.string,
  image8Alt: PropTypes.string,
  image2Src: PropTypes.string,
  image6Alt: PropTypes.string,
  image11Src: PropTypes.string,
  image5Alt: PropTypes.string,
  image1Alt: PropTypes.string,
  image7Src: PropTypes.string,
  image7Alt: PropTypes.string,
  image12Alt: PropTypes.string,
  image2Alt: PropTypes.string,
  image6Src: PropTypes.string,
  image12Src: PropTypes.string,
  image3Alt: PropTypes.string,
  image9Src: PropTypes.string,
  image11Alt: PropTypes.string,
  action2: PropTypes.element,
  action1: PropTypes.element,
  image8Src: PropTypes.string,
  image5Src: PropTypes.string,
  image4Src: PropTypes.string,
  image10Alt: PropTypes.string,
  image4Alt: PropTypes.string,
  heading1: PropTypes.element,
  content1: PropTypes.element,
  image10Src: PropTypes.string,
  image9Alt: PropTypes.string,
  image1Src: PropTypes.string,
  nutPhu: PropTypes.element,
  nutChinh: PropTypes.element,
  tieuDe: PropTypes.element,
  noiDung: PropTypes.element,
  lienKetChatBot: PropTypes.string,
  lienKetTimBS: PropTypes.string
}

export default ListAnh
