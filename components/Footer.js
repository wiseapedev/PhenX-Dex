import {
  Settings,
  Medium,
  Telegram,
  Twitter,
  YouTube,
  Refresh,
  SaverInfoIcon,
  DownArrow,
} from './SVGMAIN.js';
import AdComponent from './AdComponent.js';
import useIsMobile from '../hooks/useIsMobile'; // Corrected the typo in the import
import {useRouter} from 'next/router';

function FooterBar() {
  const router = useRouter();

  const isMobile = useIsMobile();

  return (
    <div className='footer-container'>
      <div className='nav-left'>
        <div className='icons-container'>
          <a
            href='https://t.me/Phenxdex'
            title='Telegram'
            target='_blank'
            rel='noopener noreferrer'
            className='icon'>
            <Telegram />
          </a>

          <a
            href='https://twitter.com/Phenxdex'
            title='Twitter'
            target='_blank'
            rel='noopener noreferrer'
            className='icon'>
            <Twitter />
          </a>

          <a
            href='https://twitter.com/Phenxdex'
            title='Medium'
            target='_blank'
            rel='noopener noreferrer'
            className='icon'>
            <Medium />
          </a>
        </div>
      </div>

      <div className='nav-right'>
        <a href='https://t.me/phenxsupport' className='basic-button'>
          SUPPORT
        </a>
      </div>
    </div>
  );
}

export default FooterBar;
