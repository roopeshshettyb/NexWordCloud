import { useRef, useState } from "react";
import { Link, Box, } from '@mui/material'



function Iframe() {
    const queryParams = new URLSearchParams(window.location.search);
    const filename = queryParams.get("input") || "words";
    const file = require("../../public/" + filename + ".json")
    const styles = file.style
    const source = `http://localhost:3000?input=${filename}&thumbnail=false&popup=false`
    const componentRef = useRef(null);
    const displayWord = styles.popup.displayWord !== undefined ? styles.popup.displayWord : false;
    const displayCount = styles.popup.displayCount !== undefined ? styles.popup.displayCount : false;

    const [pop, setPop] = useState(false)
    const [word, setWord] = useState("");
    const [props, setProps] = useState([]);
    const [element, setElement] = useState("hello")
    const popup = () => {
        setPop(false)
    }
    window.onmessage = function (e) {
        const data = e.data
        if (data.item) {
            setPop(true)
            setWord(data.item)
            setElement(data.item[0])
            setProps({ x: data.x, y: data.y })
        }
    };

    return (
        <div style={{ paddingLeft: "50px", display: 'flex' }}>

            <iframe title="cloud" height='700px' width='900px' src={source}></iframe>

            {pop && <Box id="popuphover"
                ref={componentRef}
                hidden={!pop} sx={{
                    top: props.y,
                    left: props.x,
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
        </div >
    );
}

export default Iframe;