import logo from './logo.svg';
import './App.css';
import { Box, Image, Button, Container } from '@chakra-ui/react';
import Header from './components/Header';
import Upload from './components/Upload';

function App() {
  return (
    <div className='App' style={{ height: '100%' }}>
      <Box>
        <Header />
        <Upload />
      </Box>
    </div>
  );
}

export default App;
