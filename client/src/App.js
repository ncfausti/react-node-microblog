import './App.css';
import React, {useEffect, useState} from 'react'

const App = () => {
    const [testResponse, setTestResponse] = useState("not connected")
    useEffect(() => {
        fetch("http://localhost:5001/test")
            .then(response => response.text())
            .then(res => setTestResponse(res))
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <div>
            This is testing the server communication: {testResponse}
        </div>
    )
    
}

export default App;
