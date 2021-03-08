import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const App = () => {
  const [state, setState] = useState([]);

  useEffect(() => {
    if (window._sharedData) {
      setState(window._sharedData)
    }
  }, []);

  const renderContentCard = (type, sortBy) => {
    const sharedContent = state.sort((a, b) => b.insight[sortBy] - a.insight[sortBy])
      .filter(edge => edge.typename === type);

    return (
      <div className="grid-container">
        {sharedContent.map(edge => (
          <div key={edge.shortcode} class={`grid-item ${edge.typename}`}>
            <span>Comments: {edge.insight.comments}<br/>Likes: {edge.insight.likes}</span>
            <a target="_blank" href={`https://www.instagram.com/p/${edge.shortcode}/`}>
              <img src={edge.thumbnail} />
            </a>
          </div>
        ))}
      </div>
    )
  };

  return (
    <Tabs>
      <TabList>
        <Tab>Reels</Tab>
        <Tab>Video</Tab>
        <Tab>Sidecar</Tab>
        <Tab>Image</Tab>
      </TabList>
      <TabPanel>
        <h2>Reels</h2>
        {renderContentCard("Reels", "likes")}
      </TabPanel>
      <TabPanel>
        <h2>Video</h2>
        {renderContentCard("GraphVideo", "views")}
      </TabPanel>
      <TabPanel>
        <h2>Sidecar</h2>
        {renderContentCard("GraphSidecar", "likes")}
      </TabPanel>
      <TabPanel>
        <h2>Image</h2>
        {renderContentCard("GraphImage", "likes")}
      </TabPanel>
    </Tabs>
  )
}

export default App;
