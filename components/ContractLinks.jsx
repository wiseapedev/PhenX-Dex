import React, {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import twitter from './images/twitter.png';
import telegram from './images/telegram.png';
import etherscan from './images/etherscan.png';
import Image from 'next/image';
import {
  Settings,
  Medium,
  Telegram,
  Twitter,
  YouTube,
  Refresh,
  SaverInfoIcon,
  DownArrow,
  SlippageIcon,
} from './SVGMAIN.js';

const ContractLinks = ({provider, contractAddress}) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchContractSource = async () => {
      if (!provider || !ethers.isAddress(contractAddress)) {
        console.error('Invalid provider or contract address');
        return;
      }
      try {
        // Assuming you have access to an API that gives you the source code
        const response = await fetch(
          `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=1CFUFKF2427DJXC6ERIHXIET8BK6KS5I7P`
        );
        const data = await response.json();
        if (data.result && data.result.length > 0) {
          parseLinks(data.result[0].SourceCode);
        }
      } catch (error) {
        console.error('Error fetching contract source:', error);
      }
    };

    fetchContractSource();
  }, [provider, contractAddress]);

  const parseLinks = (sourceCode) => {
    const linkRegex =
      /(?:www\.|https?:\/\/)([a-zA-Z0-9./]+)|(t\.me\/\S+)|(twitter\.com\/\S+)/g;
    const foundLinks = sourceCode.match(linkRegex) || [];
    const filteredLinks = foundLinks.filter(
      (link) =>
        link.includes('t.me') ||
        link.includes('twitter.com') ||
        link.includes('twitter') ||
        link.includes('X') ||
        link.includes('x.com') ||
        link.includes('Twitter')
    );
    setLinks([...new Set(filteredLinks)]);
  };

  const iconForLink = (link) => {
    if (link.includes('t.me')) {
      return (
        /*         <Image
          src={telegram}
          alt='Telegram'
          layout='intrinsic'
          objectFit='contain'
          width={25}
        /> */
        <div className='icon'>
          <Telegram />
        </div>
      );
    } else if (
      link.includes('twitter.com') ||
      link.includes('twitter') ||
      link.includes('X') ||
      link.includes('x.com') ||
      link.includes('Twitter')
    ) {
      return (
        /*         <Image
          src={twitter}
          alt='Twitter'
          layout='intrinsic'
          objectFit='contain'
          width={25}
        /> */
        <div className='icon'>
          <Twitter />
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className='audit-icons'>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.startsWith('http') ? link : `https://${link}`}
          target='_blank'
          rel='noopener noreferrer'
          style={link.includes('X') ? {opacity: 0.5} : {}}>
          {iconForLink(link)}
        </a>
      ))}
      {/*       <a
        href={`https://etherscan.io/address/${contractAddress}`}
        target='_blank'
        rel='noopener noreferrer'>
        {' '}
        <Image
          src={etherscan}
          alt='Telegram'
          layout='intrinsic'
          objectFit='contain'
          width={25}
        />
      </a> */}
    </div>
  );
};

export default ContractLinks;
