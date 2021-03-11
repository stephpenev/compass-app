import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <header className="wrapper">
      <div className="headerLogo">
        <h1>Compass</h1>
        <FontAwesomeIcon icon={faCompass} className="faIcon" />
      </div>
      <h2>A Daily Intention-Setting Log</h2>
    </header>
  );
};

export default Header;
