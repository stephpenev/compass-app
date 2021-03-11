import './App.css';
import firebase from './firebase.js';
import React from "react";
import Header from './Components/Header.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Footer from './Components/Footer';
import { useEffect, useState } from 'react';

function App() {
  // SCOPE --
  // An app which holds daily intentions
  // List of intentions comes from user input
  // Store intentions in the parent (App) component
    // pass down to the child (userIntention) component
    // Initialize a state to keep track of the intentions as they are added or removed
  // Create a userIntention component which will display each individual intention
  // each intention will have a delete button which removes it from the list

  // PARTS --
  // *** App Component ***
  // Two local methods (handleChange) to handle the onChange events to update states with user input:
  // - userIntention
  // - dateInput

  // *** Result Component ***
  // Handles user intention input

  // *** Date Component ***
  // Handles user date input

  // Render the application
  // - header component
  // - a form for user input
  // - a date picker that is connected to input upon submit (to log in the db too)
  // - one HTML/CSS section on the page which is activated upon click / hover
  // - use imported Result and Date components
  // - footer component

  // setting states
  const [ intentionArray, setIntentionArray ] = useState([]);

  const [ handleDate, setHandleDate ] = useState(null);

  const [ textInput, setTextInput ] = useState('');

  const [ textInputErr, setTextInputErr ] = useState({});

  // const dbRef = firebase.database().ref();

  // once component is rendered, add input to database
  useEffect(() => {

    const dbRef = firebase.database().ref();

    dbRef.on('value', (data) => {
      // console.log(data.val());

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

  // handle input change
  const handleChange = (event) => {
    setTextInput(event.target.value);
  }

  // validate input and push data into database
  const handleSubmit = (event) => {
    const dbRef = firebase.database().ref();
    event.preventDefault();
    const isValid = formValidation();

    // In order to put the date into the db too, parse the date from the handleDate variable:
    const date = handleDate.toDateString();

    // put the data into an object, and pass in the date and text properties:
    const dataObject = {
    date: date,
    text: textInput,
    }

    // push in the dataObject to the db:
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
