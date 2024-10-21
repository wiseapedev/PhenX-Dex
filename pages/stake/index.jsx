import Swap from './Swap';
import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
export const runtime = 'experimental-edge';
const SwapNoSSR = dynamic(() => import('./Swap'), {
  ssr: false, // This will disable server-side rendering for the Swap component
});

const Layout = () => {
  return <SwapNoSSR />;
};

export default Layout;
