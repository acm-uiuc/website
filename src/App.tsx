import './App.css';
import Navbar from './components/Navbar/Navbar';
import { ThemeProvider } from 'styled-components';
import light from './theme/light';
import GlobalStyle from './theme/global';
import Hero from './components/Hero/Hero';
import Transition from './components/Transition/Transition';
import SigHighlight from './components/SigHighlight/SigHighlight';

function App() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={light}>
        <Navbar />
        <Hero />
        <Transition to="white" />
        <SigHighlight />
      </ThemeProvider>
    </>
  );
}

export default App;
