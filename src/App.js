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
import TaylorSeriesCalculator from './components/TaylorSeriesCalculator';
import SecantMethodCalculator from './components/SecantMethodCalculator';
import LUDecompositionCalculator from './Matrix/LUDecompositionCalculator';
import CholeskyDecompositionCalculator from './Matrix/CholeskyDecompositionCalculator';
import NewtonsDividedDifferencesCalculator from './INTERPOLATION  AND  EXTRAPOLATION/NewtonsDividedDifferencesCalculator';
import LagrangeInterpolationCalculator from './INTERPOLATION  AND  EXTRAPOLATION/LagrangeInterpolationCalculator';
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
                path="/NewtonRaphsonCalculator"
                element={<NewtonRaphsonCalculator/>}
              />
              <Route
                path="/TaylorSeriesCalculator"
                element={<TaylorSeriesCalculator/>}
              />
              <Route
                path="/SecantMethodCalculator"
                element={<SecantMethodCalculator/>}
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
               <Route
                path="/LUDecompositionCalculator"
                element={<LUDecompositionCalculator/>}
              />
               <Route
                path="/CholeskyDecompositionCalculator"
                element={<CholeskyDecompositionCalculator/>}
              />
                <Route
                path="/NewtonsDividedDifferencesCalculator"
                element={<NewtonsDividedDifferencesCalculator/>}
              />
                <Route
                path="/LagrangeInterpolationCalculator"
                element={<LagrangeInterpolationCalculator/>}
              />



             

          </Routes>
      

      
    </div>
  );
}

export default App;
