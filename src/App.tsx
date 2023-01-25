import { ThemeProvider } from 'styled-components';
import light from './theme/light';
import GlobalStyle from './theme/global';
import Home from './pages/Home';
import About from './pages/About';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Payment from './pages/membership/Payment';
import Paid from './pages/membership/Paid';

function App() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={light}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
            </Route>
            <Route path="/about">
              <Route index element={<About />} />
            </Route>
            <Route path="/membership">
              <Route index element={<Payment />} />
            </Route>
            <Route path="/paid">
              <Route index element={<Paid />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
