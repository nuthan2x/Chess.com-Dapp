import React,{useState, useEffect} from 'react'
import {NavLink} from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = (props) => {


  return (
    <div className='nav'>
      <nav className='navbar'>
          
      
          <div className='navlinks'>
              <img src="https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/php2z9LbY.png" alt="" />
              <div className='links'>
                  <NavLink to='/' className={ props.activelink === "0" ? "activenavlink" : "navlink"} onClick={() => props.setactivelink("0")}>
                    home
                  </NavLink>
                  <NavLink to='/myaccount' className={ props.activelink === "3" ? "activenavlink" : "navlink"} onClick={() => props.setactivelink("3")}>
                    myaccount
                  </NavLink>
                  <NavLink to='/market' className={ props.activelink === "2" ? "activenavlink" : "navlink"} onClick={() => props.setactivelink("2")}>
                    market
                  </NavLink>
                   
              </div>
          </div>
      
          <div className="connectwallet">
              <ConnectButton showBalance={false} 
                  accountStatus={{
                      smallScreen: 'address',
                      largeScreen: 'full',
                  }}
              />
          </div>
      </nav>
    </div >
  )
}

export default Navbar




// const Navbar = () => {

//   return (
//     <nav className='navbar'>

//       <NavLink to='/' className={({ isActive }) => { setindexactive(isActive ? true :false ) ; return (indexactive ? 'link active' : 'link')}}>
//         home
//       </NavLink>
//       <NavLink to='/about' className={({ isActive }) => {isActive && setindexactive(false); return (isActive ? 'link active' : 'link')}}>
//         About
//       </NavLink>  
//       <NavLink to='/products' className={({ isActive }) =>{isActive && setindexactive(false); return (isActive ? 'link active' : 'link')}}>
//         Products
//       </NavLink>
//       <NavLink to='/login' className={({ isActive }) =>{isActive && setindexactive(false); return (isActive ? 'link active' : 'link')}}>
//         Login
//       </NavLink>
//     </nav>
//   )
// }

