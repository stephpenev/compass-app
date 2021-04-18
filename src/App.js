import "././styles/App.css";
import firebase from "./firebase.js";
import React from "react";
import Header from "./Components/Header.js";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Prompts from "./Components/Prompts"
import Footer from "./Components/Footer";
import { useEffect, useState } from "react";

function App() {
  const [intentionArray, setIntentionArray] = useState([]);
  const [handleDate, setHandleDate] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [textExpand, setTextExpand] = useState("");
  const [textInputErr, setTextInputErr] = useState({});

  useEffect(() => {
    const dbRef = firebase.database().ref();

    dbRef.on("value", (data) => {
      const intentionData = data.val();
      const intentionsInState = [];

      for (let intentionKey in intentionData) {
        intentionsInState.push({
          uniqueKey: intentionKey,
          todaysDate: intentionData[intentionKey].date,
          intention: intentionData[intentionKey].text,
          intentionDesc: intentionData[intentionKey].textExpand,
        });
      }
      setIntentionArray(intentionsInState);
    });
  }, []);

  const handleChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleTextExpand = (event) => {
    setTextExpand(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const dbRef = firebase.database().ref();
    const isValid = formValidation();
    const date = handleDate;

    const dataObject = {
      date: date,
      text: textInput,
      textExpand: textExpand,
    };

    if (isValid) {
      dbRef.push(dataObject);
      setTextInput("");
      setTextExpand("");
    }
  };

  const formValidation = () => {
    const textInputErr = {};
    let isValid = true;
    if (textInput.trim().length < 4) {
      textInputErr.textInputShort = "Please type a full word to continue.";
      isValid = false;
    }
    if (textInput.trim().length > 20) {
      textInputErr.textInputLong = "Please only type one to two words.";
      isValid = false;
    }
    setTextInputErr(textInputErr);
    return isValid;
  };

  const handleClick = (itemUniqueId) => {
    const dbRef = firebase.database().ref();
    dbRef.child(itemUniqueId).remove();
  };

  return (
    <div>
      <Header />
      <main className="wrapper">
        <form className="intentionForm" onSubmit={handleSubmit}>
          <div className="calendar">
            <input
              type="date"
              id="datefield"
              required
              // min="2021-03-09"
              // max="2030-12-31"
              // dateFormat="mm/dd/yyyy"
              // placeholderText="Today's date"
              value={handleDate}
              selected={handleDate}
              onChange={(e) => setHandleDate(e.target.value)}
            />
          </div>
          <label className="intentionLabel" htmlFor="intentionInput">
            <h3>
              What intention (in one or two words) would you like to move
              through the coming day with?
            </h3>
          </label>
          <input
            className="intentionInput"
            type="text"
            id="intentionInput"
            placeholder="Eg. Presence"
            onChange={handleChange}
            value={textInput}
          />
          {Object.keys(textInputErr).map((key) => {
            return <div style={{ color: "red" }}>{textInputErr[key]}</div>;
          })}
          <textarea
            value={textExpand}
            className="textExpand"
            id="textExpand"
            name="description"
            placeholder="If you'd like, expand on your intention."
            maxLength="300"
            onChange={handleTextExpand}
          ></textarea>

          <button className="submitButton">Embark</button>
        </form>
        <Prompts />
      </main>
      <section className="intentionLogs wrapper">
        <ul className="intentionLogList">
          {intentionArray.map((item) => {
            return (
              <li key={item.uniqueKey}>
                <span className="date">{item.todaysDate} </span>
                <span className="intention">{item.intention}</span>
                <span className="textExpand">{item.intentionDesc}</span>
                <button
                  onClick={() => {
                    handleClick(item.uniqueKey);
                  }}
                >
                  X
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <Footer />
    </div>
  );
}

export default App;
