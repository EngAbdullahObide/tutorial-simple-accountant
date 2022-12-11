import { BrowserRouter, Switch,HashRouter as Router,  Route } from 'react-router-dom';
import React from 'react';
import Home from './components/Home';
import Sign from './components/Sign';
import './App.css';

function App() {
  return (
<BrowserRouter>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/sign" component={Sign} />
          </Switch>
        </Router>
      </BrowserRouter>
  );
}

export default App;
