import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { point, distance } from "@turf/turf";
import Web3Modal from "web3modal";

import journeyABI from "./Journey.json";

const UberContext = createContext({});

export const UberProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [google, setGoogle] = useState(false);
  const [pickupCoordinates, setPickupCoordinates] = useState([0, 0]);
  const [dropoffCoordinates, setDropoffCoordinates] = useState([0, 0]);
  const [rideDuration, setRideDuration] = useState(0);
  const [totalDistance, setTotalDistance] = useState();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [anywherePrice, setAnywherePrice] = useState(0);
  const [point1, setPoint1] = useState([0, 0]);
  const [point2, setPoint2] = useState([0, 0]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [code, setCode] = useState("");
  const [qrComponent, setQrComponent] = useState(false);
  const [intervalActive, setIntervalActive] = useState(false);

  const journeyContractAddr = "0x169bBdD96bC529424a775AFb946Cf6DB407c3D4b";

  const router = useRouter();

  useEffect(() => {
    google && router.push("/");
  }, [currentUser]);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask.");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        console.log("No accounts found.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask.");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentUser(accounts[0]);
    console.log(currentUser);
    return accounts[0];
  };

  useEffect(() => {
    try {
      checkIfWalletIsConnected();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      window.ethereum.on("accountsChanged", function (accounts) {
        setCurrentUser(accounts[0]);

        console.log(accounts[0]);

        console.log("Account changed");
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const acceptPayment = async () => {
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          journeyContractAddr,
          journeyABI,
          signer
        );

        console.log("contract -> ", contract);

        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        // console.log("account: ", accounts[0]);
        const txRes = await contract.acceptPayment({
          value: ethers.utils.parseEther(String(anywherePrice)),
          gasLimit: 50000,
        });

        await txRes.wait();

        console.log(txRes);
      }
    } catch (error) {
      console.log("acceptPayment -> ", error);
    }
  };

  const getPickupCoordinates = (pickup) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${pickup}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoibHVjaWRqb3kiLCJhIjoiY2xsNTk2emJ1MGY5NjNkbDc1d3dqMDR4eSJ9.gv0mpEzZ1Cct3e7lqWso3g",
          limit: 1,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        // PICKUP COORDINATES
        setPickupCoordinates(data.features[0].center);
        setPoint1(point(data.features[0].center));
        // console.log(data.features[0].center);
      });
  };

  const getDropoffCoordinates = (dropoff) => {
    // const dropoff = "Los Angeles";

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${dropoff}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoibHVjaWRqb3kiLCJhIjoiY2xsNTk2emJ1MGY5NjNkbDc1d3dqMDR4eSJ9.gv0mpEzZ1Cct3e7lqWso3g",
          limit: 1,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        // DROPOFF COORDINATES
        setDropoffCoordinates(data.features[0].center);
        setPoint2(point(data.features[0].center));
      });
  };

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  };

  return (
    <UberContext.Provider
      value={{
        connectWallet,
        setCurrentUser,
        google,
        setGoogle,
        currentUser,
        pickupCoordinates,
        setPickupCoordinates,
        dropoffCoordinates,
        setDropoffCoordinates,
        rideDuration,
        setRideDuration,
        totalDistance,
        setTotalDistance,
        pickup,
        setPickup,
        dropoff,
        setDropoff,
        anywherePrice,
        setAnywherePrice,
        getPickupCoordinates,
        getDropoffCoordinates,
        point1,
        setPoint1,
        point2,
        setPoint2,
        fetchCurrentLocation,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        currentLocation,
        setCurrentLocation,
        code,
        setCode,
        acceptPayment,
        qrComponent,
        setQrComponent,
        intervalActive,
        setIntervalActive,
      }}
    >
      {children}
    </UberContext.Provider>
  );
};

export default UberContext;
