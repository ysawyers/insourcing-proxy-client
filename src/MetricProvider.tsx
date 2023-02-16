import React from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const funnelMetrics = (Mbps: number) => {};

const calculateSpeed = () => {
  const xhr = new XMLHttpRequest();
  const url = "https://random.imagecdn.app/500/500";
  let startTime: any, endTime;

  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      endTime = new Date().getTime();

      const responseHeader = xhr.getResponseHeader("content-length");
      if (responseHeader !== null) {
        const fileSize = parseInt(responseHeader);
        const downloadTime = endTime - startTime;

        const Mbps = (fileSize * 8) / (downloadTime / 1000) / 1000000;
        funnelMetrics(Mbps);
      }
    }
  };

  startTime = new Date().getTime();
  xhr.send();
};

export const MetricProvider = (): JSX.Element => {
  calculateSpeed();

  return <div />;
};

//
