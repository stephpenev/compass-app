import './App.css';
import firebase from './firebase.js';
import { useEffect, useState } from 'react';

function App() {
  // OUTLINE OF FLOW
  // An app which holds daily intentions
  // List of intentions comes from user input
  // Store intentions in the parent (App) component
    // pass down to the child (userIntention) component
    // Initialize a state to keep track of the intentions as they are added or removed
  // Create a userIntention component which will display each individual intention
  // each intention may have an X button which removes it from the list

  // FRAMEWORK
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
  // - two forms with user input
  // - one HTML/CSS section on the page which is activated upon click / hover
  // - use imported Result and Date components
  // - footer component

  const [ intentionArray, setIntentionArray ] = useState([]);

  useEffect(() => {
    const dbRef = firebase.database().ref();

    dbRef.on('value', (data) => {
      // console.log(data.val());

      const intentionData = data.val();
      const intentionsInState = [];

      for (let intentionKey in intentionData) {
        intentionsInState.push({
          uniqueKey: intentionKey,
          intention: intentionData[intentionKey]
        });
      }
      setIntentionArray(intentionsInState);
    });

  }, []);

  return (
    <div className="App">
      <form action="">
        <label htmlFor="intentionInput">What one word, or feeling, would you like to move through this day with?</label>
        <input type="text" id="intentionInput" placeholder="Type here"/>
        <button>Embark</button>
      </form>

      <header className="App-header"></header>
      <ul className="intentionLog">
        {intentionArray.map((item) => {
          return <li key={item.uniqueKey}>{item.intention}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
