const NavIcon = () => {
  return (
    <svg
      viewBox='0 0 18 12'
      fill='none'
      strokeWidth='8'
      style={{
        color: 'rgb(155, 155, 155)',
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        marginLeft: '5px',
      }}>
      <path
        d='M1.5 6H16.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'></path>
      <path
        d='M1.5 1H16.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'></path>
      <path
        d='M1.5 11H16.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'></path>
    </svg>
  );
};

export default NavIcon;
