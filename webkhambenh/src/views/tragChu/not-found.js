import React from 'react'

import { Helmet } from 'react-helmet'

import './not-found.css'

const NotFound = (props) => {
  return (
    <div className="not-found-container1">
      <Helmet>
        <title>404 - Trang không tồn tại</title>
      </Helmet>
      <h3>Xin lỗi! Trang không tồn tại</h3>
      <div className="not-found-container2">
        <h1 className="not-found-text2">404</h1>
      </div>
      <div className="not-found-container3">
        <h2 className="not-found-text3">
          CHÚNG TÔI RẤT TIẾC, NHƯNG TRANG BẠN YÊU CẦU KHÔNG TỒN TẠI
        </h2>
      </div>
    </div>
  )
}

export default NotFound
