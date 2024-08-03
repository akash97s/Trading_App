import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setUserInput } from './redux/actions';
import { selectData, selectUserInput } from './redux/selectors';
import { RootState, AppDispatch } from './redux/store';

import SelectModal from './components/SelectModal'; 
import TableComponent from './components/TableComponent'; 

const socket = io('http://localhost:4000');

function App() {
  // const [userInput, setUserInput] = useState<string>('Litecoin');
  // const [apiData, setApiData] = useState<Data[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const userInput = useSelector(selectUserInput);
  const apiData = useSelector(selectData);

  interface Data {
    name: string;
    symbol: string;
    price: number;
    marketCap: number;
  }

  // Function to handle dropdown selection
  const handleSelect = (choice: string) => {
    // setUserInput(choice); // Update userInput state with selected value
    dispatch(setUserInput(choice));
    setShowModal(false);
  };

  const fetch_api_data = async () => {
    if (userInput) {
      try {
          const response = await axios.get(`http://localhost:4000/data/latest_N_Rows`, {
            params: {
              crypto_name: userInput,
            },
          });
          // setApiData(response.data);
          dispatch(setData(response.data as Data[]) );
          // console.log("After fetching data: ", response.data);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    // console.log('App: Redux userInput value ', userInput); // Add this line to log the value
    const fetchData = async () => {
      // console.log("UseEffect Fetching data: ", apiData);
      await fetch_api_data();
      // console.log("UseEffect Fetching data: ", apiData);
    };
    fetchData();

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('cryptoUpdate', ({ name, data }) => {
      // console.log(`New data for ${name}: `, data);
      // Update the data for the selected cryptocurrency when there is an update
      if (name === userInput) {
        dispatch(setData(data as Data[]) );
        // setApiData(data);
      } 
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      // alert('Connection to the server lost. Please refresh the page.');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('cryptoUpdate');
    };
  }, [userInput]);

  const columns = [
    { Header: 'Name', accessor: 'name' as const },
    { Header: 'Symbol', accessor: 'symbol' as const },
    { Header: 'Price', accessor: 'price' as const },
    { Header: 'Market Cap', accessor: 'marketCap' as const }
  ];

  return (
    <div className="App">
      <div className="App-header">
        <p> Select the crypto currency by clicking the button below and selecting from the list given. </p>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Select crypto currency
        </Button>
        <br/>
        <h5> Showing crypto market data for : {userInput} </h5>
        <SelectModal
          show={showModal} 
          onHide={() => setShowModal(false)} 
          onSelect={handleSelect} 
          currentSelection={userInput} 
        />
        <div>
          <TableComponent columns = {columns} data = {apiData} />
        </div>
      </div>
    </div>
  );
}

export default App;
