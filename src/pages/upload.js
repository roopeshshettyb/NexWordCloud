import Papa from "papaparse";
import { useState } from "react";
import { Button } from '@mui/material'



function Upload() {
    const styles = require('../defaultStyle.json')
    const [parsedData, setParsedData] = useState();
    const [fileName, setFileName] = useState("download")
    const styling = { "textAlign": "left" }
    const templateData = require('../template.json').data
    const csv = Papa.unparse(templateData);
    const [isChecked, setIsChecked] = useState(false);

    const handleOnChange = () => {
        if (!isChecked) { setParsedData({ style: styles.style, ...parsedData }); } else { parsedData.style = ""; setParsedData(parsedData); }
        setIsChecked(!isChecked);
    };


    const changeHandler = async (event) => {
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const rowsArray = [];
                const valuesArray = [];
                // Iterating data to get column name and their values
                results.data.forEach((d) => {
                    rowsArray.push(Object.keys(d));
                    valuesArray.push(Object.values(d));
                });
                // Parsed Data Response in array format
                results.data.forEach(ele => {
                    ele['weight'] = Number(ele['weight'])
                    let keys = ele.keywords.replace(' ', '').split(';')
                    let links = ele.links.replace(' ', '').split(';')
                    delete ele["keywords"]
                    delete ele["links"]
                    ele["click"] = []
                    keys.forEach((key, idx) => {
                        ele["click"].push({ "label": key, "link": links[idx] })
                    })
                })
                let obj = { words: results.data }

                setParsedData(obj)
            },
        })
    };

    return (
        <div style={{ paddingLeft: "50px" }}>
            <div style={styling}>
                <h1 >Upload CSV OR JSON</h1>
            </div>

            <div style={styling}>
                {/* File Uploader */}
                <Button variant="contained" style={{ margin: "10px auto" }} href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                    csv
                )}`}
                    download={fileName} >
                    Download Template
                </Button>
                <Button >
                    <input
                        type="file"
                        name="file"
                        onChange={changeHandler}
                        accept=".csv"
                        style={{ display: "block", margin: "10px auto" }}
                    />
                </Button>
                <div><input
                    type="checkbox"
                    id="default style"
                    name="default style"
                    value="Add Default Style"
                    checked={isChecked}
                    onChange={handleOnChange}
                />Add Default Styling</div>
                <div className="form-group p-2">
                    <br></br>
                    <small>
                        <label className="text-muted">JSON File Name </label>
                    </small>
                    <input
                        onChange={(e) => setFileName(e.target.value + '.json')}
                        type="text"
                        className="form-control"
                        placeholder="Enter Name"
                    />
                </div>
                <br></br>
                <div >
                    <Button variant="contained" style={{ margin: "10px auto" }} href={`data:text/json;charset=utf-8,${encodeURIComponent(
                        JSON.stringify(parsedData)
                    )}`}
                        download={fileName} >
                        Submit
                    </Button>
                </div>
                <br />
                <br />
            </div>
        </div >
    );
}

export default Upload;