import React from "react";
import { Provider } from "react-redux";
import App from './layout';
import store from "./store";

export default function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
