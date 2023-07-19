import React, { useState, useEffect, useRef } from 'react';
import {
  IconButton,
  Snackbar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { green } from '@mui/material/colors';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import '@fontsource/roboto';
import './style.css';
import PersonIcon from '@mui/icons-material/Person';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SystemModeIcon from '@mui/icons-material/Brightness6';

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [firstReading, setFirstReading] = useState('');
  const [rate, setRate] = useState('');
  const [newReading, setNewReading] = useState('');
  const [previousReading, setPreviousReading] = useState('');
  const [calculations, setCalculations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [difference, setDifference] = useState('');
  const [elapsedTime, setElapsedTime] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);
  const [storedRate, setStoredRate] = useState('');
  const [storedAddedCost, setStoredAddedCost] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('light');



  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');
    const storedPhoto = localStorage.getItem('photo');
    const storedFirstReading = localStorage.getItem('firstReading');
    const storedRate = localStorage.getItem('rate');
    const storedNewReading = localStorage.getItem('newReading');
    const storedPreviousReading = localStorage.getItem('previousReading');
    const storedCalculations = JSON.parse(localStorage.getItem('calculations'));
    

    if (storedPage) setCurrentPage(parseInt(storedPage, 10));
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedPhoto) setPhoto(storedPhoto);
    if (storedFirstReading) setFirstReading(storedFirstReading);
    if (storedRate) setRate(storedRate);
    if (storedNewReading) setNewReading(storedNewReading);
    if (storedPreviousReading) setPreviousReading(storedPreviousReading);
    if (storedCalculations) setCalculations(storedCalculations);
  
  }, []);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    if (photo) {
      localStorage.setItem('photo', photo);
    } else {
      localStorage.removeItem('photo');
    }
    localStorage.setItem('firstReading', firstReading);
    localStorage.setItem('rate', rate);
    localStorage.setItem('newReading', newReading);
    localStorage.setItem('previousReading', previousReading);
    localStorage.setItem('calculations', JSON.stringify(calculations));
  }, [currentPage, name, email, photo, firstReading, rate, newReading, previousReading, calculations]);

  useEffect(() => {
    const storedDifference = localStorage.getItem('difference');
    if (storedDifference) {
      setDifference(storedDifference);
    }
  }, [calculations]);
  
  useEffect(() => {
    const storedDateLog = localStorage.getItem('dateLog');
    if (!storedDateLog) {
      const currentDateLog = new Date().toLocaleString();
      localStorage.setItem('dateLog', currentDateLog);
    }
  }, [calculations]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const dateLog = localStorage.getItem('dateLog');
      if (dateLog) {
        const previousDate = new Date(dateLog);
        const now = new Date();
        const timeDiff = now - previousDate;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setElapsedTime(`${days}d, ${hours}h, ${minutes}m, ${seconds}s`);
      }
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }, [calculations]);
  
  useEffect(() => {
    const storedAddedCost = localStorage.getItem('addedCost');
    if (storedAddedCost) {
      setStoredAddedCost(storedAddedCost);
    }
  }, [calculations]);
  
  useEffect(() => {
    const storedRateValue = localStorage.getItem('rate');
    if (storedRateValue) {
      setStoredRate(storedRateValue);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rate', rate);
    setStoredRate(rate);
  }, [rate]);
  
 
  const fileInputRef = useRef(null);

  const compressImage = (dataUrl) => {
    return dataUrl;
  };

  const handleAddPhoto = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const compressedDataUrl = compressImage(event.target.result);
      setPhoto(compressedDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSecondPageNext = () => {
    if (firstReading.trim() === '' || rate.trim() === '') {
      setErrorMessage('Please make sure all fields are filled out.');
      setShowErrorMessage(true);
      return;

    }


    setPreviousReading(firstReading);
  
    const timestamp = new Date().toLocaleString();
    const initialDifference = 0;
    const addedCost = (initialDifference * parseFloat(rate)).toFixed(2); // Calculate added cost
    const initialCalculation = { newReading: firstReading, difference: initialDifference, rate, addedCost, timestamp }; // Include added cost in the initialCalculation object
    setCalculations([initialCalculation]);
  
    setCurrentPage(3);
  };
  
  const handleAddReading = () => {
    if (newReading.trim() === '') {
      setErrorMessage('Field is empty. Kindly check and try again.');
      setShowErrorMessage(true);
      return;
    }
  
    if (parseInt(newReading, 10) <= parseInt(previousReading, 10)) {
      setErrorMessage('Invalid value. Please check and try again.');
      setShowErrorMessage(true);
      return;
    }

    showSnackbarMessage();

    const timestamp = new Date().toLocaleString();
    const newDifference = (parseFloat(newReading) - parseFloat(previousReading)).toFixed(2);
    const addedCost = (newDifference * parseFloat(rate)).toFixed(2); // Calculate added cost
    const newCalculation = { newReading, difference: newDifference, rate, addedCost, timestamp }; // Include added cost in the newCalculation object
    setCalculations([...calculations, newCalculation]);
    setPreviousReading(newReading);
    setNewReading('');
    setDifference(parseFloat(newDifference).toString());
    localStorage.setItem('difference', newDifference.toString());
    localStorage.setItem('addedCost', addedCost); // Store added cost in local storage
    setStoredAddedCost(addedCost); // Update the added cost state variable
  
    const currentDateLog = new Date().toLocaleString();
    localStorage.setItem('dateLog', currentDateLog);
  };

  const showSnackbarMessage = () => {
    setShowSnackbar(true);
  };
  

  const handleReset = () => {
    const resetConfirmed = window.confirm('Are you sure you want to reset the app? This will erase all data.');

    if (resetConfirmed) {
      localStorage.clear();
      setCurrentPage(1);
      setName('');
      setEmail('');
      setPhoto(null);
      setFirstReading('');
      setRate('');
      setNewReading('');
      setPreviousReading('');
      setCalculations([]);
      setDifference('');
      localStorage.removeItem('difference');
      window.location.reload();
    }
  };

  const handleSettingsButtonClick = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleDeveloperClick = () => {
    window.open('https://www.facebook.com/DenmarkJudilla.Main/', '_blank');
  };
  
  
  const handleSnackbarClose = () => {
    setShowErrorMessage(false);
  };

  const handleFieldChange = (e, setter) => {
    setter(e.target.value);
  };

  const handlePage1Next = () => {
    if (name.trim() === '' || email.trim() === '') {
      setErrorMessage('Please make sure all fields are filled out.');
      setShowErrorMessage(true);
      return;
    }

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(email)) {
   
      setShowErrorMessage(true);
      setShowEmailError(true); // Show the email format error snackbar
      return;
    }

    if (!localStorage.getItem('photo')) {
      setErrorMessage('Please upload a photo.');
      setShowErrorMessage(true);
      return;
    }

    setCurrentPage(2);
  };

  const handleShowHistory = () => {
    setShowHistory(true);
  };

  const handleHideHistory = () => {
    setShowHistory(false);
  };

  const handleDelete = (index) => {
    const updatedCalculations = [...calculations];
    const confirmDeleteMessage =
      updatedCalculations.length === 1
        ? 'Deleting the last entry will reset the entire app. Are you sure you want to proceed?'
        : 'Are you sure you want to delete this entry?';
  
    const confirmDelete = window.confirm(confirmDeleteMessage);
  
    if (confirmDelete) {
      updatedCalculations.splice(index, 1);
      setCalculations(updatedCalculations);
  
      if (updatedCalculations.length === 0) {
        
      localStorage.clear();
      setCurrentPage(1);
      setName('');
      setEmail('');
      setPhoto(null);
      setFirstReading('');
      setRate('');
      setNewReading('');
      setPreviousReading('');
      setCalculations([]);
      setDifference('');
      localStorage.removeItem('difference');
      window.location.reload();

      
      } else {
        const latestCalculation = updatedCalculations[updatedCalculations.length - 1];
        setPreviousReading(latestCalculation.newReading);
        setDifference(latestCalculation.difference);
        setElapsedTime('');
        setStoredAddedCost(latestCalculation.addedCost);
        localStorage.setItem('addedCost', latestCalculation.addedCost);
        localStorage.setItem('difference', latestCalculation.difference);
        const currentDateLog = new Date().toLocaleString();
        localStorage.setItem('dateLog', currentDateLog);
      }
    }
  };

  const handleModeClick = () => {
    setIsModeOpen(!isModeOpen);
  };
  

  const handleDarkMode = () => {
    // Enable dark mode
    document.body.classList.add('dark-mode');


    setIsPanelOpen(false);
    setIsModeOpen(false);

    setCurrentMode('dark');
    localStorage.setItem('mode', 'dark');

  };
  

  };

  useEffect(() => {
    const storedMode = localStorage.getItem('mode');
    if (storedMode) {
      setCurrentMode(storedMode);
      if (storedMode === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }, []);
  
  const handleSystemModeClick = () => {
    
    // Dynamic detection of system mode changes
    const systemModeChangeHandler = (event) => {
      if (event.matches) {
        // Enable dark mode
        document.body.classList.add('dark-mode');
        setCurrentMode('dark');
        localStorage.setItem('mode', 'dark');
      } else {
        // Enable light mode
        document.body.classList.remove('dark-mode');
        setCurrentMode('light');
        localStorage.setItem('mode', 'light');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', systemModeChangeHandler);

    // Clean up the event listener
    return () => {
      mediaQuery.removeEventListener('change', systemModeChangeHandler);
    };

  
  };


  
  return (
    <div>

<link rel="stylesheet" href="style.css" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />


<Drawer anchor="right" open={isPanelOpen} onClose={() => setIsPanelOpen(false)}>
  <Box sx={{ width: 250 }} role="presentation">
    <List>
      <ListItem button onClick={handleDeveloperClick}>
        <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          
          <ListItemText
    primaryTypographyProps={{
      variant: 'body1',
      fontSize: 'large',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-15px',
      
    }}
    primary="Developer"
  />

      </ListItem>
      <ListItem button onClick={handleReset}>
        <ListItemIcon>
          <DeleteForeverIcon />
        </ListItemIcon>
        <ListItemText
    primaryTypographyProps={{
      variant: 'body1',
      fontSize: 'large',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-15px',
     
    }}
    primary="Reset"
  />
  
        
           </ListItem>
      <ListItem button onClick={handleModeClick}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        
        <ListItemText
    primaryTypographyProps={{
      variant: 'body1',
      fontSize: 'large',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-15px',
    }}
    primary="Mode"
  />
  

  {isModeOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
</ListItem>

<Collapse in={isModeOpen} timeout="auto" unmountOnExit>
<List component="div" disablePadding style={{ marginLeft: '20px' }}>
    <ListItem button onClick={handleDarkMode}>
      <ListItemIcon>
        <DarkModeIcon />
      </ListItemIcon>
      
      <ListItemText primaryTypographyProps={{
        variant: 'body1',
        fontSize: 'medium',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '-15px',
      }}
      primary="Dark Mode" />
    </ListItem>
   
    <ListItem button onClick={handleSystemModeClick}>
      <ListItemIcon>
        <SystemModeIcon />
      </ListItemIcon>
      <ListItemText primaryTypographyProps={{
      variant: 'body1',
      fontSize: 'medium',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '-15px',
    }}
    primary="System Mode" />
    </ListItem>
  </List>
</Collapse>
    </List>
  </Box>
</Drawer>



{currentPage === 1 && (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: '30px', marginTop: '-10vh' }}>
    
    <RocketLaunchIcon style={{ fontSize: '50px', color: '#6200EA', marginBottom:'10vh' }} /> {/* Added RocketLaunchIcon */}
    
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' , width:'100%'}}>
   
    <span style={{fontWeight:'bold' , fontSize:'medium'}}>Welcome to Power Mobile!</span><br />
        <span>Add profile picture:</span>
     
      <IconButton
        component="span"
        onClick={handleAddPhoto}
        style={{ width: '75px', height: '75px', position: 'relative' }}
      >
        <AddPhotoAlternateIcon style={{ borderRadius: '50%', fontSize: '50px' }} />
        {photo && (
          <CheckCircleIcon
            style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              color: green[500],
              fontSize: '20px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              padding: '2px',
            }}
          />
        )}
      </IconButton>

      </div>
      

    <input
      id="photo-input"
      type="file"
      accept="image/*"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={handleFileInputChange}
    />
    <br />
    
    <div style={{ width:'100%' ,display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
    <input
      type="text"
      id="name"
      placeholder="Name"
      value={name}
      onChange={(e) => handleFieldChange(e, setName)}
      style={{ width: '100%', height: '50px', paddingLeft: '20px', fontSize: 'medium' }}
    />
    <br />
    <input
      type="email"
      id="email"
      placeholder="Email"
      value={email}
      onChange={(e) => handleFieldChange(e, setEmail)}
      style={{ width: '100%', height: '50px', paddingLeft: '20px', fontSize: 'medium' }}
    />

    </div>

    <br />
    <button onClick={handlePage1Next} style={{ width: '100%', height: '50px'}}>Next</button>
  </div>
)}




{currentPage === 2 && (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: '30px', marginTop: '-11.8vh' }}>
    
    <RocketLaunchIcon style={{ fontSize: '50px', color: '#6200EA', marginBottom:'10vh' }} /> {/* Added RocketLaunchIcon */}

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' , width:'100%'}}>
   
    <span style={{fontWeight:'bold' , fontSize:'medium'}}>Hi, {localStorage.getItem('name')}!</span><br />
  
    <span style={{fontWeight:'bold' , fontSize:'medium'}}>What's on your meter?</span><br />

      </div>
      


    
    <div style={{ width:'100%' ,display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
  
  
    

    <input
      id="first-reading-input"
      type="number"
      value={firstReading}
      onChange={(e) => handleFieldChange(e, setFirstReading)}
      placeholder="First Reading"
      style={{ width: '100%', height: '50px', paddingLeft: '20px', fontSize: 'medium' }}
    />
    <br />
    <input
        id="rate-input"
        type="number"
        value={rate}
        onChange={(e) => handleFieldChange(e, setRate)}
        placeholder="Rate"
      style={{ width: '100%', height: '50px', paddingLeft: '20px', fontSize: 'medium' }}
    />

    </div>

    <br />
    <button onClick={handleSecondPageNext} style={{ width: '100%', height: '50px'}}>Next</button>
  </div>
)}





      {currentPage === 3 && photo && (
        <div>

<div style={{ display: 'flex', justifyContent: 'flex-end',marginTop:'10px' }}>
  <button onClick={handleSettingsButtonClick} style={{ display: 'flex', alignItems: 'center' }}>
    <SettingsIcon style={{ marginRight: '5px' }} />Settings
  </button>
</div>


          <div className="box" style={{ margin: '10px', marginTop:'10px'}}>
           <div style={{margin:'10px'}}>
              {photo && (
                <img
                  src={photo}
                  alt=""
                  style={{ borderRadius: '50%', width: '70px', height: '70px', verticalAlign: 'middle'}}
                />
              )}
              </div>
              <div>
  <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: 'large' }}>{name}</span>
  <div style={{ fontSize: 'medium', paddingTop:'3px' }}>Your Dashboard</div>
</div>

            
          </div>
      
      
  <div style={{ margin: '20px' }}>
  <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: 'large', marginBottom:'5px' }}>
  Total Bill: ₱ {calculations.reduce((total, calc) => total + (calc.difference * rate), 0).toFixed(2)}
  <InfoIcon style={{ marginLeft: '5px' , color: 'gray' , fontSize:'medium  '}} />
</span>

  <span style={{fontSize: 'medium', fontWeight:'bold'}}><span style={{fontWeight:'normal'}}>Last Entry:</span> {previousReading}</span>
  <br/><span style={{fontSize: 'small' }}>{localStorage.getItem('dateLog')}</span>

</div>

      
          <div className="columns" style={{ margin: '10px' }}>
            <div className="column" style={{ marginRight: '10px' }}>
              <div className="row">
                <div className="box row-box">
                <span style={{ fontWeight: 'bold', fontSize: 'medium' }}>Added Cost</span>
                  <p>₱ {storedAddedCost}</p>
                </div>
                <div className="box row-box">
                <span style={{ fontWeight: 'bold', fontSize: 'medium' }}>Time Passed</span>
                  <p>{elapsedTime}</p>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="row" >
                <div className="box row-box" >
                <span style={{ fontWeight: 'bold', fontSize: 'medium' }}>Added Watts</span>
                  <p>{difference} +</p>
                </div>
                <div className="box row-box">
                <span style={{ fontWeight: 'bold', fontSize: 'medium' }}>Rate</span>
                  <p>₱ {storedRate}</p>
                </div>
              </div>
            </div>
          </div>
      
          <span style={{ fontSize: 'medium', marginLeft:'10px' }}>What's on your meter?</span>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '10px'}}>
  <input
    style={{ width: '100%', marginRight: '10px', fontSize: 'medium', height: '40px' }}
    type="number"
    id="new-reading-input"
    value={newReading}
    onChange={(e) => handleFieldChange(e, setNewReading)}
    placeholder="Enter new reading"
  />
  <button
    id="add-reading-button"
    onClick={handleAddReading}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', marginRight:'10px' }}
  >
    <AddIcon /> Add
  </button>
</div>


<div style={{ borderTop: '1px solid gray', margin: '10px' , marginTop:'20px' , marginBottom:'20px' }}></div>
         
            <button id="show-history-button" onClick={handleShowHistory}>Show History</button>
            <Drawer
  anchor="bottom"
  open={showHistory}
  onClose={handleHideHistory}
  style={{ display: 'flex', justifyContent: 'flex-end' }}
  PaperProps={{
    style: {
      borderRadius: '15px 15px 0 0', // Set border radius for top left and right corners
    },
  }}
>
  <Box sx={{ width: '100%', maxHeight: '50vh', display: 'flex', flexDirection: 'column' }} role="presentation">
    <div style={{ padding: '16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <h2 style={{ margin: 0 }}>History</h2>
    </div>
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <List style={{ width: '100%' }}>
        {calculations.map((calc, index) => (
          <div key={index}>
            <ListItem>
              <ListItemIcon>
                <IconButton onClick={() => handleDelete(index)} aria-label="cancel">
                  <DeleteForeverIcon />
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <div style={{ fontWeight: 'bold' }}>{calc.newReading}</div>
                    <div>{calc.difference} watts added</div>
                    <div>₱ {(calc.difference * rate).toFixed(2)} cost added</div>
                  </>
                }
                secondary={calc.timestamp}
              />
              <div style={{ marginLeft: 'auto' }}></div>
            </ListItem>
            {index !== calculations.length - 1 && <hr style={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)'}} />}
          </div>
        ))}
      </List>
    </div>
  </Box>
</Drawer>


        </div>
      )}

{showErrorMessage && (
  <Snackbar
    open={showErrorMessage}
    autoHideDuration={3000}
    onClose={handleSnackbarClose}
    message={errorMessage}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    action={
      <div onClick={handleSnackbarClose}>
        <CancelIcon style={{ color: 'white' }} />
      </div>
    }
    ContentProps={{
      style: { backgroundColor: '#B00020' },
      'aria-describedby': 'message-id',
    }}
  />
)}


  
{showEmailError && (
  <Snackbar
    open={showEmailError}
    autoHideDuration={3000}
    onClose={() => setShowEmailError(false)}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    action={
      <div onClick={() => setShowEmailError(false)}>
        <CancelIcon />
      </div>
    }
    ContentProps={{
      style: { backgroundColor: '#B00020' },
      'aria-describedby': 'message-id',
    }}
    message={<span id="message-id">Invalid email format.</span>}
  />
)}


<Snackbar
  open={showSnackbar}
  autoHideDuration={3000}
  onClose={() => setShowSnackbar(false)}
  message="New entry added successfully!"
  action={
    <div onClick={() => setShowSnackbar(false)}>
      <CheckCircleIcon fontSize="small" style={{ color: 'white' }} />
    </div>
  }
  ContentProps={{
    style: { backgroundColor: '#2E7D32' },
    'aria-describedby': 'message-id',
  }}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
/>


    </div>
  );


export default App;