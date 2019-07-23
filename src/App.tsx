import React, { useState } from "react";

import Polygon from "./Polygon";

function App() {
  const [offset, setOffset] = useState(0);
  const [radius, setRadius] = useState(65);
  const [elements, setElements] = useState(8);

  const [values, setValues] = useState({
    "1": { title: "Adventure", percentage: 50, key: "1", points: undefined },
    "2": {
      title: "Sustainability",
      percentage: 49,
      key: "2",
      points: undefined
    },
    "3": { title: "Community", percentage: 12.5, key: "3", points: undefined },
    "4": { title: "Tradition", percentage: 25, key: "4", points: undefined },
    "5": { title: "Order", percentage: 37.5, key: "5", points: undefined },
    "6": { title: "Influence", percentage: 50, key: "6", points: undefined },
    "7": {
      title: "Performance",
      percentage: 62.5,
      key: "7",
      points: undefined
    },
    "8": { title: "Freedom", percentage: 75, key: "8", points: undefined },
    "9": { title: "Also Good", percentage: 87.5, key: "9", points: undefined },
    "10": { title: "Power", percentage: 100, key: "10", points: undefined }
  });

  const [selectedValue, setSelectedValue] = useState(values["1"].key);

  // @ts-ignore
  const v = values[selectedValue];

  return (
    <div className="app">
      <div className="controls">
        <label htmlFor="offset">Offset</label>
        <input
          id="offset"
          type="range"
          min={0}
          max={360}
          value={offset}
          onChange={ev => setOffset(parseInt(ev.currentTarget.value, 10))}
        />
        {offset}°
        <div>
          <button onClick={() => setOffset(22.5)}>default</button>
          <button onClick={() => setOffset(offset + 1)}>+1</button>
          <button onClick={() => setOffset(offset - 1)}>-1</button>
        </div>
        <label htmlFor="offset">textRadius</label>
        <input
          id="offset"
          type="range"
          min={0}
          max={100}
          value={radius}
          onChange={ev => setRadius(parseInt(ev.currentTarget.value, 10))}
        />
        {radius}%<button onClick={() => setRadius(50)}>default</button>
        <label htmlFor="elements">Elements</label>
        <input
          id="elements"
          type="range"
          min={3}
          max={10}
          value={elements}
          onChange={ev => setElements(parseInt(ev.currentTarget.value, 10))}
        />
        {elements}
        <button onClick={() => setElements(8)}>default</button>
        <select
          onChange={ev => setSelectedValue(ev.currentTarget.value)}
          value={selectedValue}
        >
          {Object.values(values).map(v => (
            <option value={v.key} key={`option${v.key}`}>
              {v.title}
            </option>
          ))}
        </select>
        <input
          id="elements"
          type="range"
          min={1}
          max={100}
          // @ts-ignore
          value={v.percentage}
          onChange={ev =>
            setValues({
              ...values,
              [v.key]: {
                ...v,
                percentage: parseInt(ev.currentTarget.value, 10)
              }
            })
          }
        />
        {v.percentage}
      </div>

      <hr />

      <Polygon
        values={Object.values(values).slice(0, elements)}
        offset={offset}
        textRadius={radius}
      />
    </div>
  );
}

export default App;
