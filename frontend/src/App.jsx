import { useState } from "react";
import "./App.css";

function App(){

  const API = "http://localhost:5000/api";

  const [userId,setUserId] = useState("");
  const [ambience,setAmbience] = useState("forest");
  const [text,setText] = useState("");
  const [entries,setEntries] = useState([]);
  const [analysis,setAnalysis] = useState("");
  const [insights,setInsights] = useState(null);

  const saveJournal = async () => {

    await fetch(API+"/journal",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({userId,ambience,text})
    });

    alert("Journal Saved");
  };

  const analyze = async () => {

    const res = await fetch(API+"/journal/analyze",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({text})
    });

    const data = await res.json();
    setAnalysis(data.result);
  };

  const loadEntries = async () => {

    const res = await fetch(API+"/journal/"+userId);
    const data = await res.json();

    setEntries(data.entries);
  };

  const loadInsights = async () => {

    const res = await fetch(API+"/journal/insights/"+userId);
    const data = await res.json();

    setInsights(data);
  };

  return(

    <div className="container">

      <h2>ArvyaX Nature Journal</h2>

      <input
        placeholder="User ID"
        value={userId}
        onChange={(e)=>setUserId(e.target.value)}
      />

      <select
        value={ambience}
        onChange={(e)=>setAmbience(e.target.value)}
      >
        <option value="forest">Forest</option>
        <option value="ocean">Ocean</option>
        <option value="mountain">Mountain</option>
      </select>

      <textarea
        placeholder="Write your journal..."
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />

      <button onClick={saveJournal}>Save</button>
      <button onClick={analyze}>Analyze</button>
      <button onClick={loadEntries}>Entries</button>
      <button onClick={loadInsights}>Insights</button>


      <div className="section">

        <h3>Emotion Analysis</h3>
        <pre>{analysis}</pre>

      </div>


      <div className="section">

        <h3>Entries</h3>

        <ul>
          {entries.map((e,i)=>(
            <li key={i}>
              {e.text} ({e.ambience})
            </li>
          ))}
        </ul>

      </div>


      <div className="section">

        <h3>Insights</h3>

        <pre>
          {JSON.stringify(insights,null,2)}
        </pre>

      </div>

    </div>

  );
}

export default App;