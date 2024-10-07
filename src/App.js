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
import CramerCalculator from './Matrix/CramerCalculator';
import GaussEliminationCalculator from './Matrix/GaussEliminationCalculator';
import GaussJordanCalculator from './Matrix/GaussJordanCalculator';
import MatrixInversionCalculator from './Matrix/MatrixInversionCalculator';
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

                <Route
                path="/CramerCalculator"
                element={<CramerCalculator/>}
              />

              <Route
                path="/GaussEliminationCalculator"
                element={<GaussEliminationCalculator/>}
              />
               <Route
                path="/GaussJordanCalculator"
                element={<GaussJordanCalculator/>}
              />
               <Route
                path="/MatrixInversionCalculator"
                element={<MatrixInversionCalculator/>}
              />



             

          </Routes>
      

      
    </div>
  );
}

export default App;
