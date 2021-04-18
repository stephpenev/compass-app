import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Prompts = () => {
  return (
    <aside className="suggestionBox">
      <h3>Ideas to get you started?</h3>
      <FontAwesomeIcon icon={faCaretDown} className="faIcon" />
      <ul className="suggestionInputs">
        <li>
          <h4>Peace</h4>
        </li>
        <li>
          <h4>Simplicity</h4>
        </li>
        <li>
          <h4>Empathy</h4>
        </li>
        <li>
          <h4>Focus</h4>
        </li>
        <li>
          <h4>Strength</h4>
        </li>
        <li>
          <h4>Leadership</h4>
        </li>
        <li>
          <h4>Forgiveness</h4>
        </li>
        <li>
          <h4>Resilience</h4>
        </li>
        <li>
          <h4>Gratitude</h4>
        </li>
        <li>
          <h4>Open-mindedness</h4>
        </li>
      </ul>
    </aside>
  );
};

export default Prompts;
