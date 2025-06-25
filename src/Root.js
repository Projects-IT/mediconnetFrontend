import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/footer/Footer'
function Root() {
  return (
    <div>
      <Header></Header>
        <div className='' style={{minHeight:'88vh'} }>
            <Outlet></Outlet>
        </div>
        <Footer></Footer>
    </div>
  )
}

export default Root