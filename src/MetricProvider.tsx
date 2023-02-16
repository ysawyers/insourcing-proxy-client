import React from "react";

export const MetricProvider = (): JSX.Element => {
  setInterval(() => {
    console.log("Hello World");
  }, 1000);

  return <div />;
};
