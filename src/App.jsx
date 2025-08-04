import React from 'react';
import StarMap from './components/StarMap.jsx';
import RestoreMission from './components/RestoreMission.jsx';
import StarObservatory from './components/StarObservatory.jsx';

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">GRE-StarNet</h1>
      <StarMap />
      <RestoreMission />
      <StarObservatory />
    </div>
  );
}

export default App;
