import './App.css';
import Card from './stories/Card';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 350px 350px 350px;
  grid-gap: 40px;
  padding: 40px;
`

function App() {
  return (
    <div className="App">
      <Grid>
         <Card title="SIGPwny" 
        description="SIGPwny is a friendly but elite club focused on cybersecurity. They host 
                    weekly learning meetings, participate in CTFs, and do 
                    cutting-edge cybersecurity research."
        link="https://sigpwny.com/"
        Imagesrc="https://sigpwny.com/images/logo.png"
        linktext="Website" 
        />
        <Card title="SIGPwny" 
        description="SIGPwny is a friendly but elite club focused on cybersecurity. They host 
                    weekly learning meetings, participate in CTFs, and do 
                    cutting-edge cybersecurity research."
        link="https://sigpwny.com/"
        Imagesrc="https://sigpwny.com/images/logo.png"
        linktext="Website" 
        />
        <Card title="SIGPwny" 
        description="SIGPwny is a friendly but elite club focused on cybersecurity. They host 
                    weekly learning meetings, participate in CTFs, and do 
                    cutting-edge cybersecurity research."
        link="https://sigpwny.com/"
        Imagesrc="https://sigpwny.com/images/logo.png"
        linktext="Website" 
        />
      </Grid>
    </div>
  );
}

export default App;
