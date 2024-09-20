export const SVGMAIN = () => (
  <svg className='sprite' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
      <linearGradient id='grd-svg-2'>
        <stop className='stop3' offset='0%'></stop>
        <stop className='stop4' offset='100%'></stop>
      </linearGradient>
    </defs>
    <defs>
      <g id='i-check'>
        <path
          fill='url(#grd-svg)'
          d='M127.526 15.294L45.665 78.216.863 42.861 0 59.255l44.479 53.862 83.932-81.451z'></path>
      </g>
      <g id='i-check-2'>
        <path
          fill='url(#grd-svg-2)'
          d='M127.526 15.294L45.665 78.216.863 42.861 0 59.255l44.479 53.862 83.932-81.451z'></path>
      </g>
      <g id='i-left'>
        <path d='M207.093 30.187L176.907 0l-128 128 128 128 30.186-30.187L109.28 128z'></path>
      </g>
      <g id='i-right'>
        <path d='M79.093 0L48.907 30.187 146.72 128l-97.813 97.813L79.093 256l128-128z'></path>
      </g>
      <g id='i-telegram'>
        <path
          fill='url(#grd-svg)'
          d='M2.617 15.832l6.44 2.187 15.29-9.348c.222-.136.449.165.258.341L13.03 19.668l-.43 5.965c-.033.454.514.706.838.387l3.564-3.505 6.516 4.932a1.21 1.21 0 0 0 1.909-.703l4.537-20.6c.259-1.175-.893-2.167-2.016-1.736L2.585 14.12c-.796.305-.774 1.438.033 1.712z'></path>
      </g>
      <g id='i-twitter'>
        <path
          fill='url(#grd-svg)'
          d='m89.9 25.2c-3 1.3-6.1 2.2-9.4 2.6 3.4-2 6-5.2 7.2-9.1-3.2 1.9-6.7 3.2-10.4 4-3-3.2-7.3-5.2-12-5.2-9.1 0-16.4 7.4-16.4 16.4 0 1.3.1 2.5.4 3.7-13.6-.6-25.6-7.2-33.7-17.1-5.8 10.4.7 19 5 21.9-2.6 0-5.2-.8-7.4-2 0 8.1 5.7 14.8 13.1 16.3-1.6.5-5.2.8-7.4.3 2.1 6.5 8.2 11.3 15.3 11.4-5.6 4.4-13.8 7.9-24.3 6.8 7.3 4.7 15.9 7.4 25.2 7.4 30.2 0 46.6-25 46.6-46.6 0-.7 0-1.4-.1-2.1 3.4-2.5 6.2-5.4 8.3-8.7z'></path>
      </g>
      <g id='i-medium'>
        <path
          fill='url(#grd-svg)'
          d='M285.6 256c0 72.3-58.3 131-130.1 131S25.3 328.3 25.3 256s58.3-131 130.1-131c71.9 0 130.2 58.7 130.2 131m142.7 0c0 68.1-29.1 123.3-65.1 123.3s-65.1-55.2-65.1-123.3 29.1-123.3 65.1-123.3 65.1 55.2 65.1 123.3m58.4 0c0 61-10.2 110.5-22.9 110.5-12.6 0-22.9-49.5-22.9-110.5s10.2-110.5 22.9-110.5c12.6 0 22.9 49.5 22.9 110.5'></path>
      </g>
      <g id='i-youtube'>
        <path
          fill='url(#grd-svg)'
          d='M82.287 45.907c-.937-4.071-4.267-7.074-8.275-7.521-9.489-1.06-19.098-1.065-28.66-1.06-9.566-.005-19.173 0-28.665 1.06-4.006.448-7.334 3.451-8.27 7.521-1.334 5.797-1.35 12.125-1.35 18.094s0 12.296 1.334 18.093c.936 4.07 4.264 7.073 8.272 7.521 9.49 1.061 19.097 1.065 28.662 1.061 9.566.005 19.171 0 28.664-1.061 4.006-.448 7.336-3.451 8.272-7.521 1.333-5.797 1.34-12.124 1.34-18.093s.009-12.297-1.324-18.094zM28.9 50.4h-5.54v29.438h-5.146V50.4h-5.439v-4.822H28.9zm13.977 29.439h-4.629v-2.785c-1.839 2.108-3.585 3.136-5.286 3.136-1.491 0-2.517-.604-2.98-1.897-.252-.772-.408-1.994-.408-3.796V54.311h4.625v18.795c0 1.084 0 1.647.042 1.799.111.718.462 1.082 1.082 1.082.928 0 1.898-.715 2.924-2.166v-19.51h4.629zm17.573-7.662c0 2.361-.159 4.062-.468 5.144-.618 1.899-1.855 2.869-3.695 2.869-1.646 0-3.234-.914-4.781-2.824v2.474h-4.625V45.578h4.625v11.189c1.494-1.839 3.08-2.769 4.781-2.769 1.84 0 3.078.969 3.695 2.88.311 1.027.468 2.715.468 5.132zm17.457-4.259h-9.251v4.525c0 2.363.773 3.543 2.363 3.543 1.139 0 1.802-.619 2.066-1.855.043-.251.104-1.279.104-3.134h4.719v.675c0 1.491-.057 2.518-.099 2.98a6.59 6.59 0 0 1-1.08 2.771c-1.281 1.854-3.179 2.768-5.595 2.768s-4.262-.871-5.599-2.614c-.981-1.278-1.485-3.29-1.485-6.003v-8.941c0-2.729.447-4.725 1.43-6.015 1.336-1.747 3.177-2.617 5.54-2.617 2.321 0 4.161.87 5.457 2.617.969 1.29 1.432 3.286 1.432 6.015v5.285zm-6.929-9.755c-1.546 0-2.321 1.181-2.321 3.541v2.362h4.625v-2.362c-.001-2.36-.774-3.541-2.304-3.541zm-17.166 0c-.762 0-1.534.36-2.307 1.125v15.559c.772.774 1.545 1.14 2.307 1.14 1.334 0 2.012-1.14 2.012-3.445V61.646c0-2.302-.678-3.483-2.012-3.483zm2.584-23.19c1.705 0 3.479-1.036 5.34-3.168v2.814h4.675V8.82h-4.675v19.718c-1.036 1.464-2.018 2.188-2.953 2.188-.626 0-.994-.37-1.096-1.095-.057-.153-.057-.722-.057-1.817V8.82h-4.66v20.4c0 1.822.156 3.055.414 3.836.47 1.307 1.507 1.917 3.012 1.917zM23.851 20.598v14.021h5.184V20.598L35.271 0h-5.242l-3.537 13.595L22.812 0h-5.455l3.323 9.646c1.663 4.828 2.701 8.468 3.171 10.952zm18.368 14.375c2.342 0 4.162-.881 5.453-2.641.981-1.291 1.451-3.325 1.451-6.067v-9.034c0-2.758-.469-4.774-1.451-6.077-1.291-1.765-3.11-2.646-5.453-2.646-2.33 0-4.149.881-5.443 2.646-.993 1.303-1.463 3.319-1.463 6.077v9.034c0 2.742.47 4.776 1.463 6.067 1.293 1.76 3.113 2.641 5.443 2.641zm-2.231-18.679c0-2.387.724-3.577 2.231-3.577s2.229 1.189 2.229 3.577v10.852c0 2.387-.722 3.581-2.229 3.581s-2.231-1.194-2.231-3.581z'></path>
      </g>
      <g id='i-linkedin'>
        <path
          fill='url(#grd-svg)'
          d='M140.9 140.9V93.3c0-23.4-5-41.2-32.3-41.2-13.1 0-21.9 7.1-25.5 14h-.3V54.2H57v86.7h27V98c0-11.4 2.1-22.2 16.2-22.2s14 13 14 23V141zM13.2 54.2h26.9v86.7H13.2zM26.7 11C18.1 11 11 18 11 26.6s7 15.7 15.6 15.7 15.7-7 15.7-15.6v-.2c0-8.5-7-15.5-15.6-15.5z'></path>
      </g>
      <g id='i-x'>
        <path
          fill='url(#grd-svg)'
          d='M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z'></path>
      </g>
    </defs>
  </svg>
);

export const CheckIcon = () => (
  <svg
    viewBox='0 0 128 128'
    xmlns='http://www.w3.org/2000/svg'
    width='30'
    height='30' // Adjust these values to reduce the size
  >
    {' '}
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
    </defs>
    <defs>
      <g id='i-check'>
        <path
          fill='url(#grd-svg)'
          d='M127.526 15.294L45.665 78.216.863 42.861 0 59.255l44.479 53.862 83.932-81.451z'></path>
      </g>
    </defs>
    <use xlinkHref='#i-check'></use>
  </svg>
);
export const LinkedIn = () => (
  <svg viewBox='0 0 186 186' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
    </defs>
    <defs>
      <g id='i-linkedin'>
        <path
          fill='url(#grd-svg)'
          d='M140.9 140.9V93.3c0-23.4-5-41.2-32.3-41.2-13.1 0-21.9 7.1-25.5 14h-.3V54.2H57v86.7h27V98c0-11.4 2.1-22.2 16.2-22.2s14 13 14 23V141zM13.2 54.2h26.9v86.7H13.2zM26.7 11C18.1 11 11 18 11 26.6s7 15.7 15.6 15.7 15.7-7 15.7-15.6v-.2c0-8.5-7-15.5-15.6-15.5z'></path>
      </g>
    </defs>
    <use xlinkHref='#i-linkedin'></use>
  </svg>
);
export const Medium = () => (
  <svg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
    </defs>
    <defs>
      <g id='i-medium'>
        <path
          fill='url(#grd-svg)'
          d='M285.6 256c0 72.3-58.3 131-130.1 131S25.3 328.3 25.3 256s58.3-131 130.1-131c71.9 0 130.2 58.7 130.2 131m142.7 0c0 68.1-29.1 123.3-65.1 123.3s-65.1-55.2-65.1-123.3 29.1-123.3 65.1-123.3 65.1 55.2 65.1 123.3m58.4 0c0 61-10.2 110.5-22.9 110.5-12.6 0-22.9-49.5-22.9-110.5s10.2-110.5 22.9-110.5c12.6 0 22.9 49.5 22.9 110.5'></path>
      </g>
    </defs>
    <use xlinkHref='#i-medium'></use>
  </svg>
);

export const YouTube = () => (
  <svg viewBox='0 0 90.677 90.677' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
    </defs>
    <defs>
      <g id='i-youtube'>
        <path
          fill='url(#grd-svg)'
          d='M82.287 45.907c-.937-4.071-4.267-7.074-8.275-7.521-9.489-1.06-19.098-1.065-28.66-1.06-9.566-.005-19.173 0-28.665 1.06-4.006.448-7.334 3.451-8.27 7.521-1.334 5.797-1.35 12.125-1.35 18.094s0 12.296 1.334 18.093c.936 4.07 4.264 7.073 8.272 7.521 9.49 1.061 19.097 1.065 28.662 1.061 9.566.005 19.171 0 28.664-1.061 4.006-.448 7.336-3.451 8.272-7.521 1.333-5.797 1.34-12.124 1.34-18.093s.009-12.297-1.324-18.094zM28.9 50.4h-5.54v29.438h-5.146V50.4h-5.439v-4.822H28.9zm13.977 29.439h-4.629v-2.785c-1.839 2.108-3.585 3.136-5.286 3.136-1.491 0-2.517-.604-2.98-1.897-.252-.772-.408-1.994-.408-3.796V54.311h4.625v18.795c0 1.084 0 1.647.042 1.799.111.718.462 1.082 1.082 1.082.928 0 1.898-.715 2.924-2.166v-19.51h4.629zm17.573-7.662c0 2.361-.159 4.062-.468 5.144-.618 1.899-1.855 2.869-3.695 2.869-1.646 0-3.234-.914-4.781-2.824v2.474h-4.625V45.578h4.625v11.189c1.494-1.839 3.08-2.769 4.781-2.769 1.84 0 3.078.969 3.695 2.88.311 1.027.468 2.715.468 5.132zm17.457-4.259h-9.251v4.525c0 2.363.773 3.543 2.363 3.543 1.139 0 1.802-.619 2.066-1.855.043-.251.104-1.279.104-3.134h4.719v.675c0 1.491-.057 2.518-.099 2.98a6.59 6.59 0 0 1-1.08 2.771c-1.281 1.854-3.179 2.768-5.595 2.768s-4.262-.871-5.599-2.614c-.981-1.278-1.485-3.29-1.485-6.003v-8.941c0-2.729.447-4.725 1.43-6.015 1.336-1.747 3.177-2.617 5.54-2.617 2.321 0 4.161.87 5.457 2.617.969 1.29 1.432 3.286 1.432 6.015v5.285zm-6.929-9.755c-1.546 0-2.321 1.181-2.321 3.541v2.362h4.625v-2.362c-.001-2.36-.774-3.541-2.304-3.541zm-17.166 0c-.762 0-1.534.36-2.307 1.125v15.559c.772.774 1.545 1.14 2.307 1.14 1.334 0 2.012-1.14 2.012-3.445V61.646c0-2.302-.678-3.483-2.012-3.483zm2.584-23.19c1.705 0 3.479-1.036 5.34-3.168v2.814h4.675V8.82h-4.675v19.718c-1.036 1.464-2.018 2.188-2.953 2.188-.626 0-.994-.37-1.096-1.095-.057-.153-.057-.722-.057-1.817V8.82h-4.66v20.4c0 1.822.156 3.055.414 3.836.47 1.307 1.507 1.917 3.012 1.917zM23.851 20.598v14.021h5.184V20.598L35.271 0h-5.242l-3.537 13.595L22.812 0h-5.455l3.323 9.646c1.663 4.828 2.701 8.468 3.171 10.952zm18.368 14.375c2.342 0 4.162-.881 5.453-2.641.981-1.291 1.451-3.325 1.451-6.067v-9.034c0-2.758-.469-4.774-1.451-6.077-1.291-1.765-3.11-2.646-5.453-2.646-2.33 0-4.149.881-5.443 2.646-.993 1.303-1.463 3.319-1.463 6.077v9.034c0 2.742.47 4.776 1.463 6.067 1.293 1.76 3.113 2.641 5.443 2.641zm-2.231-18.679c0-2.387.724-3.577 2.231-3.577s2.229 1.189 2.229 3.577v10.852c0 2.387-.722 3.581-2.229 3.581s-2.231-1.194-2.231-3.581z'></path>
      </g>
    </defs>
    <use xlinkHref='#i-youtube'></use>
  </svg>
);
export const Telegram = () => (
  <svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
    </defs>
    <g id='i-telegram'>
      <path
        fill='url(#grd-svg)'
        d='M2.617 15.832l6.44 2.187 15.3-9.348c.222-.136.449.165.258.341L13.03 19.668l-.43 5.965c-.033.454.514.706.838.387l3.564-3.505 6.516 4.932a1.21 1.21 0 0 0 1.909-.703l4.537-20.6c.259-1.175-.893-2.167-2.016-1.736L2.585 14.12c-.796.305-.774 1.438.033 1.712z'></path>
    </g>
    <use xlinkHref='#i-telegram'></use>
  </svg>
);
export const Settings = () => (
  <svg
    viewBox='0 0 32 32'
    width='32'
    height='32'
    xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
    </defs>
    <g id='i-settings'>
      <path
        fill='url(#grd-svg)'
        d='M20.83 14.6C19.9 14.06 19.33 13.07 19.33 12C19.33 10.93 19.9 9.93999 20.83 9.39999C20.99 9.29999 21.05 9.1 20.95 8.94L19.28 6.06C19.22 5.95 19.11 5.89001 19 5.89001C18.94 5.89001 18.88 5.91 18.83 5.94C18.37 6.2 17.85 6.34 17.33 6.34C16.8 6.34 16.28 6.19999 15.81 5.92999C14.88 5.38999 14.31 4.41 14.31 3.34C14.31 3.15 14.16 3 13.98 3H10.02C9.83999 3 9.69 3.15 9.69 3.34C9.69 4.41 9.12 5.38999 8.19 5.92999C7.72 6.19999 7.20001 6.34 6.67001 6.34C6.15001 6.34 5.63001 6.2 5.17001 5.94C5.01001 5.84 4.81 5.9 4.72 6.06L3.04001 8.94C3.01001 8.99 3 9.05001 3 9.10001C3 9.22001 3.06001 9.32999 3.17001 9.39999C4.10001 9.93999 4.67001 10.92 4.67001 11.99C4.67001 13.07 4.09999 14.06 3.17999 14.6H3.17001C3.01001 14.7 2.94999 14.9 3.04999 15.06L4.72 17.94C4.78 18.05 4.89 18.11 5 18.11C5.06 18.11 5.12001 18.09 5.17001 18.06C6.11001 17.53 7.26 17.53 8.19 18.07C9.11 18.61 9.67999 19.59 9.67999 20.66C9.67999 20.85 9.82999 21 10.02 21H13.98C14.16 21 14.31 20.85 14.31 20.66C14.31 19.59 14.88 18.61 15.81 18.07C16.28 17.8 16.8 17.66 17.33 17.66C17.85 17.66 18.37 17.8 18.83 18.06C18.99 18.16 19.19 18.1 19.28 17.94L20.96 15.06C20.99 15.01 21 14.95 21 14.9C21 14.78 20.94 14.67 20.83 14.6ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z'></path>
    </g>
    <use xlinkHref='#i-settings'></use>
  </svg>
);
export const Refresh = () => (
  <svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
    </defs>
    <g id='i-refresh'>
      <path
        fill='url(#grd-svg)'
        clipRule='evenodd'
        d='M4.39961 12.5C4.39961 8.30261 7.80225 4.89998 11.9996 4.89998C14.5562 4.89998 16.8192 6.16236 18.1973 8.09998H16.0004C15.5033 8.09998 15.1004 8.50292 15.1004 8.99998C15.1004 9.49703 15.5033 9.89998 16.0004 9.89998H19.7285C19.7417 9.90027 19.755 9.90027 19.7683 9.89998H20.5004C20.9974 9.89998 21.4004 9.49703 21.4004 8.99998V4.49998C21.4004 4.00292 20.9974 3.59998 20.5004 3.59998C20.0033 3.59998 19.6004 4.00292 19.6004 4.49998V6.9685C17.8918 4.62463 15.1244 3.09998 11.9996 3.09998C6.80813 3.09998 2.59961 7.3085 2.59961 12.5C2.59961 17.6915 6.80813 21.9 11.9996 21.9C16.3913 21.9 20.0775 18.8891 21.1108 14.8203C21.2332 14.3385 20.9418 13.8488 20.4601 13.7264C19.9783 13.6041 19.4886 13.8954 19.3662 14.3772C18.5307 17.6672 15.5481 20.1 11.9996 20.1C7.80225 20.1 4.39961 16.6973 4.39961 12.5Z'></path>{' '}
    </g>
    <use xlinkHref='#i-refresh'></use>
  </svg>
);
export const SaverInfoIcon = () => (
  <svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
    </defs>
    <g id='i-saver'>
      <path
        fill='url(#grd-svg)'
        clipRule='evenodd'
        d='M15.3078 1.77827C15.7064 1.39599 16.3395 1.40923 16.7217 1.80783L20.9689 6.23633C21.2428 6.47474 21.4729 6.76205 21.6459 7.08464C21.8481 7.43172 22 7.84819 22 8.32698V16.7012C22 18.2484 20.7455 19.5 19.2 19.5C17.6536 19.5 16.4 18.2464 16.4 16.7V14.3999C16.4 13.8476 15.9523 13.3999 15.4 13.3999H14V20.5C14 20.569 13.9965 20.6372 13.9897 20.7045C13.9515 21.08 13.8095 21.4249 13.5927 21.7098C13.2274 22.19 12.6499 22.5 12 22.5H4C3.30964 22.5 2.70098 22.1502 2.34157 21.6182C2.12592 21.299 2.00001 20.9142 2 20.5V5.4999C2 3.84305 3.34315 2.4999 5 2.4999H11C12.6569 2.4999 14 3.84305 14 5.4999V11.3999H15.4C17.0569 11.3999 18.4 12.7431 18.4 14.3999V16.7C18.4 17.1418 18.7582 17.5 19.2 17.5C19.6427 17.5 20 17.1422 20 16.7012V11.3292C19.6872 11.4397 19.3506 11.4999 19 11.4999C17.3431 11.4999 16 10.1568 16 8.4999C16 7.28851 16.718 6.24482 17.7517 5.77117L15.2783 3.19217C14.896 2.79357 14.9092 2.16055 15.3078 1.77827ZM19.6098 7.70731C19.441 7.57725 19.2296 7.4999 19 7.4999C18.4477 7.4999 18 7.94762 18 8.4999C18 9.05219 18.4477 9.4999 19 9.4999C19.5523 9.4999 20 9.05219 20 8.4999C20 8.34084 19.9629 8.19045 19.8968 8.05693C19.8303 7.95164 19.7349 7.83559 19.6098 7.70731ZM5.21572 4.72463C4.66343 4.72463 4.21572 5.17235 4.21572 5.72463V9.72463C4.21572 10.2769 4.66343 10.7246 5.21572 10.7246H10.7157C11.268 10.7246 11.7157 10.2769 11.7157 9.72463V5.72463C11.7157 5.17235 11.268 4.72463 10.7157 4.72463H5.21572Z'></path>{' '}
    </g>
    <use xlinkHref='#i-saver'></use>
  </svg>
);

export const SlippageIcon = () => (
  <svg viewBox='0 0 27 27' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
    </defs>
    <defs>
      <g id='i-SlippageIcon'>
        <path
          fill='url(#grd-svg)'
          d='M19.95 4.8C19.2 4.42 18.37 4 17 4C15.63 4 14.8 4.42 14.05 4.8C13.4 5.12 12.87 5.4 12 5.4C11.1 5.4 10.6 5.15 9.95 4.8C9.2 4.43 8.38 4 7 4C5.62 4 4.8 4.42 4.05 4.8C3.67263 4.99159 3.33909 5.16295 2.95347 5.27299C2.44098 5.41925 2 5.83204 2 6.365C2 6.89795 2.43551 7.34084 2.96084 7.25103C3.78633 7.10991 4.39549 6.80356 4.95 6.53C5.6 6.2 6.12 5.93 7 5.93C7.88 5.93 8.4 6.18 9.05 6.53C9.8 6.91 10.62 7.33 12 7.33C13.38 7.33 14.2 6.9 14.95 6.53C15.6 6.21 16.13 5.93 17 5.93C17.9 5.93 18.4 6.18 19.05 6.53C19.6041 6.81076 20.202 7.11336 21.029 7.25226C21.56 7.34145 22 6.89348 22 6.355C22 5.81652 21.5548 5.40161 21.0353 5.25985C20.6526 5.15542 20.3265 4.99113 19.95 4.8Z'></path>
        <path
          fill='url(#grd-svg)'
          d='M14.05 10.8C14.8 10.43 15.65 10 17 10C18.35 10 19.2 10.42 19.95 10.8C20.3266 11.0028 20.6528 11.172 21.0356 11.2784C21.5544 11.4227 22 11.8365 22 12.375C22 12.9135 21.56 13.3615 21.029 13.2723C20.202 13.1334 19.6041 12.8308 19.05 12.55C18.4 12.2 17.9 11.95 17 11.95C16.13 11.95 15.6 12.23 14.95 12.55C14.2 12.92 13.38 13.35 12 13.35C10.6288 13.35 9.81051 12.9354 9.0644 12.5573L9.05 12.55C8.4 12.2 7.87 11.95 7 11.95C6.13 11.95 5.6 12.23 4.95 12.55C4.39771 12.8225 3.79119 13.1275 2.97072 13.2693C2.44011 13.3611 2 12.9135 2 12.375C2 11.8365 2.44562 11.4227 2.9644 11.2784C3.34722 11.172 3.67344 11.0028 4.05 10.8C4.8 10.43 5.62 10 7 10C8.37117 10 9.18949 10.4146 9.9356 10.7927L9.95 10.8C10.6 11.15 11.1 11.4 12 11.4C12.9 11.4 13.4 11.15 14.05 10.8Z'></path>
        <path
          d='M14.05 16.8C14.8 16.43 15.65 16 17 16C18.35 16 19.2 16.42 19.95 16.8C20.3266 17.0028 20.6528 17.172 21.0356 17.2784C21.5544 17.4227 22 17.8365 22 18.375C22 18.9135 21.56 19.3615 21.029 19.2723C20.202 19.1334 19.6041 18.8308 19.05 18.55C18.4 18.2 17.9 17.95 17 17.95C16.13 17.95 15.6 18.23 14.95 18.55C14.2 18.92 13.38 19.35 12 19.35C10.6288 19.35 9.81051 18.9354 9.0644 18.5573L9.05 18.55C8.4 18.2 7.87 17.95 7 17.95C6.13 17.95 5.6 18.23 4.95 18.55C4.39771 18.8225 3.79119 19.1275 2.97072 19.2693C2.44011 19.3611 2 18.9135 2 18.375C2 17.8365 2.44562 17.4227 2.9644 17.2784C3.34722 17.172 3.67344 17.0028 4.05 16.8C4.8 16.43 5.62 16 7 16C8.37117 16 9.18949 16.4146 9.9356 16.7927L9.95 16.8C10.6 17.15 11.1 17.4 12 17.4C12.9 17.4 13.4 17.15 14.05 16.8Z'
          fill='url(#grd-svg)'
        />
      </g>
    </defs>
    <use xlinkHref='#i-SlippageIcon'></use>
  </svg>
);

export const Twitter = () => (
  <svg viewBox='0 0 27 27' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
    </defs>
    <defs>
      <g id='i-x'>
        <path
          fill='url(#grd-svg)'
          d='M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z'></path>
      </g>
    </defs>
    <use xlinkHref='#i-x'></use>
  </svg>
);
export const DownArrow = () => (
  <svg
    width={12}
    height={7}
    viewBox='0 0 12 7'
    xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <linearGradient id='grd-svg'>
        <stop className='stop1' offset='0%'></stop>
        <stop className='stop2' offset='100%'></stop>
      </linearGradient>
    </defs>
    <defs>
      <g id='i-da'>
        <path fill='url(#grd-svg)' d='M0.97168 1L6.20532 6L11.439 1'></path>
      </g>
    </defs>
    <use xlinkHref='#i-da'></use>
  </svg>
);
