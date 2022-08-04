window.addEventListener('message', (e) => {
    const data = e.data
    const div = document.createElement('div');
    div.innerHTML =
        `<div id="popuphover" onMouseLeave="popup()"
    style="top:${data.y}px;left:${data.x}px;background-color:white;font-size:25px;position:absolute;min-height:100px;min-width:260px;z-index:10000;transform:translate(7%,10%);box-shadow:2px 2px 20px 2px #888888;padding-top:15px;padding-bottom:15px;">
    <!-- 
    <div id="popup-word"
    style="padding-top:8px;padding-left:28px;padding-bottom:8px;padding-right:30px;display:flex;justify-content:center;font-weight:bold;">
    </div>
    <div id='popup-count' style="padding:8px 30px 8px 30px;">
    </div> 
    <div style="padding:5px;border-bottom:1px solid grey"></div>
    <div style="padding:5px"></div> 
    -->
    <div id="popup-links"></div>
    </div>`;
    div.id = 'popup'
    document.body.appendChild(div);
    document.getElementById('popup-links').innerHTML = data.item[2].map(link =>
        `<div id="highlight" style="padding:8px 30px 8px 30px;"><a style="color:black;font-family:raleway;text-decoration:none;"href=${link.link} target="_blank" rel="noreferrer">${link.label.charAt(0).toUpperCase() + link.label.slice(1, link.label.length)}</a></div>`).join('')


});
const popup = () => {
    var element = document.getElementById('popup');
    element.parentNode.removeChild(element);
}