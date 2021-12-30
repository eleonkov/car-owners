import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Iframe from "react-iframe";
import "react-tabs/style/react-tabs.css";

const App = () => {
  const [state, setState] = useState([]);

  useEffect(() => {
    if (window._sharedData) {
      setState(window._sharedData);
    }
  }, []);

  const renderContentCard = (type, sortBy) => {
    const sharedContent = state
      .sort((a, b) => b.insight[sortBy] - a.insight[sortBy])
      .filter((edge) => edge.typename === type);

    return (
      <div className="grid-container">
        {sharedContent.map((edge) => (
          <div key={edge.shortcode} class={`grid-item ${edge.typename}`}>
            <iframe
              src={`https://www.instagram.com/p/${edge.shortcode}/embed`}
              id={edge.shortcode}
              key={edge.shortcode}
              width="100%"
              height="400px"
              frameborder="0"
              scrolling="no"
              allowtransparency="true"
            ></iframe>
          </div>
        ))}
      </div>
    );
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
  );
};

export default App;
