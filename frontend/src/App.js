import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import SharedNote from './components/SharedNote';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1><Link to="/">Notes App</Link></h1>
          <nav>
            <Link to="/">My Notes</Link> | 
            <Link to="/create">Create New</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<NoteList />} />
          <Route path="/create" element={<NoteForm />} />
          <Route path="/edit/:id" element={<NoteForm />} />
          <Route path="/share/:shareId" element={<SharedNote />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;