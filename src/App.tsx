import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layout";
import "./theme/index.scss";
import { DataProvider } from "./store/DataContext";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <MainLayout />
        </ErrorBoundary>
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;
