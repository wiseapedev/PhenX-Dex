/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState, useRef} from 'react';
import {useRouter} from 'next/router';
import useIsMobile from '../hooks/useIsMobile'; // Corrected the typo in the import
import NavIcon from './svgs/NavIcon'; // Corrected the typo in the import
import {motion, AnimatePresence} from 'framer-motion';

function NavBar() {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState('home');

  // Use the custom hook to determine if the device is mobile
  const isMobile = useIsMobile();

  // Set active class based on current route
  useEffect(() => {
    if (router.pathname === '/') {
      setActiveLink('home');
    } else if (router.pathname === '/stake') {
      setActiveLink('stake');
    } else if (router.pathname === '/listing') {
      setActiveLink('listing');
    }
  }, [router.pathname]);

  // Navigation handlers
  const goToHome = () => {
    router.push('/');
  };

  const goToStake = () => {
    router.push('/stake');
  };
  const goToListing = () => {
    router.push('/listing');
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  // Ref for the dropdown menu
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    console.log('Dropdown state:', isDropdownOpen);
  };
  // Conditional rendering based on isMobile

  if (isMobile) {
    // Mobile Navbar
    return (
      <>
        <div className='nav-container'>
          <div className='nav-left'>
            {/*             <img src={'/logo.png'} className='logo-image' alt='Logo' />
             */}
            <div className='nav-icon' onClick={toggleDropdown}>
              <NavIcon />
            </div>
          </div>
          <div className='nav-right'>
            {/*             <w3m-network-button size='md' label='▼' />{' '}
             */}{' '}
            <w3m-button label='Connect' size='md' />
          </div>

          {/* Dropdown Menu */}
        </div>{' '}
        <div className='dropdown-menu-container'>
          <div
            ref={dropdownRef}
            className={`dropdown-menu ${
              isDropdownOpen ? 'dropdown-open' : 'dropdown-closed'
            }`}>
            <div
              onClick={goToHome}
              className={`dropdown-item ${
                activeLink === 'home' ? 'dropdown-active' : ''
              }`}>
              Swap
            </div>
            <div
              onClick={goToStake}
              className={`dropdown-item ${
                activeLink === 'stake' ? 'dropdown-active' : ''
              }`}>
              Stake
            </div>
            <div
              onClick={goToListing}
              className={`dropdown-item ${
                activeLink === 'listing' ? 'dropdown-active' : ''
              }`}>
              Listing
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className='nav-container'>
        <div className='nav-left'>
          {/*           <img src={'/logo.png'} className='logo-image' />
           */}{' '}
          {/* Desktop-specific navbar content */}
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
            <div
              onClick={goToListing}
              className={`nav-button ${
                activeLink === 'listing' ? 'nav-active' : ''
              }`}>
              Listing
            </div>
          </div>
        </div>
        <div className='nav-right'>
          <w3m-network-button />

          <w3m-button label='Connect' size='sm' />
        </div>
      </div>
    );
  }
}

export default NavBar;
