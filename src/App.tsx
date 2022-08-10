import './App.css'
import HomeSigs from "./sections/home/Sigs"
import SigListing from './stories/SigListing'
import pwny8 from './pwny8.svg'

function App() {
  return (
    <div className="App">
      <header className='header'>insert header here</header>
        <HomeSigs />
        <SigListing 
        title='SIG Pwny'
        color="#3c5"
        barcolor="#84e899"
        description="We're a student-run interest group and
        CTF team at the University of Illinois at Urbana-Champaign
        focused on information security. All are welcome! We have
        a strong focus on kind and collaborative learning, because
        we believe that it's the most fun to be excellent to each
        other."
        p2="We host weekly public meetings on low-barrier-of-entry
        security topics that are focused on collaborative learning and
        friendly environments. In addition, we run weekly seminars
        weekly for more in-depth exploration in topics like embedded
        device security, penetration testing, and fuzzing research.
        We're proudest of our library of recorded meetings."
        Image={pwny8}
        link="https://sigpwny.com/"
        />
        <SigListing 
        title='SIG AIDA'
        color="#51c0c0"
        barcolor="#deffff"
        description="We're a student-run interest group and
        CTF team at the University of Illinois at Urbana-Champaign
        focused on information security. All are welcome! We have
        a strong focus on kind and collaborative learning, because
        we believe that it's the most fun to be excellent to each
        other."
        p2="We host weekly public meetings on low-barrier-of-entry
        security topics that are focused on collaborative learning and
        friendly environments. In addition, we run weekly seminars
        weekly for more in-depth exploration in topics like embedded
        device security, penetration testing, and fuzzing research.
        We're proudest of our library of recorded meetings."
        Image="https://aida.acm.illinois.edu/static/adsa-logo-notext-9b02fdddd07f33d7ef3b4cd6a2e52ddb.png"
        link="https://aida.acm.illinois.edu/"
        />
    </div>
  )
}

export default App
