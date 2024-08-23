// pages/index.tsx
import {ConnectButton} from '@rainbow-me/rainbowkit';
import type {NextPage} from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>PhenX</title>
        <meta content='PhenX' name='PhenX' />
      </Head>
      <Layout buyLink={undefined} buyLinkKey={undefined} />
    </>
  );
};

export default Home;
