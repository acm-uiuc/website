import Navbar from '../components/Navbar/Navbar';
import { ThemeProvider } from 'styled-components';
import light from '../theme/light';
import GlobalStyle from '../theme/global';
import Hero from '../components/Hero/Hero';
import Transition from '../components/Transition/Transition';
import SigHighlight from '../components/SigHighlight/SigHighlight';
import Footersection from '../sections/Footersection';
import Sponsors from '../components/Sponsors/Sponsors';
import NewsletterPopup from '../components/NewsletterPopup/NewsletterPopup';
function Home() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={light}>
        <Navbar />
        <NewsletterPopup/>
        <Hero />
        <Transition to="#fafafa"/>
        <SigHighlight />
        <Sponsors />
        <Footersection />
      </ThemeProvider>
    </>
  );
}

export default Home;
