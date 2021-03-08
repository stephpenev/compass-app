import React from "react";

const Footer = () => {
  return (
    <footer>
      {/* <p>Built by Stephanie Penev, 2021</p> */}
      <p>
        Built at{" "}
        <a className="schoolLink"
          href="https://junocollege.com"
          target="blank"
          rel="noopener noreferrer"
        >
          Juno College
        </a>
      </p>
    </footer>
  );
};

export default Footer;
