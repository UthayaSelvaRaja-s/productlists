import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './componets/Dashboard';
import Addproduct from './componets/Addproduct/Addproduct';
import EditProduct from './componets/edit/Editproduct';

function App() {
  return (
    <Router>
    <div >
      <Routes>
        <Route path='/'element={<Dashboard/>}></Route>
        <Route path='/addproduct' element={<Addproduct/>}></Route> 
        <Route path="/edit-product/:id" element={<EditProduct />} />
     </Routes>
    </div>
    </Router>
  );
}

export default App;
