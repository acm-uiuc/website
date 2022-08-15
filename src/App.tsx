import './App.css'
import HomeSigs from "./sections/home/Sigscard"
import SigListingSection from './sections/SigListingPage/SigListingSection'
import Footersection from './sections/Footersection'

function App() {
  return (
    <div className="App">
      <header className='header'>insert header here</header>
        <HomeSigs />
        <SigListingSection />
        <Footersection />
    </div>
  )
}

export default App
