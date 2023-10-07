import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layout";
import "./theme/index.scss";
import { DataProvider } from "./store/DataContext";

const App = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;
