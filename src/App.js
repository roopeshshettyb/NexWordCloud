import './App.css';
import React, { useEffect, useRef, useState } from "react";
import { Link, Button } from "@mui/material";

// try {
//   const Wordcloud = require("wordcloud");
// } catch (err) {
//
// }
// for deployment use above code.

const Wordcloud = require("wordcloud");

const data = [
  {
    word: "python",
    weight: 443,
    click: [
      {
        label: "business",
        link: "https://www.google.com"
      },
      {
        label: "finance",
        link: "https://www.yahoo.com"
      },
      {
        label: "account",
        link: "https://www.duckduckgo.com"
      }
    ]
  },
  {
    word: "java",
    weight: 426,
    click: [
      {
        label: "business",
        link: "https://www.google.com"
      },
      {
        label: "finance",
        link: "https://www.yahoo.com"
      },
      {
        label: "account",
        link: "https://www.duckduckgo.com"
      }
    ]
  },
  {
 
];

const styles = {
  fontFamily: "Raleway",
  backgroundColor: "White"
};

export default function Cloud() {
  var canvasRef = useRef(null);
  const [pop, setPop] = useState(false);
  const [number, setNumber] = useState(0);
  const [word, setWord] = useState("");
  const [props, setProps] = useState([]);
  const [max, setMax] = useState(0);
  const [count, setCount] = useState(data.length);
  const [maxWeight, setMaxWeight] = useState(0);
  const canvasHeight = 500;
  const canvasWidth = 1500;
  //edit canvasWidth to make the cloud bigger/smaller

  function popup(item, event) {
    try {
      if (item !== undefined) {
        try {
          setWord(item);
          setProps(event);
          setPop(true);
          setTimeout(() => {
            setPop(false);
          }, 3000);
        } catch (err) {
          console.log(err);
        }
      } else {
        setPop(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = () => {
    try {
      if (number < data.length) {
        setCount(number);
        setMaxWeight(0);
      } else {
        //
      }
    } catch (err) {
      console.log(err);
    }
  };

  function median(arr) {
    arr.sort((a, b) => a["weight"] - b["weight"]);
    let mid = arr.length >> 1;
    let res =
      arr.length % 2
        ? arr[mid].weight
        : (arr[mid - 1].weight + arr[mid].weight) / 2;
    return res;
  }

  useEffect(() => {
    let final_data = [];
    setCount(count);
    data.forEach((w) => {
      final_data.push([w.word, w.weight, w.click]);
    });
    data.sort((a, b) => a["weight"] - b["weight"]);
    setMaxWeight(Math.max(...data.map((w) => w.weight)));
    data.sort((a, b) => b["weight"] - a["weight"]);
    let minWeight = Math.min(...data.slice(0, count).map((w) => w.weight));
    let medianOne = median(data.slice(0, Math.floor((2 * count) / 3)));
    let medianTwo = median(data.slice(Math.floor(count / 3), count));
    setMax(final_data.length);
    Wordcloud(canvasRef.current, {
      list: final_data.slice(0, count),
      shape: "circle",
      minRotation: -1.57,
      maxRotation: 1.57,
      fontFamily: styles.fontFamily,
      backgroundColor: styles.backgroundColor,
      color: (size, weight) => {
        if (weight >= minWeight && weight < medianOne) {
          return "rgba(0,0,0,0.6)";
        } else if (weight < medianTwo && weight >= medianOne) {
          return "rgba(0,0,0,0.8)";
        } else if (weight <= maxWeight && weight >= medianTwo) {
          return "rgba(0,0,0,1.0)";
        }
        return "black";
      },
      rotationSteps: 2,
      weightFactor: function (size, item) {
        let biggest = final_data[0][0].length;
        console.log(biggest);
        let max = 443;
        if (biggest <= 7) {
          if (size == max) {
            return (Math.pow(size, 0.95) * (canvasWidth / 2)) / 1024;
          }
          return (Math.pow(size, 0.75) * (canvasWidth / 2)) / 1024;
        } else if (biggest > 7 && biggest <= 10) {
          if (size == max) {
            return (Math.pow(size, 0.85) * (canvasWidth / 2)) / 1024;
          }
          return (Math.pow(size, 0.75) * (canvasWidth / 2)) / 1024;
        } else if (biggest > 10 && biggest <= 13) {
          if (size == max) {
            return (Math.pow(size, 0.8) * (canvasWidth / 2)) / 1024;
          }
          return (Math.pow(size, 0.75) * (canvasWidth / 2)) / 1024;
        } else if (biggest > 13) {
          if (size == max) {
            return (Math.pow(size, 0.7) * (canvasWidth / 2)) / 1024;
          }
          return (Math.pow(size, 0.65) * (canvasWidth / 2)) / 1024;
        }
      },
      shrinkToFit: false,
      minSize: 5,
      drawOutOfBound: false,
      ellipticity: 0.65,
      click: (item, dimension, event) => {
        popup(item, event, dimension);
      }
    });
  }, [maxWeight]);

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "10px" }}
      >
        <div style={{ color: "black" }}>
          Maximum : {max}
          {"  "}
          <input
            type="number"
            onChange={(e) => setNumber(e.target.value)}
            style={{ margin: "10px auto" }}
            placeholder="Enter Number of Words"
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ marginLeft: "10px" }}
          >
            Submit
          </Button>
        </div>
      </div>

      <div
        className="epic-word-cloud"
        style={{ display: "flex", justifyContent: "center", margin: "10px" }}
        onMouseLeave={() => {
          setPop(false);
        }}
      >
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />

        <div
          hidden={!pop}
          style={{
            top: props.y,
            left: props.x,
            position: "absolute",
            zIndex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.881)",
            color: "white",
            cursor: "pointer",
            color: "white",
            minWidth: "200px",
            minHeight: "100px",
            maxWidth: "400px",
            maxHeight: "400px",
            padding: "5px",
            lineHeight: "20px",
            borderRadius: "15px",
            fontSize: "20px",
            textAlign: "center"
          }}
        >
          <div className="popHeading">
            {word[0]}: {word[1]}
          </div>
          {word &&
            word[2].map((link, idx) => (
              <div key={idx} style={{ padding: "5px" }}>
                <Link href={link.link} target="_blank">
                  {link.label}
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

