import './App.css';
import { Button } from './stories/Button'; 
import {SocialIcon } from 'react-social-icons';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          UIUC's Computer Science Society
        </h1>
        <p>
          Write something here
        </p>
        <div className="Button-group">
          <Button size='large' primary={true} label="Member Login" />
          <SocialIcon url="https://discord.com" bgColor="#ffffff" fgColor="#5D3A80" className='Discord-icon'/>
          <SocialIcon url="https://slack.com" bgColor="#ffffff" fgColor="#5D3A80" className='Slack-icon'/>
        </div>
      </header>
    </div>
  );
}

export default App;
