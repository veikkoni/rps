import './App.css';
import Live from './components/Live';
import History from './components/History';

function App() {
  return (
    <div className="app">
      <div className="main-content">
        <Live/>
        <History/>        
      </div>
    </div>
  );
}

export default App;
