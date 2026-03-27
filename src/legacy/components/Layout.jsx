import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'

function Layout() {


  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <div className="min-h-screen relative">
        <Header isHome={isHome} />

        {/* Main content */}
        <main>
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  )
}

export default Layout