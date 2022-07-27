import './App.css';
import { Button } from '../components/Button'; 
import { SocialIcon } from 'react-social-icons';
import { Header } from '../components/Header';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
        <h1>
          UIUC’s Computer Science Society
        </h1>
        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Cras quis varius elit. Quisque ex diam, consectetur pharetra 
        sem vel, finibus pulvinar elit.
        </p>
        <div className="Button-group">
          <Button size='large' primary={true} label="Member Login" />
          <SocialIcon target="_blank" url="https://discord.com" bgColor="#ffffff" fgColor="#5D3A80" className='Discord-icon'/>
          <SocialIcon target="_blank" url="https://slack.com" bgColor="#ffffff" fgColor="#5D3A80" className='Slack-icon'/>
        </div>
      </header>
    </div>
  );
}

export default App;
