import React from 'react';
import Navbar from './Navbar';
import Sample from './Cl/Sample';
import ComboBox from './DropDown';
import BisectionCalculator from './components/BisectionCalculator';
import GraphicalCalculator from './components/GraphicalMethod';
import FalsePositionCalculator from './components/FalsePositionCalculator';
import OnePointIterationCalculator from './components/OnePointIterationCalculator';
import NewtonRaphsonCalculator from './components/NewtonRaphsonCalculator';
function App() {
  return (
    <div>
      <Navbar />
    <FalsePositionCalculator/>
      
    </div>
  );
}

export default App;
