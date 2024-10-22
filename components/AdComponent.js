import React, {useState, useEffect} from 'react';

const AdComponent = ({handleAdChart}) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch('/api/get-ad');
        const data = await response.json();

        // Check if the response contains the 'No active ad found' message
        if (data.message === 'No active ad found') {
          setAd(null);
          return;
        }

        if (response.ok) {
          setAd(data);
        } else {
          console.error('Failed to fetch ad:', data);
        }
      } catch (error) {
        console.error('Error fetching ad:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, []);

  if (loading) return <> </>;

  if (!ad) return <> </>;

  return (
    <div className='ad-container'>
      {' '}
      <div className='ad-close' onClick={() => setAd(null)}>
        <i className='fas fa-times'></i>
      </div>
      <div className='ad-header'>
        <img src={ad.image_url} alt={ad.title} className='ad-image' />
        <div className='ad-details'>
          <h2>{ad.title}</h2>
          <p>{ad.description}</p>
        </div>
      </div>
      <div className='ad-actions'>
        <div
          onClick={() => handleAdChart(ad.symbol)}
          target='_blank'
          rel='noopener noreferrer'
          className='ad-button-chart'>
          <i className='fas fa-chart-line'></i> Chart
        </div>

        <a
          href={ad.website_url}
          target='_blank'
          rel='noopener noreferrer'
          className='ad-button'>
          <i className='fas fa-globe'></i>
        </a>

        <a
          href={ad.twitter_url}
          target='_blank'
          rel='noopener noreferrer'
          className='ad-button'>
          <i className='fab fa-x-twitter'></i> {/* Icon for X (Twitter) */}
        </a>

        <a
          href={ad.telegram_url}
          target='_blank'
          rel='noopener noreferrer'
          className='ad-button'>
          <i className='fab fa-telegram'></i>
        </a>
      </div>
    </div>
  );
};

export default AdComponent;
