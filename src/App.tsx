import './App.css'
import HomeSigs from "./sections/home/Sigscard"
import SigListingSection from './sections/SigListingPage/SigListingSection'
import Footersection from './sections/Footersection'
import About from './pages/About'

function App() {
  return (
    <div className="App">
      <header className='header'>insert header here</header>
        <About />
        <HomeSigs />
        <SigListingSection />
        <Footersection />
    </div>
  )
}

export default App
