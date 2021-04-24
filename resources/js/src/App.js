import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    return (
        <div className="App__container">
            This is App component
        </div>
    )
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}