import React from 'react';
import Navbar from './Navbar';
import Sample from './Cl/Sample';
import ComboBox from './DropDown';
import BisectionCalculator from './components/BisectionCalculator';
import GraphicalCalculator from './components/GraphicalMethod';
import FalsePositionCalculator from './components/FalsePositionCalculator';
import OnePointIterationCalculator from './components/OnePointIterationCalculator';
import NewtonRaphsonCalculator from './components/NewtonRaphsonCalculator';
import MultipleSelect from './main';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
function App() {
  return (
    <div>
              <Navbar/> 
          <Routes>
            
              <Route 
                path="/" 
                element={<Navigate to={"/main"} />}
                />

              <Route
                path="/main"
                element={<MultipleSelect/>}
              />

              <Route
                path="/BisectionCalculator"
                element={<BisectionCalculator/>}
              />

              <Route
                path="/GraphicalCalculator"
                element={<GraphicalCalculator/>}
              />

              <Route
                path="/FalsePositionCalculator"
                element={<FalsePositionCalculator/>}
              />

              <Route
                path="/OnePointIterationCalculator"
                element={<OnePointIterationCalculator/>}
              />


             

          </Routes>
      

      
    </div>
  );
}

export default App;
