import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import QRCode from "qrcode";

import UberContext from "../context/UberContext";
import Map from "./components/Map";
import { shortenAddress } from "../utils/shortenAddr";
import QrScanner from "./components/QrScanner";

const Anywhere = () => {
  const {
    anywherePrice,
    setAnywherePrice,
    pickup,
    latitute,
    longitute,
    currentUser,
    currentLocation,
    setCurrentLocation,
  } = useContext(UberContext);

  const [intervalActive, setIntervalActive] = useState(true);
  const [stream, setStream] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [rideStart, setRideStart] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const router = useRouter();
  const { ride } = router.query;
  let intervalId;

  useEffect(() => {
    if (ride == true) {
      setRideStart(true);
    }
  }, []);

  // const generateQrCode = () => {
  //   QRCode.toDataURL(
  //     `http://localhost:3000/anywhere?ride=true`,
  //     {
  //       width: 800,
  //       margin: 2,
  //       color: {
  //         light: "#ffffff",
  //         dark: "#161616",
  //       },
  //     },
  //     (err, url) => {
  //       if (err) return console.log(err);

  //       setQrcode(url);
  //       setRideStart(true);
  //       setAnywherePrice(0);
  //     }
  //   );
  // };

  // useEffect(() => {
  //   generateQrCode();
  //   setQrClick(false);
  // }, []);

  useEffect(() => {
    if (intervalActive) {
      intervalId = setInterval(() => {
        setAnywherePrice((prevPrice) => prevPrice + 1);
      }, 2000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [intervalActive]);

  useEffect(() => {
    setRideStart(false);
    setIsFinished(false);
  }, []);

  const stopCount = () => {
    clearInterval(intervalId); // Clear the interval when the button is clicked
    setIntervalActive(false); // Update the interval state
  };

  const videoRef = useRef(null);

  useEffect(() => {
    const constraints = { video: true };

    const openCamera = async () => {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        videoRef.current.srcObject = cameraStream;
        setStream(cameraStream);
      } catch (error) {
        console.error("Error opening camera:", error);
      }
    };

    if (isCameraOpen) {
      openCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOpen]);

  const toggleCamera = () => {
    setIsCameraOpen((prevState) => !prevState);
  };

  return (
    <div className='h-screen flex flex-col'>
      <Map pickupCoordinates={pickup} dropoffCoordinates={null} />

      <div className='flex-1 flex flex-col h-1/2'>
        <div className='flex justify-between items-center'>
          <img
            src='https://i.ibb.co/84stgjq/uber-technologies-new-20218114.jpg'
            className='h-28'
          />

          <p className='mr-[25px] font-semibold'>
            {shortenAddress(currentUser)}
          </p>
        </div>

        <p className='pl-[20px] -mt-[10px] mb-[5px]'>
          Current location:{" "}
          <span className='font-medium'>{currentLocation}</span>
        </p>

        {/* once qr is scanned, make a var true and start the timer */}

        <div className='flex items-center justify-center h-full transition-all duration-300 ease-in-out'>
          {/* {!ride && (
            <div>
              <img
                src={qrcode}
                alt='url'
                width={180}
                height={180}
                className='rounded-[10px]'
              />
            </div>
          )} */}

          {ride && !isFinished && (
            <div className='border-t-[1px] h-full w-full flex items-center justify-center flex-col gap-[20px]'>
              <h1 className='font-semibold'>Price</h1>
              <div className='rounded-full h-[80px] w-[80px] bg-gray-200 -mt-[15px] relative'>
                <p className='flex items-center justify-center w-full h-full font-medium text-[20px]'>
                  {anywherePrice}
                </p>
              </div>

              <p className='absolute right-[650px] top-[590px] text-[20px]'>
                HBAR
              </p>

              <button
                onClick={() => {
                  setIsFinished(true);
                  stopCount();
                  toggleCamera();
                }}
                className='w-fit px-[20px] py-[15px] top-[80px] rounded-[15px] left-4 z-10 bg-white shadow-md font-medium text-[16px] border hover:bg-slate-50 transition-all duration-200 ease-in-out'
              >
                Finish Ride
              </button>
            </div>
          )}

          {ride && isFinished && (
            <div className='flex items-center justify-center'>
              {/* <video
                ref={videoRef}
                autoPlay
                playsInline
                className='h-full w-[200px]'
              /> */}

              <QrScanner />
            </div>
          )}

          {!ride && (
            <>
              {isCameraOpen ? (
                <div className='flex items-center justify-center gap-[50px]'>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className='h-full w-[200px]'
                  />
                  <button
                    onClick={toggleCamera}
                    className='w-fit px-[20px] py-[15px] top-[80px] rounded-[15px] left-4 z-10 bg-white shadow-md font-medium text-[16px] border hover:bg-slate-50 transition-all duration-200 ease-in-out'
                  >
                    Close Camera
                  </button>
                </div>
              ) : (
                <button
                  onClick={toggleCamera}
                  className='w-fit px-[20px] py-[15px] top-[80px] rounded-[15px] left-4 z-10 bg-white shadow-md font-medium text-[16px] border hover:bg-slate-50 transition-all duration-200 ease-in-out'
                >
                  Open Camera
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Anywhere;
