import React from "react";
import axios from "axios";
import { baseUrl, formatNumber, authorization } from "../config";


export default class Dashboard extends React.Component {
  constructor() {
    super();

    this.state = {
      jmlMember: 0,
      jmlPaket: 0,
      jmlTransaksi: 0,
      income: 0,
    };

    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }

  getSummary() {
    //get jumlah member
    let endpoint = `${baseUrl}/member`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ jmlMember: response.data.length });
      })
      .catch((error) => console.log(error));

    //get jumlah paket
    endpoint = `${baseUrl}/paket`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ jmlPaket: response.data.length });
      })
      .catch((error) => console.log(error));

    //get jumlah transaksi
    endpoint = `${baseUrl}/transaksi`
    axios
      .get(endpoint, authorization)
      .then((response) => {
        let dataTransaksi = response.data;
        let income = 0;
        for (let i = 0; i < dataTransaksi.length; i++) {
          let total = 0;
          for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
            let harga = dataTransaksi[i].detail_transaksi[j].paket.harga;
            let qty = dataTransaksi[i].detail_transaksi[j].qty;

            total += (harga * qty);
          }

          income += total;
        }
        this.setState({
          jmlTransaksi: response.data.length,
          income: income,
        });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    this.getSummary();
  }

  render() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const entries = [
      { number: "01", label: "Members", value: this.state.jmlMember, note: "registered customers", icon: "♧" },
      { number: "02", label: "Packages", value: this.state.jmlPaket, note: "services in your menu", icon: "◈" },
      { number: "03", label: "Transactions", value: this.state.jmlTransaksi, note: "orders in the log", icon: "⌁" },
      { number: "04", label: "Income", value: `Rp ${formatNumber(this.state.income)}`, note: "total recorded income", icon: "↗" },
    ];

    return (
      <div className="container dashboard-page catalog-dashboard">
        <div className="catalog-heading">
          <div>
            <span className="eyebrow">FreshFold / Daily catalog</span>
            <h1>Good morning, {user.nama || "there"}.</h1>
            <p>A considered view of everything moving through your laundry.</p>
          </div>
          <div className="catalog-edition"><span>EDITION</span><strong>11.15</strong><small>LIVE BOARD</small></div>
        </div>
        <div className="catalog-rule"><span>01</span><strong>AT A GLANCE</strong><span>THE WORK IN NUMBERS</span></div>
        <div className="catalog-grid">
          {entries.map((entry) => (
            <article className="catalog-entry" key={entry.number}>
              <div className="catalog-entry-top"><span>{entry.number}</span><b>{entry.icon}</b></div>
              <div className="catalog-entry-body">
                <p>{entry.label}</p>
                <h2>{entry.value}</h2>
                <small>{entry.note}</small>
              </div>
              <div className="catalog-entry-arrow">↗</div>
            </article>
          ))}
        </div>
        <div className="catalog-footer"><span>FreshFold operations catalog</span><span>Keep the day moving →</span></div>
      </div>
    );
  }
}


//       <div className="container">
//         <div className="row">
//           <div className="col-lg-3 col-md-6">
//             <div className="card text-center bg-success m-1 text-white">
//               <div className="card-body">
//                 <h4 className="card-title">Data Member</h4>
//                 <h2>{this.state.jmlMember}</h2>
//                 <h6>Member</h6>
//               </div>
//             </div>
//           </div>

//           <div className="col-lg-3 col-md-6">
//             <div className="card text-center bg-info m-1 text-white">
//               <div className="card-body">
//                 <h4 className="card-title">Data Paket</h4>
//                 <h2>{this.state.jmlPaket}</h2>
//                 <h6>Paket</h6>
//               </div>
//             </div>
//           </div>

//           <div className="col-lg-3">
//             <div className="card text-center card bg-secondary m-1 text-white">
//               <div className="card-body">
//                 <h4 className="card-title">Income</h4>
//                 <h2>Rp {formatNumber(this.state.income)}</h2>
//                 <h6>Transaksi Bersih</h6>
//               </div>
//             </div>
//           </div>

//           <div className="col-lg-3 col-md-6">
//             <div className="card text-center bg-dark m-1 text-white">
//               <div className="card-body">
//                 <h4 className="card-title">Data Transaksi</h4>
//                 <h2>{this.state.jmlTransaksi}</h2>
//                 <h6>Transaksi</h6>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }