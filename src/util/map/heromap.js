import React from "react";
import { useState } from "react";
import { Map, Marker } from "pigeon-maps";

// import { Button } from "../pages/Button";

import { Link } from "react-router-dom";
import "../../styles/pages/home.scss";
import "../../styles/pages/heromap.scss";
function HeroMap() {
  const [hue, setHue] = useState(0);
  const color = `hsl(${hue % 360}deg 39% 70%)`;
  return (
    <div className="maphero-container">
      {/* <video src='/videos/video-1.mp4' autoPlay loop muted /> */}
      {/* <h1>Tracking our finest fleeces!</h1> */}
      <div className="map">
        <Map
          className="actualmap"
          // height={300}
          defaultCenter={[42.867483, -109.853346]}
          zoom={3}
          // top={calc((100 % -300) / 2)}

          width={1408}
          height={600}
        >
          <Marker
            width={50}
            anchor={[42.867483, -109.853346]}
            color={color}
            onClick={() => setHue(hue + 20)}
          />
          <Marker
            width={50}
            anchor={[27.994402, -81.760254]}
            color={color}
            onClick={() => setHue(hue + 20)}
          />
          <Marker
            width={50}
            anchor={[45.5152, 122.6784]}
            color={color}
            onClick={() => setHue(hue + 20)}
          />
        </Map>
      </div>
    </div>
  );
}

export default HeroMap;
