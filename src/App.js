import React from "react";
import NotFound from "./notfound";
import Member from "./pages/Member";
import Paket from "./pages/Paket";
import Users from "./pages/Users";
import FormTransaksi from "./pages/FormTransaksi";
import Login from "./pages/Login";
import header from "./header";
import Navbar from "./components/Navbar";
import  Footer from "./footer";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import Transaksi from "./pages/Transaksi";
import './style.css'


export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar> <Dashboard /> </Navbar>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/member" element={<Navbar> <Member /> </Navbar> } />
          <Route path="/paket" element={<Navbar> <Paket />  </Navbar>} />
          <Route path="/users" element={<Navbar> <Users /> </Navbar> } />
          <Route path="/transaksi" element={<Navbar> <Transaksi /> </Navbar> } />
          <Route path="/formtransaksi" element={ <Navbar> <FormTransaksi /> </Navbar> } />
        </Routes>
        {/* <Footer /> */}
    </BrowserRouter>
    
  );
}


// import React from "react";
// import NotFound from "./notfound";
// import Member from "./pages/Member"
// import Header from "./header"
// import Footer from "./footer"
// import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
// import Transaksi from "./pages/Transaksi";
// import FormTransaksi from "./pages/FormTransaksi";
// import Paket from "./pages/Paket";
// import Users from "./pages/Users";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";


// export default function App() {
//   return (
//     <BrowserRouter>
//       <div className="container">
//         <div class="row">
//           <div className="col-12 col-md-8">
//             <div class="nav nav-pills mb-3 px-2">
//               <a class="nav-link" data-toggle="pill" href="/" role="tab">Login</a>
//               <a class="nav-link" data-toggle="pill" href="/dashboard" role="tab">Dashboard</a>
//               <a class="nav-link" data-toggle="pill" href="/member" role="tab">Member</a>
//               <a class="nav-link" data-toggle="pill" href="/users" role="tab">Users</a>
//               <a class="nav-link" data-toggle="pill" href="/paket" role="tab">Paket</a>
//               <a class="nav-link" data-toggle="pill" href="/transaksi" role="tab">Transaksi</a>
//               <a class="nav-link" data-toggle="pill" href="/formtransaksi" role="tab">Form Transaksi</a>
//             </div>
//           </div>
//         </div>
//         {/* <ul>
//         <li>
//           <Link to="/">Home</Link>
//         </li>
//         <li>
//           <Link to="/member">Member</Link>
//         </li>
//         <li>
//           <Link to="/users">Users</Link>
//         </li>
//         <li>
//           <Link to="/paket">Paket</Link>
//         </li>
//         <li>
//           <Link to="/transaksi">Transaksi</Link>
//         </li>
//         <li>
//           <Link to="/formtransaksi">Form Transaksi</Link>
//         </li>
//       </ul> */}
//         <Routes>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/" element={<Login />} />
//           <Route path="/member" element={<Member />} />
//           <Route path="/users" element={<Users />} />
//           <Route path="/paket" element={<Paket />} />
//           <Route path="/transaksi" element={<Transaksi />} />
//           <Route path="/formtransaksi" element={<FormTransaksi />} />
//           <Route component={NotFound} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }
