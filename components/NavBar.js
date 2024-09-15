import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

function NavBar() {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState('');

  // Set active class based on current route
  useEffect(() => {
    if (router.pathname === '/') {
      setActiveLink('home');
    } else if (router.pathname === '/stake') {
      setActiveLink('stake');
    }
  }, [router.pathname]);

  // Navigation handlers
  const goToHome = () => {
    router.push('/');
  };

  const goToStake = () => {
    router.push('/stake');
  };

  return (
    <div className='nav-container'>
      <div className='nav-left'>
        <img src={'/logo.png'} className='logo-image' />
        {/*         <div className='beta-container'>
          <div className='logo-text mobhide'>Phenx </div>
        </div> */}
        <div className='nav-buttons'>
          <div
            onClick={goToHome}
            className={`nav-button ${
              activeLink === 'home' ? 'nav-active' : ''
            }`}>
            Trade
          </div>
          <div
            onClick={goToStake}
            className={`nav-button ${
              activeLink === 'stake' ? 'nav-active' : ''
            }`}>
            Stake
          </div>
        </div>
      </div>
      <div className='nav-right'>
        <w3m-button label='Connect' size='sm' />
      </div>
    </div>
  );
}

export default NavBar;
