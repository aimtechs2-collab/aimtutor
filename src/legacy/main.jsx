import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { HeadProvider } from "react-head";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeadProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HeadProvider>
  </StrictMode>,
)
