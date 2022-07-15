import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import './App.css'


export default function Home() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Home />);