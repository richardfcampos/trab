import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import CargoMap from './pages/CargoMap/'


function App({ match }) {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/"
                           render={({ match }) =>
                               <CargoMap style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100vh' }}/>
                           }
                    />
                </Switch>
            </div>
        </Router>
    );
}



export default App;
