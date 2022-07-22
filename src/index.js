import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import './App.css'
import Upload from './pages/upload'

export default function Home() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />}>
        </Route>
        <Route exact path="/upload" element={<Upload />}> </Route>
      </Routes>
    </BrowserRouter >
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Home />);