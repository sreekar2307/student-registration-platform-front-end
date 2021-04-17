import React from 'react';
import {
    BrowserRouter as Router,
    Route
} from "react-router-dom";
import './App.css';
import Navigation from "./navigation/navigation";

function App() {
    return (
        <Router>
            <Route component={Navigation}/>
        </Router>
    );
}

export default App;
