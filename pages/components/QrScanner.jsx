import { useState, useContext, useEffect } from "react";
import { Scanner } from "@codesaursx/react-scanner";
import { useRouter } from "next/router";

import UberContext from "../../context/UberContext";

const QrScanner = () => {
  const { code, setCode } = useContext(UberContext);

  const router = useRouter();

  useEffect(
    () =>
      code &&
      router.push(
        "https://metamask.app.link/send/0xb53A165f344827da29f7d489F549a197F18528d1"
      ),
    [code]
  );

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
