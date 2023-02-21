import React from "react";
// import useWebSocket from "react-use-websocket";
import { useCookies } from "react-cookie";

// NOTE: This is in ms
const pingInterval = 5000;

let totalSum = 0;
let entries = 0;

const calculateSpeed = (setCookie: any) => {
  const xhr = new XMLHttpRequest();
  const url = "https://random.imagecdn.app/1000/1000";
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
        totalSum += Mbps;
        entries += 1;

        console.log(totalSum / entries);

        setCookie("avgLatency", totalSum / entries, { path: "/" });
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
  const [cookies, setCookie] = useCookies(["avgLatency"]);

  // const { sendMessage } = useWebSocket(socketUrl, {
  //   onOpen: () => console.log("opened connection"),
  // });

  React.useEffect(() => {
    setInterval(() => {
      calculateSpeed(setCookie);
    }, pingInterval);
  }, []);

  return <div />;
};
