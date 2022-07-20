import './App.css';
import { ButtonGroup } from './stories/buttonGroup'; 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          UIUC's Computer Science Society
        </p>
        <div className="Button-group">
          <ButtonGroup />
        </div>
      </header>
    </div>
  );
}

export default App;
