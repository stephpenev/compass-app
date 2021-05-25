import React from "react";
import Prompts from "./Prompts";

function Input(props) {
  const {
    handleSubmit,
    handleDate,
    handleChange,
    setHandleDate,
    textInput,
    textInputErr,
    textExpand,
    handleTextExpand,
  } = props;
  return (
    <section className="input">
      <form className="intentionForm" onSubmit={handleSubmit}>
        <div className="calendar">
          <label htmlFor="date" className="intentionLabel" id="intentionDate">
            <h3>Today's Date:</h3>
          </label>
          <input
            aria-describedby="intention-date"
            type="date"
            className="date"
            required
            value={handleDate}
            selected={handleDate}
            onChange={(e) => setHandleDate(e.target.value)}
          />
        </div>
        <label
          className="intentionLabel"
          id="intentionLabel"
          htmlFor="intentionInput"
        >
          <h3 className="intentionOne">
            What intention (in one or two words) would you like to move through
            the coming day with?
          </h3>
        </label>
        <input
          aria-describedby="intention-label"
          className="intentionInput"
          type="text"
          id="intentionInput"
          onChange={handleChange}
          value={textInput}
          placeholder="My intention is..."
        />
        {Object.keys(textInputErr).map((key) => {
          return <div style={{ color: "red" }}>{textInputErr[key]}</div>;
        })}
        <label
          className="intentionLabel intentionDescription"
          id="intentionDescription"
          htmlFor="intentionInput"
        >
          <h3>If you'd like, expand on your intention.</h3>
        </label>
        <textarea
          aria-describedby="intention-description"
          value={textExpand}
          className="textExpand"
          id="textExpand"
          name="description"
          maxLength="200"
          onChange={handleTextExpand}
          placeholder="A little bit more about that, in 200 characters or less..."
        ></textarea>
        <button className="submitButton">Remember</button>
      </form>
      <Prompts />
    </section>
  );
}

export default Input;
