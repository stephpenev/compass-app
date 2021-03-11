import '././styles/App.css';
import firebase from './firebase.js';
import React from "react";
import Header from './Components/Header.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Footer from './Components/Footer';
import { useEffect, useState } from 'react';

function App() {

  const [ intentionArray, setIntentionArray ] = useState([]);
  const [ handleDate, setHandleDate ] = useState(null);
  const [ textInput, setTextInput ] = useState('');
  const [ textInputErr, setTextInputErr ] = useState({});

  useEffect(() => {

    const dbRef = firebase.database().ref();

    dbRef.on('value', (data) => {

      const intentionData = data.val();
      const intentionsInState = [];

      for (let intentionKey in intentionData) {
        intentionsInState.push({
          uniqueKey: intentionKey,
          todaysDate: intentionData[intentionKey].date,
          intention: intentionData[intentionKey].text,
        });
      }
      setIntentionArray(intentionsInState);
    });

  }, []);

  const handleChange = (event) => {
    setTextInput(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const dbRef = firebase.database().ref();
    const isValid = formValidation();
    const date = handleDate.toDateString();

    const dataObject = {
    date: date,
    text: textInput,
    }

    if(isValid){
      dbRef.push(dataObject);
      setTextInput("");
    }
  }

  const formValidation = () => {
    const textInputErr = {};
    let isValid = true;
    if(textInput.trim().length < 4){
      textInputErr.textInputShort = 'Please type a full word to continue.';
      isValid = false;
    }
    if (textInput.trim().length > 20){
      textInputErr.textInputLong = 'Please only type one to two words.';
      isValid = false;
    }
    setTextInputErr(textInputErr);
    return isValid;
  }

  const handleClick = (itemUniqueId) => {
    const dbRef = firebase.database().ref();
    dbRef.child(itemUniqueId).remove();
  }

  return (
    <div>
      <Header />
      <main className="wrapper">
        <form className="intentionForm" onSubmit={handleSubmit}>
          <div className="calendar">
            <DatePicker
              selected={handleDate}
              onChange={(date) => setHandleDate(date)}
              dateFormat="MM/dd/yyyy"
              minDate={new Date()}
              placeholderText={`Today's date`}
              required
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
          <button className="submitButton">Embark</button>
        </form>
        <aside className="suggestionBox">
          <h3>Ideas to get you started...</h3>
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
      </main>
      <section className="intentionLogs wrapper">
        <ul className="intentionLogList">
          {intentionArray.map((item) => {
            return (
              <li key={item.uniqueKey}>
                <span className="date">{item.todaysDate} </span>
                <span className="intention">{item.intention}</span>
                <button
                  onClick={() => {
                    handleClick(item.uniqueKey);
                  }}
                >
                  Remove
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
