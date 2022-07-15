import React, { useEffect, useRef, useState } from "react";
import { Link, Box, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
try {
  const Wordcloud = require("wordcloud");
} catch (err) {

}
// for deployment use above code.

export default function App() {
  var canvasRef = useRef(null);
  var thumbnailCanvasRef = useRef(null);
  const Wordcloud = require("wordcloud");

  const queryParams = new URLSearchParams(window.location.search);
  const filename = queryParams.get("input") || "words";
  const data = require("../public/" + filename + ".json").words;
  // const data = require("../public/words.json").words;
  const [pop, setPop] = useState(false);
  const [number, setNumber] = useState(data.length);
  const [word, setWord] = useState("");
  const [props, setProps] = useState([]);
  const [max, setMax] = useState(data.length);
  const [element, setElement] = useState("hello")

  const [maxWeight, setMaxWeight] = useState(0);
  const [open, setOpen] = useState(false);
  var timer = null
  const canvasHeight = 500;
  const canvasWidth = 800;

  //edit canvasWidth to make the cloud bigger/smaller

  const styles = {
    fontFamily: "Raleway",
    backgroundColor: "White",
    caption: "This is a Programming Language cloud",
    captionSize: "10",
    thumbnail: {
      display: false,
      height: 50,
      width: 100,
    },
    popup: {
      displayWord: true,
      displayCount: true,
      backgroundColor: "white",
      fontColor: 'black',
      linkColor: 'black',
      fontSize: '22px',
      width: '250px',

      padding: { paddingTop: '8px', paddingLeft: '30px', paddingBottom: '8px', paddingRight: '30px' },
    },
    box: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: canvasWidth,
      height: canvasHeight + 100,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 1,
    }
  };

  function popup(item, event) {
    console.log(event);
    try {
      if (item !== undefined) {
        try {
          // clearTimeout(timer);
          // timer = (
          //   setTimeout(() => {
          //     setPop(false);
          //   }, styles.hoverTimeout)
          // );
          setWord(item);
          setElement(item[0])
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
        setNumber(number)
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
    if (styles.thumbnail.display == false) {
      generateCloud(number)
    } else {
      data.sort((a, b) => b["weight"] - a["weight"]);
      let thumbnailArray = []
      data.forEach(obj => {
        thumbnailArray.push([obj.word, obj.weight])
      })
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
        weightFactor: function (size, item) {
          if (size == maxWeight) return (Math.pow(size, 0.75) * (3 * (canvasWidth - 300) / 2)) / 1024;
          return (Math.pow(size, 0.60) * (3 * (canvasWidth - 300) / 2)) / 1024;
        },
        shrinkToFit: true,
        minSize: 3,
        drawOutOfBound: false,
      });
    }

  }, [maxWeight]);

  return (
    <div>
      <div style={{ padding: '300px', marginLeft: '20px', display: 'flex', justifyContent: 'center' }}>
        {styles.thumbnail.display && <canvas style={{ cursor: "pointer" }} onClick={() => { open ? setOpen(false) : generateCloud(number) }} ref={thumbnailCanvasRef} width={styles.thumbnail.width} height={styles.thumbnail.height} />}
        {/* <div style={{ margin: "10px", color: "black" }}    >
          <input
            type="number"
            onChange={(e) => setNumber(e.target.value)}
            style={{ margin: "10px auto", maxWidth: '155px' }}
            placeholder="Enter Number of Words"
          />
          {"  "}Maximum : {max}
          {!styles.thumbnail.display && <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ marginLeft: "10px", maxHeight: '22px', maxWidth: '40px' }}
          >
            Submit
          </Button>}
        </div> */}
      </div>
      <Box hidden={!open} sx={styles.box}>
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
          {styles.thumbnail.display && <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>}
          <canvas style={{ cursor: "pointer" }} ref={canvasRef} width={canvasWidth} height={canvasHeight} />
          <Box id="popuphover"
            hidden={!pop} sx={{
              top: props.offsetY,
              left: props.offsetX,
              position: "absolute",
              minWidth: styles.popup.width,
              zIndex: 1,
              fontSize: styles.popup.fontSize,
              fontFamily: styles.fontFamily || "Raleway",
              backgroundColor: styles.popup.backgroundColor || "black",
              color: styles.popup.fontColor || "black",
              transform: 'translate(7%,10%)',
              boxShadow: 24,
              transitionTimingFunction: "ease",
              transition: "height 0.3s",
              py: 1.5,
            }}
            onMouseLeave={() => {
              setPop(false);
              setWord("")
            }}
          >
            {styles.popup.displayWord && <div id='popup' style={{ paddingTop: '8px', paddingLeft: '28px', paddingBottom: '8px', paddingRight: '30px', display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
              {element.charAt(0).toUpperCase() + element.slice(1, element.length)}
            </div>}
            {styles.popup.displayCount && <div id='popup' style={styles.popup.padding}>
              Count: {word[1]}
            </div>}
            {styles.popup.displayWord && <div style={{ padding: '5px', borderBottom: '1px solid grey' }}>
            </div>}
            {styles.popup.displayWord && <div style={{ padding: '5px' }}>
            </div>}
            {word &&
              word[2].map((link, idx) => (
                <div id='popup' key={idx} >
                  <Link
                    href={link.link}
                    target="_blank"
                    underline="none"
                    style={{ color: styles.popup.linkColor || "blue", }}
                  >
                    <div id='popup' key={idx} style={styles.popup.padding}>
                      {link.label.charAt(0).toUpperCase() + link.label.slice(1, link.label.length)}
                    </div>
                  </Link>
                </div>
              ))}
          </Box>
        </div>
        {styles.caption && (
          <div
          >
            <h2
              style={{
                fontFamily: styles.fontFamily || "Raleway",
                color: styles.captionColor || "blue",
                display: 'flex',
                justifyContent: 'center'
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
