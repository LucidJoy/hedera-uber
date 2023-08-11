import React, { useEffect, useState, useContext } from "react";
import tw from "tailwind-styled-components";
import Image from "next/image";

import { carList } from "../../data/carList";
import UberContext from "../../context/UberContext";

const RideSelector = ({ pickupCoordinates, dropoffCoordinates }) => {
  const { rideDuration, setRideDuration } = useContext(UberContext);
  const [selectedRide, setSelectedRide] = useState("");

  // Get ride duration from MAPBOX API
  useEffect(() => {
    rideDuration = fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates[0]},
      ${pickupCoordinates[1]};${dropoffCoordinates[0]},${dropoffCoordinates[1]}?access_token=pk.eyJ1IjoibHVjaWRqb3kiLCJhIjoiY2xsNTk2emJ1MGY5NjNkbDc1d3dqMDR4eSJ9.gv0mpEzZ1Cct3e7lqWso3g`
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log("--> ", data);
        try {
          if (data?.routes?.length !== 0) {
            setRideDuration(data?.routes[0]?.duration / 100);
          }
        } catch (error) {
          // alert(error);
          // console.log(error);
        }
      });
  }, [pickupCoordinates, dropoffCoordinates]);

  return (
    <Wrapper>
      <Title>Choose a ride, or swipe up for more</Title>

      <CarList>
        {carList.map((car, index) => (
          <div
            key={index}
            onClick={() => setSelectedRide(car.service)}
            className={`flex p-4 items-center hover:bg-gray-200 transition-all duration-200 ease-in-out hover:cursor-pointer px-[10px] ${
              selectedRide == car.service && "bg-gray-200"
            }`}
          >
            {/* <CarImage src={car.imgUrl} /> */}
            <Image src={car.imgUrl} width={40} height={40} />

            <CarDetails>
              <Service>{car.service}</Service>
              <Time>5 min away</Time>
            </CarDetails>

            <Price>{"$" + (rideDuration * car.multiplier).toFixed(2)}</Price>
          </div>
        ))}
      </CarList>
    </Wrapper>
  );
};

export default RideSelector;

const Wrapper = tw.div`
  flex-1 overflow-hidden flex flex-col
`;

const Title = tw.div`
  text-gray-500 text-center text-xs font-medium py-2 border-b
`;

const CarList = tw.div`
  overflow-y-scroll
`;

const CarImage = tw.img`
  h-14 mr-4
`;

const CarDetails = tw.div`
  flex-1 ml-[20px]
`;

const Service = tw.div`
  font-medium
`;

const Time = tw.div`
  text-xs text-blue-500
`;

const Price = tw.div`
  text-sm font-semibold
`;
