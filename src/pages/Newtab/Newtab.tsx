import React from 'react';
import './Newtab.css';
import CollectionLoader from './components/CollectionLoader';
import ThemeProvider from './context/ThemeProvider';
import Layout from './components/Layout';

const Newtab = () => {
  // chrome.storage.local.get(function(result){console.log(result)})
  // chrome.storage.local.clear();

  return (
    <ThemeProvider>
      <Layout>
        <CollectionLoader />
      </Layout>
    </ThemeProvider>
  );
};

export default Newtab;
