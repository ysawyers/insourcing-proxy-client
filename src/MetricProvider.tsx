import React from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const funnelMetrics = (socketUrl: string, Mbps: number) => {
  console.log(socketUrl);
  console.log(Mbps);
};

const calculateSpeed = (socketUrl: string) => {
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
        funnelMetrics(socketUrl, Mbps);
      }
    }
  };

  startTime = new Date().getTime();
  xhr.send();
};

export const MetricProvider = ({
  socketUrl,
}: {
  socketUrl: string;
}): JSX.Element => {
  calculateSpeed(socketUrl);

  const { sendMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened connection"),
  });
  sendMessage("message");

  return <div />;
};
