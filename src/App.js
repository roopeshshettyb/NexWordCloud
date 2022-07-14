import React, { useEffect, useRef, useState } from "react";
import { Link, Box } from "@mui/material";
try {
  const Wordcloud = require("wordcloud");
} catch (err) {

}
// for deployment use above code.

export default function Cloud() {
  var canvasRef = useRef(null);
  var thumbnailCanvasRef = useRef(null);
  const Wordcloud = require("wordcloud");

  const queryParams = new URLSearchParams(window.location.search);
  const filename = queryParams.get("input") || "words";
  const data = require("../public/" + filename + ".json").words;

  const [pop, setPop] = useState(false);
  const [number, setNumber] = useState(data.length);
  const [word, setWord] = useState("");
  const [props, setProps] = useState([]);
  const [max, setMax] = useState(0);

  const [maxWeight, setMaxWeight] = useState(0);
  const [open, setOpen] = useState(false);
  var timer = null
  const canvasHeight = 500;
  const canvasWidth = 800;
  const thumbnailCanvasHeight = 50;
  const thumbnailCanvasWidth = 100;
  //edit canvasWidth to make the cloud bigger/smaller

  const styles = {
    fontFamily: "Raleway",
    backgroundColor: "White",
    hoverBg: "rgba(0, 0, 0, 0.881)",
    linkColor: "red",
    caption: "This is a Programming Language cloud",
    hoverTimeout: "5000" //timeout in ms for popup
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: canvasWidth,
    height: canvasHeight + 100,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  function popup(item, event) {
    console.log(item, event);
    try {
      if (item !== undefined) {
        try {
          clearTimeout(timer);
          timer = (
            setTimeout(() => {
              setPop(false);
            }, styles.hoverTimeout)
          );
          setWord(item);
          setProps(event);
          setPop(true);
        } catch (err) {
          console.log(err);
        }
      } else {
        clearTimeout(timer);
        setPop(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Overwrite Math.random to use seed to ensure same word cloud is printed on every render
  function randseed(s) {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  }

  let seed = 0;
  Math.random = function () {
    seed++;
    return randseed(seed);
  };

  const handleSubmit = () => {
    try {
      if (number < data.length) {
        // setCount(number);
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

  function generateCloud(n) {
    setOpen(true)
    let count = n
    let final_data = [];
    data.forEach((w) => {
      final_data.push([w.word, w.weight, w.click, w.color]);
    });
    data.sort((a, b) => a["weight"] - b["weight"]);
    setMaxWeight(Math.max(...data.map((w) => w.weight)));
    data.sort((a, b) => b["weight"] - a["weight"]);
    let minWeight = Math.min(...data.slice(0, count).map((w) => w.weight));
    let medianOne = median(data.slice(0, Math.floor((2 * count) / 3)));
    let medianTwo = median(data.slice(Math.floor(count / 3), count));
    setMax(final_data.length);
    var listColorCounter = 0;
    Wordcloud(canvasRef.current, {
      list: final_data.slice(0, count),
      shape: "circle",
      minRotation: -1.57,
      maxRotation: 1.57,
      shuffle: false,
      fontFamily: styles.fontFamily || "Raleway",
      backgroundColor: styles.backgroundColor || "White",
      color: (size, weight) => {
        if (final_data[listColorCounter][3] !== undefined) {
          return final_data[listColorCounter++][3];
        } else {
          if (weight >= minWeight && weight < medianOne) {
            return "rgba(0,0,0,0.6)";
          } else if (weight < medianTwo && weight >= medianOne) {
            return "rgba(0,0,0,0.8)";
          } else if (weight <= maxWeight && weight >= medianTwo) {
            return "rgba(0,0,0,1.0)";
          }
        }

        return "black";
      },
      rotationSteps: 2,
      rotateRatio: 0.4,
      weightFactor: function (size, item) {
        let biggest = final_data[0][0].length;
        let max = maxWeight;
        if (biggest <= 7) {
          if (size === max) {
            return (Math.pow(size, 0.95) * (3 * (canvasWidth - 300) / 2)) / 1024;
          }
          return (Math.pow(size, 0.75) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 7 && biggest <= 10) {
          if (size === max) {
            return (Math.pow(size, 0.85) * (3 * (canvasWidth - 200) / 2)) / 1024;
          }
          return (Math.pow(size, 0.75) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 10 && biggest <= 13) {
          if (size === max) {
            return (Math.pow(size, 0.8) * (3 * (canvasWidth - 200) / 2)) / 1024;
          }
          return (Math.pow(size, 0.75) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 13) {
          if (size === max) {
            return (Math.pow(size, 0.75) * (4 * (canvasWidth - 200) / 2)) / 1024;
          }
          return (Math.pow(size, 0.70) * (4 * (canvasWidth - 300) / 2)) / 1024;
        }
      },
      shrinkToFit: true,
      minSize: 3,
      drawOutOfBound: false,
      click: (item, dimension, event) => {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
        popup(item, event, dimension);
      }
    });
  }

  useEffect(() => {

    data.sort((a, b) => b["weight"] - a["weight"]);
    let thumbnailArray = [[data[0].word, data[0].weight]]
    setMaxWeight(data[0].weight);
    Wordcloud(thumbnailCanvasRef.current, {
      list: thumbnailArray,
      shape: "rectangle",
      shuffle: false,
      rotateRatio: 0,
      fontFamily: styles.fontFamily || "Raleway",
      backgroundColor: styles.backgroundColor || "White",
      color: (size, weight) => {
        return "black";
      },
      rotationSteps: 0,
      fontWeight: function (item, event, dimension) {
        return "bold";
      },
      shrinkToFit: true,
      minSize: 3,
      drawOutOfBound: false,
    });
  }, [maxWeight]);
  return (
    <div>
      <div style={{ padding: '0px', marginLeft: '20px', display: 'flex', justifyContent: 'left' }}>
        <canvas onClick={() => { open ? setOpen(false) : generateCloud(number) }} ref={thumbnailCanvasRef} width={thumbnailCanvasWidth} height={thumbnailCanvasHeight} />
        <div
          style={{ margin: "10px" }}
        >
          <div style={{ color: "black" }}>

            <input
              type="number"
              onChange={(e) => setNumber(e.target.value)}
              style={{ margin: "10px auto" }}
              placeholder="Enter Number of Words"
            />
            {"  "}Maximum : {max}
          </div>
        </div>
      </div>
      <Box hidden={!open} sx={style}>

        <div
          onMouseLeave={() => {
            setPop(false);
            setWord("")
          }}
          onClick={() => {
            if (pop === true && word !== '') {
              setPop(false)
              setWord('')
            }
          }}
        >
          <canvas style={{ cursor: "pointer" }} ref={canvasRef} width={canvasWidth} height={canvasHeight} />
          <div
            hidden={!pop}
            style={{
              top: props.y,
              left: props.x,
              position: "absolute",
              zIndex: 1,
              backgroundColor: styles.hoverBg || "black",
              color: "white",
              cursor: "pointer",
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
                  <Link
                    href={link.link}
                    target="_blank"
                    underline="hover"
                    style={{ color: styles.linkColor || "blue" }}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
          </div>
        </div>
        {styles.caption && (
          <div
          >
            <h2
              style={{
                fontFamily: styles.fontFamily || "Raleway",
                fontSize: "50",
                color: styles.captionColor || "blue"
              }}
            >
              {styles.caption}
            </h2>
          </div>
        )}
      </Box>
    </div>
  );
}
