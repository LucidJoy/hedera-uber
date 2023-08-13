import { useState, useContext, useEffect } from "react";
import { Scanner } from "@codesaursx/react-scanner";
import { useRouter } from "next/router";

import UberContext from "../../context/UberContext";

const QrScanner = ({ isRide }) => {
  const { code, setCode, qrComponent, setQrComponent, acceptPayment } =
    useContext(UberContext);

  useEffect(() => setQrComponent(true), []);

  const router = useRouter();

  useEffect(() => {
    if (code === "http://localhost:3000/anywhere?ride=true") {
      router.push("https://hedera-uber.vercel.app/anywhere?ride=true");
    } else if (
      code ===
      "https://metamask.app.link/send/pay-0xb53A165f344827da29f7d489F549a197F18528d1@296"
    ) {
      acceptPayment();
      router.push("http://localhost:3000/");
    } else {
      code && alert("Invalid QR Code.");
    }
  }, [code]);

  // useEffect(() => {
  //   console.log(code);
  //   code ===
  //     "https://metamask.app.link/send/pay-0xb53A165f344827da29f7d489F549a197F18528d1@296" &&
  //     // router.push(
  //     //   "https://metamask.app.link/send/0xb53A165f344827da29f7d489F549a197F18528d1"
  //     // )
  //     acceptPayment();
  // }, [code]);

  // useEffect(() => {
  //   if (qrComponent === true) {
  //     // acceptPayment();
  //     console.log("hi");
  //   }
  // }, [code]);

  return (
    <div>
      <Scanner
        width='200px'
        height='200px'
        delay={2000}
        onUpdate={(e, data) => {
          if (data) {
            console.log(data.text);
            setCode(data.getText());
            // router.push(data.text);
          }
        }}
      />
      {/* <p>result: {code}</p> */}
    </div>
  );
};

export default QrScanner;
