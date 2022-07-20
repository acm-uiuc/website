import './App.css';
import { Button } from './stories/Button';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button size='large' primary={true} label="Member Login"/>
      </header>
    </div>
  );
}

export default App;
