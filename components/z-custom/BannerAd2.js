import {useState, useEffect} from 'react';
import Image from 'next/image';

function BannerAd2() {
  return;
  const [index, setIndex] = useState(0);

  const images = [
    {
      url: banner1,
      link: 'https://t.me/IntelliQuantVerify/3', // Update with the desired link for the second image
      alt: 'Banner 2',
    },

    {
      url: banner4,
      link: 'https://t.me/Stellary_AI', // Update with the desired link for the third image
      alt: 'Banner 3',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className='banner-ad-container'>
      <a className='banner-ad' target='_blank' href={images[index].link}>
        <Image
          src={images[index].url}
          alt={images[index].alt}
          layout='intrinsic'
          width={330}
          style={{
            borderRadius: '10px',
          }}
        />
      </a>
    </div>
  );
}

export default BannerAd2;
