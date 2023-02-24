import React from "react";
import useWebSocket from "react-use-websocket";
import { useCookies } from "react-cookie";

// NOTE: This is in ms
const pingInterval = 2500;

let totalSum = 0;
let entries = 0;

const calculateSpeed = (setCookie: any) => {
  let image = new Image();
  let startTime = new Date().getTime();

  image.src = "https://random.imagecdn.app/500/500?" + Date.now();
  image.onload = function () {
    let duration = new Date().getTime() - startTime;
    let bitsLoaded = image.src.length * 8;

    const downloadSpeedKbps = (bitsLoaded * 8 * 1000) / duration;
    const downloadSpeedMbps = downloadSpeedKbps / 1000;

    totalSum += parseFloat(downloadSpeedMbps.toFixed(2));
    entries += 1;

    setCookie("avgLatency", totalSum / entries, { path: "/" });

    if (entries > 12) {
      entries = 0;
      totalSum = 0;
    }
  };
};

export const MetricProvider = ({
  socketUrl,
}: {
  socketUrl: string;
}): JSX.Element => {
  const [cookies, setCookie] = useCookies(["avgLatency", "insourceBranch"]);

  const { sendMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened connection"),
    onMessage: (event) => {
      console.log(event.data);

      setCookie("insourceBranch", "null", { path: "/" });
    },
  });

  React.useEffect(() => {
    setInterval(() => {
      calculateSpeed(setCookie);
    }, pingInterval);
  }, []);

  React.useEffect(() => {
    if (cookies.insourceBranch !== "null") {
      sendMessage(cookies.insourceBranch);
    }
  }, [cookies["insourceBranch"]]);

  return <div />;
};
