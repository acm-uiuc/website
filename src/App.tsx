import { ThemeProvider } from 'styled-components';
import light from './theme/light';
import GlobalStyle from './theme/global';
import Home from './pages/Home';
import About from './pages/About';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Payment from './pages/membership/Payment';
import Event from './pages/membership/Event';
import EventPaid from './pages/membership/EventPaid';
import Paid from './pages/membership/Paid';

function App() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={light}>
        <HashRouter>
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
            <Route path="/event/:eventName">
              <Route index element={<Event />} />
            </Route>
            <Route path="/paid">
              <Route index element={<Paid />} />
            </Route>
            <Route path="/event-paid/:eventName">
              <Route index element={<EventPaid />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
