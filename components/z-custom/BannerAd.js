import {useState, useEffect} from 'react';
import Image from 'next/image';
import banner from './banner.png';

function BannerAd() {
  const [index, setIndex] = useState(0);

  const images = [
    {
      url: banner,
      link: 'https://t.me/alpharadarbot_chat', // Update with the desired link for the second image
      alt: 'Banner 2',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 20000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className='banner-ad-container mobhide'>
      <a className='banner-ad' target='_blank' href={images[index].link}>
        <Image src={images[index].url} alt={images[index].alt} width={250} />
      </a>
    </div>
  );
}

export default BannerAd;
