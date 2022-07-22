import React, { useEffect, useRef, useState } from "react";
import { Link, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

try {
  // const Wordcloud = require("wordcloud");
} catch (err) {

}
// for deployment use above code.

export default function App() {
  var canvasRef = useRef(null);
  var thumbnailCanvasRef = useRef(null);
  const Wordcloud = require("wordcloud");

  const queryParams = new URLSearchParams(window.location.search);
  const filename = queryParams.get("input") || "words";
  const file = require("../public/" + filename + ".json")
  var data = file.words.sort((a, b) => { return a.weight - b.weight });
  const styles = file.style
  // const data = require("../public/words.json").words;
  const [pop, setPop] = useState(false);
  const [word, setWord] = useState("");
  const [props, setProps] = useState([]);
  const [element, setElement] = useState("hello")
  var thumbnailDisplay = styles.thumbnail.display
  const [maxWeight, setMaxWeight] = useState(0);
  const [open, setOpen] = useState(false);
  const canvasHeight = styles.cloudHeight;
  const canvasWidth = styles.cloudWidth;
  //edit canvasWidth to make the cloud bigger/smaller
  const componentRef = useRef(null);

  const count = data.length
  var minWeight = Math.min(...data.slice(0, count).map((w) => w.weight));
  const max = Math.max(...data.map((w) => w.weight))
  data.forEach(ele => { ele.weight = normalise(ele.weight, max, minWeight) })
  const medianOne = median(data.slice(0, Math.floor((2 * count) / 3)));
  const medianTwo = median(data.slice(Math.floor(count / 3), count));
  minWeight = Math.min(...data.slice(0, count).map((w) => w.weight));
  data.sort((a, b) => { return b.weight - a.weight });

  if (queryParams.get('thumbnail') !== null) {
    let myBool = (queryParams.get('thumbnail') === 'true');
    thumbnailDisplay = myBool
  }

  function normalise(val, max, min) {
    return (val - min) * 500 / (max - min);
  }

  function popup(item, dimension, event) {
    try {
      var el = document.getElementById('wordHighlight');
      if (item !== undefined) {
        el.removeAttribute('hidden');
        el.style.left = dimension.x + event.srcElement.offsetLeft + 'px';
        el.style.top = dimension.y + event.srcElement.offsetTop + 'px';
        el.style.width = dimension.w + 'px';
        el.style.height = dimension.h + 'px';
        //
        setWord(item);
        setElement(item[0])
        setProps(event);
        setPop(true);
      } else {
        componentRef.current.scrollTo(0, 0);
        el.setAttribute('hidden', true);
        setPop(false);
        setWord("")
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

  function median(arr) {
    arr.sort((a, b) => a["weight"] - b["weight"]);
    let mid = arr.length >> 1;
    let res =
      arr.length % 2
        ? arr[mid].weight
        : (arr[mid - 1].weight + arr[mid].weight) / 2;
    return res;
  }

  function generateCloud() {
    var el = document.getElementById('wordHighlight');
    el.setAttribute('hidden', true);
    setOpen(true)
    let final_data = [];
    data.forEach((w) => {
      final_data.push([w.word, w.weight, w.click, w.color, w.weight]);
    });
    setMaxWeight(Math.max(...data.map((w) => w.weight)));
    var listColorCounter = 0;
    Wordcloud(canvasRef.current, {
      list: final_data,
      shape: "circle",
      minRotation: -1.57,
      maxRotation: 1.57,
      shuffle: false,
      fontFamily: styles.fontFamily || "Raleway",
      backgroundColor: styles.backgroundColor || "White",
      color: (size, weight, item, b, c, d) => {
        if (final_data[listColorCounter][3] !== undefined) {
          return final_data[listColorCounter++][3];
        } else {
          weight = d[2]
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
        let factor = 1
        if (biggest <= 7) {
          if (size === max) {
            return factor / 1.3 * (Math.pow(size, 0.95) * (3 * (canvasWidth - 300) / 2)) / 1024;
          }
          return factor / 1.15 * (Math.pow(size, 0.75) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 7 && biggest <= 10) {
          if (size === max) {
            return factor / 1.3 * (Math.pow(size, 0.85) * (3 * (canvasWidth - 200) / 2)) / 1024;
          }
          return factor / 1.2 * (Math.pow(size, 0.75) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 10 && biggest <= 13) {
          if (size === max) {
            return factor / 1.3 * (Math.pow(size, 0.8) * (3 * (canvasWidth - 200) / 2)) / 1024;
          }
          return factor / 1.2 * (Math.pow(size, 0.75) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 13) {
          if (size === max) {
            return factor / 1.3 * (Math.pow(size, 0.75) * (4 * (canvasWidth - 200) / 2)) / 1024;
          }
          return factor / 1.2 * (Math.pow(size, 0.70) * (4 * (canvasWidth - 300) / 2)) / 1024;
        }
      },
      shrinkToFit: true,
      minSize: 3,
      drawOutOfBound: false,
      click: (item, dimension, event) => {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
        popup(item, dimension, event);
      }
    });
  }
  function generateThumbnail() {
    let final_data = [];
    data.forEach((w) => {
      final_data.push([w.word, w.weight, w.click, w.color, w.weight]);
    });
    setMaxWeight(Math.max(...data.map((w) => w.weight)));
    var listColorCounter = 0;
    Wordcloud(thumbnailCanvasRef.current, {
      list: final_data,
      shape: "circle",
      minRotation: -1.57,
      maxRotation: 1.57,
      shuffle: false,
      fontFamily: styles.fontFamily || "Raleway",
      backgroundColor: styles.backgroundColor || "White",
      color: (size, weight, item, b, c, d) => {
        if (final_data[listColorCounter][3] !== undefined) {
          return final_data[listColorCounter++][3];
        } else {
          weight = d[2]
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
      fontWeight: function (item, event, dimension) {
        return "bold";
      },
      weightFactor: function (size, item) {
        let biggest = final_data[0][0].length;
        let max = maxWeight;
        let factor = 1
        if (biggest <= 7) {
          if (size === max) {
            return factor / 1.31 * (Math.pow(size, 0.95) * (3 * (canvasWidth - 300) / 2)) / 1024;
          }
          return factor / 1.2 * (Math.pow(size, 0.75) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 7 && biggest <= 10) {
          if (size === max) {
            return factor / 1.3 * (Math.pow(size, 0.85) * (3 * (canvasWidth - 200) / 2)) / 1024;
          }
          return factor / 1.2 * (Math.pow(size, 0.75) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 10 && biggest <= 13) {
          if (size === max) {
            return factor / 1.3 * (Math.pow(size, 0.8) * (3 * (canvasWidth - 200) / 2)) / 1024;
          }
          return factor / 1.2 * (Math.pow(size, 0.75) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 13) {
          if (size === max) {
            return factor / 1.3 * (Math.pow(size, 0.75) * (3 * (canvasWidth - 200) / 2)) / 1024;
          }
          return factor / 1.2 * (Math.pow(size, 0.70) * (1.5 * (canvasWidth - 300) / 2)) / 1024;
        }
      },
      shrinkToFit: true,
      minSize: 3,
      drawOutOfBound: false,
    });
  }

  useEffect(() => {
    if (thumbnailDisplay === false) {
      generateCloud()
    } else {
      generateThumbnail()
    }
    console.log(data)
  }, [maxWeight]);// eslint-disable-line react-hooks/exhaustive-deps

  return (

    <div>

      {!thumbnailDisplay &&
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}
            onMouseLeave={() => { popup() }}
            onClick={() => { if (pop === true && word !== '') popup() }}
          >
            <canvas style={{ cursor: "pointer" }} ref={canvasRef} width={canvasWidth} height={canvasHeight} />
            <div id='wordHighlight'></div>
            <Box id="popuphover"
              ref={componentRef}
              hidden={!pop} sx={{
                top: props.y,
                left: props.x,
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
              onMouseLeave={() => { popup() }}
            >
              {(styles.popup.displayWord || false) &&
                <div style={{ paddingTop: '8px', paddingLeft: '28px', paddingBottom: '8px', paddingRight: '30px', display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
                  {element.charAt(0).toUpperCase() + element.slice(1, element.length)}
                </div>
              }
              {(styles.popup.displayCount || false) && <div style={styles.popup.padding}>
                Count: {word[4]}
              </div>}
              {(styles.popup.displayWord || false) &&
                <div style={{ padding: '5px', borderBottom: '1px solid grey' }}>
                </div>
              }
              {(styles.popup.displayWord || false) && <div style={{ padding: '5px' }}>
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
        </div>
      }
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,50%' }}>
        {thumbnailDisplay && <canvas style={{ cursor: "pointer" }} onClick={() => { open ? setOpen(false) : generateCloud() }} ref={thumbnailCanvasRef} width={styles.thumbnail.width} height={styles.thumbnail.height} />}
      </div>
      {thumbnailDisplay && <Box hidden={!open} sx={styles.box}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          onMouseLeave={() => { popup() }}
          onClick={() => { if (pop === true && word !== '') popup() }}
        >
          <IconButton
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
          </IconButton>
          <canvas style={{ cursor: "pointer" }} ref={canvasRef} width={canvasWidth} height={canvasHeight} />
          <div id='wordHighlight'></div>
          <Box id="popuphover"
            ref={componentRef}
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
            onMouseLeave={() => { popup() }}
          >
            {(styles.popup.displayWord || false) && <div id='popup' style={{ paddingTop: '8px', paddingLeft: '28px', paddingBottom: '8px', paddingRight: '30px', display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
              {element.charAt(0).toUpperCase() + element.slice(1, element.length)}
            </div>}
            {(styles.popup.displayCount || false) && <div id='popup' style={styles.popup.padding}>
              Count: {word[1]}
            </div>}
            {(styles.popup.displayWord || false) && <div style={{ padding: '5px', borderBottom: '1px solid grey' }}>
            </div>}
            {(styles.popup.displayWord || false) && <div style={{ padding: '5px' }}>
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
      </Box>}

    </div>
  );
}
