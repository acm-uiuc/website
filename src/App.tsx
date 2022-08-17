import './App.css';
import Navbar from './components/Navbar/Navbar';
import { ThemeProvider } from 'styled-components';
import light from './theme/light';
import GlobalStyle from './theme/global';
import Hero from './components/Hero/Hero';
import Transition from './components/Transition/Transition';
import SigHighlight from './components/SigHighlight/SigHighlight';
import Footersection from './sections/Footersection';
import Sigscard from './sections/home/Sigscard';
import Sponsors from './components/Sponsors/Sponsors';

function App() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={light}>
        <Navbar />
        <Hero />
        <Transition to="white" />
        <SigHighlight />
        <Sigscard />
        <Sponsors />
        <Footersection />
      </ThemeProvider>
    </>
  );
}

export default App;