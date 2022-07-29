import React, { useEffect, useRef, useState } from "react";
import { Link, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

try {  // const Wordcloud = require("wordcloud");
} catch (err) { }
// for deployment use above code.

export default function App() {
  const Wordcloud = require("wordcloud");
  const queryParams = new URLSearchParams(window.location.search);

  var canvasRef = useRef(null);
  var thumbnailCanvasRef = useRef(null);
  const componentRef = useRef(null);

  const filename = queryParams.get("input") || "words";
  const file = require("../public/" + filename + ".json")
  const styles = file.style
  let popUpStyle = {
    "position": "absolute",
    "top": "50%",
    "left": "50%",
    "transform": "translate(-50%, -50%)",
    "minWidth": "70vw",
    "minHeight": "90vh",
    "bgcolor": "background.paper",
    "boxShadow": 24,
    "p": 1
  }
  var data = file.words.sort((a, b) => { return a.weight - b.weight });

  const [pop, setPop] = useState(false);
  const [word, setWord] = useState("");
  const [props, setProps] = useState([]);
  const [element, setElement] = useState("hello")
  const [maxWeight, setMaxWeight] = useState(0);
  const [open, setOpen] = useState(false);

  const canvasHeight = styles.cloudHeight || 900;
  const canvasWidth = styles.cloudWidth || 500;   //edit canvasWidth to make the cloud bigger/smaller
  const count = data.length
  var thumbnailDisplay = styles.thumbnail.display || false
  const displayPopup = styles.popup.display || true
  const displayHighlight = styles.highlight.display !== undefined ? styles.highlight.display : false
  const displayWord = styles.popup.displayWord !== undefined ? styles.popup.displayWord : false;
  const displayCount = styles.popup.displayCount !== undefined ? styles.popup.displayCount : false;


  var minWeight = Math.min(...data.slice(0, count).map((w) => w.weight));
  const max = Math.max(...data.map((w) => w.weight))
  data.forEach(ele => { ele.weight = normalise(ele.weight, max, minWeight) })
  const medianOne = median(data.slice(0, Math.floor((2 * count) / 3)));
  const medianTwo = median(data.slice(Math.floor(count / 3), count));
  minWeight = Math.min(...data.slice(0, count).map((w) => w.weight));
  data.sort((a, b) => { return b.weight - a.weight });

  if (queryParams.get('thumbnail') !== null) { thumbnailDisplay = (queryParams.get('thumbnail') === 'true') }

  function normalise(val, max, min) {
    return ((val - min) * 250 / (max - min)) + max / min;
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

  function getColor(word, weight) {
    if (weight >= minWeight && weight < medianOne) {
      return "rgba(0,0,0,0.6)";
    } else if (weight < medianTwo && weight >= medianOne) {
      return "rgba(0,0,0,0.8)";
    } else if (weight <= maxWeight && weight >= medianTwo) {
      return "rgba(0,0,0,1.0)";
    }
    return 'rgba(0,0,0,0.6)'
  }

  function getSize(size, item, final_data) {
    let biggest = final_data[0][0].length;
    let max = maxWeight;
    let factor = styles.weightFactor || 1
    if (biggest <= 7) {
      if (size === max) {
        return factor / 1.31 * (Math.pow(size, 1) * (3 * (canvasWidth - 300) / 2)) / 1024;
      }
      return factor / 1.2 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 300) / 2)) / 1024;
    } else if (biggest > 7 && biggest <= 10) {
      if (size === max) {
        return factor / 1.3 * (Math.pow(size, 0.95) * (3 * (canvasWidth - 200) / 2)) / 1024;
      }
      return factor / 1.2 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 300) / 2)) / 1024;
    } else if (biggest > 10 && biggest <= 13) {
      if (size === max) {
        return factor / 1.3 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 200) / 2)) / 1024;
      }
      return factor / 1.2 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 300) / 2)) / 1024;
    } else if (biggest > 13) {
      if (size === max) {
        return factor / 1.3 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 200) / 2)) / 1024;
      }
      return factor / 1.2 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 300) / 2)) / 1024;
    }
  }

  function popup(item, dimension, event) {
    try {
      if (displayHighlight) var el = document.getElementById('wordHighlight');
      if (item !== undefined) {
        if (displayHighlight) {
          el.removeAttribute('hidden');
          el.style.left = dimension.x + event.srcElement.offsetLeft + 'px';
          el.style.top = dimension.y + event.srcElement.offsetTop + 'px';
          el.style.width = dimension.w + 'px';
          el.style.height = dimension.h + 'px';
        }
        //
        setWord(item);
        setElement(item[0])
        setProps(event);
        setPop(true);
      } else {
        if (displayHighlight) el.setAttribute('hidden', true);
        componentRef.current.scrollTo(0, 0);
        setPop(false);
        setWord("")
      }
    } catch (err) {
      console.log(err);
    }
  }

  function generateCloud() {
    if (displayHighlight) {
      var el = document.getElementById('wordHighlight');
      el.setAttribute('hidden', true);
    }
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
      color: (word, weight) => {
        if (final_data[listColorCounter][3] !== undefined) { return final_data[listColorCounter++][3]; } else { return getColor(word, weight) }
      },
      rotationSteps: 2,
      rotateRatio: 0.4,
      // weightFactor: (size, item) => { if (size === 250) return Math.pow(size, 1.5); return Math.pow(size, 0.9) },
      weightFactor: (size, item) => getSize(size, item, final_data),
      shrinkToFit: true,
      minSize: 5,
      drawOutOfBound: false,
      click: (item, dimension, event) => {
        event.cancelBubble = true; if (event.stopPropagation) event.stopPropagation();
        console.log(event)
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
      color: (word, weight) => {
        if (final_data[listColorCounter][3] !== undefined) { return final_data[listColorCounter++][3]; } else { return getColor(word, weight) }
      },
      rotationSteps: 2,
      rotateRatio: 0.4,
      fontWeight: function () { return "bold"; },
      weightFactor: (size, item) => getSize(size, item, final_data),
      shrinkToFit: true,
      minSize: 3,
      drawOutOfBound: false,
    });
  }

  useEffect(() => {
    if (thumbnailDisplay === false) { generateCloud() }
    else { generateThumbnail() }
  }, [maxWeight]);// eslint-disable-line react-hooks/exhaustive-deps

  return (

    <div>
      {!thumbnailDisplay &&
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}
            onMouseLeave={() => { popup() }}
            onClick={() => { if (pop === true && word !== '') popup() }}
          >
            <canvas style={{ cursor: "pointer" }} ref={canvasRef} width={canvasWidth} height={canvasHeight} />
            {displayHighlight && <div id='wordHighlight'></div>}
            {displayPopup && <Box id="popuphover"
              ref={componentRef}
              hidden={!pop} sx={{
                top: props.y,
                left: props.x,
                position: "absolute",
                minHeight: styles.popup.minHeight || "100px",
                minWidth: styles.popup.width || "260px",
                zIndex: 1,
                fontSize: styles.popup.fontSize || "22px",
                fontFamily: styles.fontFamily || "Raleway",
                backgroundColor: styles.popup.backgroundColor || "white",
                color: styles.popup.fontColor || "black",
                transform: 'translate(7%,10%)',
                boxShadow: 24,
                transitionTimingFunction: "ease",
                transition: "height 0.3s",
                py: 1.5,
              }}
              onMouseLeave={() => { popup() }}
            >
              {(displayWord || false) &&
                <div style={{ paddingTop: '8px', paddingLeft: '28px', paddingBottom: '8px', paddingRight: '30px', display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
                  {element.charAt(0).toUpperCase() + element.slice(1, element.length)}
                </div>
              }
              {(displayCount || false) && <div style={{ "padding": "8px 30px 8px 30px" }}>
                Count: {word[4]}
              </div>}
              {(displayWord || false) && <div style={{ padding: '5px', borderBottom: '1px solid grey' }}></div>}
              {(displayWord || false) && <div style={{ padding: '5px' }}></div>}
              {word && word[2].map((link, idx) => (
                <div id='popup' key={idx} >
                  <Link
                    href={link.link}
                    target="_blank"
                    underline="none"
                    style={{ color: styles.popup.linkColor || "blue", }}
                  >
                    <div id='popup' key={idx} style={{ "padding": "8px 30px 8px 30px" }}>
                      {link.label.charAt(0).toUpperCase() + link.label.slice(1, link.label.length)}
                    </div>
                  </Link>
                </div>
              ))}
            </Box>}
          </div>
          {(styles.cloudTitle || styles.cloudDescription) && (
            <div>
              <h1 style={{ fontFamily: styles.fontFamily || "Raleway", color: styles.titleColor || "blue", display: 'flex', justifyContent: 'center' }}>
                {styles.cloudTitle}
              </h1>
              <h3 style={{ fontFamily: styles.fontFamily || "Raleway", color: styles.descriptionColor || "black", display: 'flex', justifyContent: 'center' }}>
                {styles.cloudDescription}
              </h3>
            </div>
          )}
        </div>
      }
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,50%' }}>
        {thumbnailDisplay && <canvas style={{ cursor: "pointer" }} onClick={() => { open ? setOpen(false) : generateCloud() }} ref={thumbnailCanvasRef} width={styles.thumbnail.width || 200} height={styles.thumbnail.height || 110} />}
      </div>
      {thumbnailDisplay && <Box hidden={!open} sx={styles.box || popUpStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          onMouseLeave={() => { popup() }}
          onClick={() => { if (pop === true && word !== '') popup() }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}
          >
            <CloseIcon />
          </IconButton>
          <canvas style={{ cursor: "pointer" }} ref={canvasRef} width={canvasWidth} height={canvasHeight} />
          {displayHighlight && <div id='wordHighlight'></div>}
          {displayPopup && <Box id="popuphover"
            ref={componentRef}
            hidden={!pop} sx={{
              top: props.offsetY,
              left: props.offsetX + (0.9 * styles.popup.widthOffset),
              position: "absolute",
              minWidth: styles.popup.width || "250px",
              minHeight: styles.popup.minHeight || "100px",
              zIndex: 1,
              fontSize: styles.popup.fontSize || "22px",
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
            {(displayWord || false) && <div id='popup' style={{ paddingTop: '8px', paddingLeft: '28px', paddingBottom: '8px', paddingRight: '30px', display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
              {element.charAt(0).toUpperCase() + element.slice(1, element.length)}
            </div>}
            {(displayCount || false) && <div id='popup' style={{ "padding": "8px 30px 8px 30px" }}>
              Count: {word[1]}
            </div>}
            {(displayWord || false) && <div style={{ padding: '5px', borderBottom: '1px solid grey' }}></div>}
            {(displayWord || false) && <div style={{ padding: '5px' }}></div>}
            {word &&
              word[2].map((link, idx) => (
                <div id='popup' key={idx} >
                  <Link
                    href={link.link}
                    target="_blank"
                    underline="none"
                    style={{ color: styles.popup.linkColor || "blue", }}
                  >
                    <div id='popup' key={idx} style={{ "padding": "8px 30px 8px 30px" }}>
                      {link.label.charAt(0).toUpperCase() + link.label.slice(1, link.label.length)}
                    </div>
                  </Link>
                </div>
              ))}
          </Box>}
        </div>
        {(styles.cloudTitle || styles.cloudDescription) && (
          <div>
            <h1 style={{ fontFamily: styles.fontFamily || "Raleway", color: styles.titleColor || "blue", display: 'flex', justifyContent: 'center' }}>
              {styles.cloudTitle}
            </h1>
            <h3 style={{ fontFamily: styles.fontFamily || "Raleway", color: styles.descriptionColor || "black", display: 'flex', justifyContent: 'center' }}>
              {styles.cloudDescription}
            </h3>
          </div>
        )}
      </Box>}
    </div>
  );
}
