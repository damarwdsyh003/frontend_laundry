import React from "react";
import axios from "axios";
import { baseUrl, formatNumber } from "../config";

class Transaksi extends React.Component {
    constructor() {
        super();
        this.state = {
            transaksi: [],
        };
    }
    getData() {
        let endpoint = `${baseUrl}/transaksi`;
        axios
            .get(endpoint)
            .then((response) => {
                let dataTransaksi = response.data;
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga;
                        let qty = dataTransaksi[i].detail_transaksi[j].qty;

                        total += (harga * qty);
                    }

                    //tambah key "total"
                    dataTransaksi[i].total = total;
                }
                this.setState({ transaksi: dataTransaksi });
            })
            .catch((error) => console.log(error));
    }
    convertStatus(id_transaksi, status) {
        if (status === 1) {
            return (
                <div className="badge bg-secondary"><i class='far fa-clock'></i> Transaksi Baru
                    <br />
                    <br />
                    <button type="submit"
                        onClick={() => this.changeStatus(id_transaksi, 2)}
                        className="btn btn-sm btn-outline-light"
                    ><i class='far fa-caret-square-up'></i> update status
                    </button>
                </div>
            );
        } else if (status === 2) {
            return (
                <div className="badge bg-warning"> <i class='far fa-hourglass'></i> Sedang Diproses
                    <br />
                    <br />
                    <button
                        onClick={() => this.changeStatus(id_transaksi, 3)}
                        className="btn btn-sm btn-outline-light"
                    ><i class='far fa-caret-square-up'></i> update status
                    </button>
                </div>
            );
        } else if (status === 3) {
            return (
                <div className="badge bg-danger"> <i class='fas fa-external-link-alt'></i> Siap Diambil
                    <br />
                    <br />
                    <button type="submit"
                        onClick={() => this.changeStatus(id_transaksi, 4)}
                        className="btn btn-sm btn-outline-light"
                    ><i class='far fa-caret-square-up'></i> update status
                    </button>
                </div>
            );
        } else if (status === 4) {
            return (
                <div className="badge bg-success"> <i class='far fa-calendar-check'></i> Sudah Diambil</div>
            )
        }

    }


    // LANJUTAN
    componentDidMount() {
        this.getData();
    }

    changeStatus(id, status) {
        if (
            window.confirm(`Apakah anda yakin ingin mengganti status transaksi ini?`)
        ) {
            let endpoint = `${baseUrl}/transaksi/status/${id}`;
            let data = {
                status: status,
            };

            axios
                .post(endpoint, data)
                .then((response) => {
                    window.alert(`Status transaksi telah diubah`);
                    this.getData();
                })
                .catch((error) => console.log(error));
        }
    }

    convertStatusBayar(id_transaksi, dibayar) {
        if (dibayar == 0) {
            return (
                <div className="badge bg-danger text-white">
                    Belum Dibayar
                    <br />
                    <br />
                    <div> </div>
                    <button type="submit"
                        className="btn btn-sm btn-outline-light"
                        onClick={() => this.changeStatusBayar(id_transaksi, 1)}
                    ><i class='far fa-caret-square-up'></i> update pembayaran
                    </button>
                </div>
            );
        } else if (dibayar == 1) {
            return <div className="badge bg-success text-white"> <i class='far fa-calendar-check'></i> Sudah Dibayar </div>;
        }
    }
    changeStatusBayar(id, status) {
        if (window.confirm(`Apakah anda yakin mengubah status pembayaran ini?`)) {
            let endpoint = `${baseUrl}/transaksi/bayar/${id}`;
            axios
                .get(endpoint)
                .then((response) => {
                    window.alert(`Status pembayaran telah diubah`);
                    this.getData();
                })
                .catch((error) => console.log(error));
        }
    }

    deleteTransaksi(id) {
        if (window.confirm(`Apakah anda yakin menghapus transaksi ini ?`)) {
            let endpoint = `${baseUrl}/transaksi/${id}`
            axios.delete(endpoint)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    render() {
        return (

            <div className="container">
                <div className="card">
                    <div className="card-header bg-dark">
                        <h4 className="text-white" align="center">
                            List Transaksi
                        </h4>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.transaksi.map(trans => (
                                <li className="list-group-item">
                                    <div className="row">
                                        {/* Area Member */}
                                        <div className="col-lg-3">
                                            <small className="text-primary">
                                                Member
                                            </small> <br />
                                            {trans.member.nama}
                                        </div>

                                        {/* Area Tanggal Transaksi */}
                                        <div className="col-lg-3">
                                            <small className="text-primary">
                                                Tanggal Transaksi
                                            </small> <br />
                                            {trans.tgl}
                                        </div>

                                        { /* Area Batas Waktu */}
                                        <div className="col-lg-3">
                                            <small className="text-primary">
                                                Batas Waktu
                                            </small> <br />
                                            {trans.batas_waktu}
                                        </div>

                                        {/* Area Tanggal Bayar */}
                                        <div className="col-lg-3">
                                            <small className="text-primary">
                                                Tanggal Bayar
                                            </small> <br />
                                            {trans.tgl_bayar}
                                        </div>

                                        {/* Area Status */}
                                        <div className="col-lg-3">
                                            <small className="text-primary">
                                                Status
                                            </small> <br />
                                            {this.convertStatus(trans.id_transaksi, trans.status)}
                                        </div>
                                        {/* Status Pembayaran Area */}
                                        <div className="col-lg-3">
                                            <small className="text-primary">Status Pembayaran</small>{" "}
                                            <br />
                                            {this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}
                                        </div>
                                        {/* this is total */}
                                        <div className="col-lg-3">
                                            <small className="text-primary">Total</small> <br />
                                            Rp. {formatNumber(trans.total)}
                                        </div>
                                        {/* this is delete button */}
                                        <div className="col-lg-3">
                                            <small className="text-primary">Option</small> <br />
                                            <button
                                                className="btn btn-sm btn-danger "
                                                onClick={() => this.deleteTransaksi(trans.id_transaksi)}> <i class="fas fa-trash"></i> Hapus
                                            </button>
                                        </div>
                                    </div>
                                    <br />
                                    {/* area detail transaksi */}
                                    <div className="card">
                                        <div className="card-header bg-light">
                                            <h5>Detail Transaksi</h5>
                                            {trans.detail_transaksi.map(detail => (
                                                <div className="row">
                                                    {/* area nama paket col-3 */}
                                                    <div className="col-lg-3">
                                                        {detail.paket.jenis_paket}
                                                    </div>
                                                    {/* area quantity col-2 */}
                                                    <div className="col-lg-2">
                                                        Qty : {formatNumber(detail.qty)}
                                                    </div>
                                                    {/* area harga paket col-3 */}
                                                    <div className="col-lg-3">
                                                        <b> @ </b> Rp. {formatNumber(detail.paket.harga)}
                                                    </div>
                                                    {/* area harga total col-4 */}
                                                    <div className="col-lg-4">
                                                        Rp. {formatNumber(detail.paket.harga * detail.qty)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

        )
    }
}
export default Transaksi;
// import React from "react"
// import axios from "axios"
// import { baseUrl, formatNumber } from "../config";

// export default class Transaksi extends React.Component {
//     constructor() {
//         super()
//         this.state = {
//             transaksi: []
//         }
//     }

//     getData() {
//         let endpoint = "http://localhost:8000/transaksi"
//         axios.get(endpoint)
//             .then(response => {
//                 let dataTransaksi = response.data
//                 for(let i = 0; i < dataTransaksi.length; i++) {
//                     let total = 0;
//                     for (let j = 0; j < dataTransaksi[i]; j++) {
//                         let harga = dataTransaksi[i].detail_transaksi[i].paket.harga
//                         let qty = dataTransaksi[i].detail_transaksi[i].qty
                        
//                         total += (harga * qty)
//                     }
//                     dataTransaksi[i].total = total
//                 }
//                 this.setState({ transaksi: response.data })
//             })
//             .catch(error => console.log(error))
//     }

//     componentDidMount() {
//         this.getData()
//     }

//     convertStatus(status) {
//         if (status === 1) {
//             return (
//                 <div className="badge bg-info">
//                     Transaksi Baru
//                 </div>
//             )
//         } else if (status === 2) {
//             return (
//                 <div className="badge bg-warning">
//                     Sedang Diproses
//                 </div>
//             )
//         } else if (status === 3) {
//             return (
//                 <div className="badge bg-secondary">
//                     Siap Diambil
//                 </div>
//             )
//         } else if (status === 4) {
//             return (
//                 <div className="badge bg-success">
//                     Sudah Diambil
//                 </div>
//             )
//         }
//     }

//     changeStatus(id, status) {
//         if (
//             window.confirm(`Apakah anda yakin ingin mengganti status transaksi ini?`)
//         ) {
//             let endpoint = `${baseUrl}/transaksi/status/${id}`;
//             let data = {
//                 status: status,
//             };

//             axios
//                 .post(endpoint, data)
//                 .then((response) => {
//                     window.alert(`Status transaksi telah diubah`);
//                     this.getData();
//                 })
//                 .catch((error) => console.log(error));
//         }
//     }

//     convertStatusBayar(id_transaksi, dibayar) {
//         if (dibayar === 0) {
//             return (
//                 <div className="badge bg-danger text-white">
//                     Belum Dibayar
//                     <br />
//                     <br />
//                     <div> </div>
//                     <button type="submit"
//                         className="btn btn-sm btn-outline-light"
//                         onClick={() => this.changeStatusBayar(id_transaksi, 1)}
//                     ><i class='far fa-caret-square-up'></i> update pembayaran
//                     </button>
//                 </div>
//             );
//         } else if (dibayar === 1) {
//             return <div className="badge bg-success text-white"> <i class='far fa-calendar-check'></i> Sudah Dibayar </div>;
//         }
//     }
//     changeStatusBayar(id, status) {
//         if (window.confirm(`Apakah anda yakin mengubah status pembayaran ini?`)) {
//             let endpoint = `${baseUrl}/transaksi/bayar/${id}`;
//             axios
//                 .get(endpoint)
//                 .then((response) => {
//                     window.alert(`Status pembayaran telah diubah`);
//                     this.getData();
//                 })
//                 .catch((error) => console.log(error));
//         }
//     }

//     deleteTransaksi(id) {
//         if (window.confirm(`Apakah anda yakin menghapus transaksi ini ?`)) {
//             let endpoint = `${baseUrl}/transaksi/${id}`
//             axios.delete(endpoint)
//                 .then(response => {
//                     window.alert(response.data.message)
//                     this.getData()
//                 })
//                 .catch(error => console.log(error))
//         }
//     }

//     render() {
//         return (
//             <div className="container">
//                 <div className="card">
//                     <div className="card-header bg-danger">
//                         <h4 className="text-white" align="center">
//                             List Transaksi
//                         </h4>
//                     </div>

//                     <div className="card-body">
//                         <ul className="list-group">
//                             {this.state.transaksi.map(trans => (
//                                 <li className="list-group-item">
//                                     <div className="row">
//                                         { }
//                                         <div className="col-lg-3">
//                                             <small className="text-info">
//                                                 Member
//                                             </small> <br />
//                                             {trans.member.nama}
//                                         </div>

//                                         { }
//                                         <div className="col-lg-3">
//                                             <small className="text-info">
//                                                 Tanggal Transaksi
//                                             </small> <br />
//                                             {trans.tgl}
//                                         </div>

//                                         { }
//                                         <div className="col-lg-3">
//                                             <small className="text-info">
//                                                 Batas Waktu
//                                             </small> <br />
//                                             {trans.batas_waktu}
//                                         </div>

//                                         { }
//                                         <div className="col-lg-3">
//                                             <small className="text-info">
//                                                 Tanggal Bayar
//                                             </small> <br />
//                                             {trans.tgl_bayar}
//                                         </div>

//                                         { }
//                                         <div className="col-lg-3">
//                                             <small className="text-info">
//                                                 Status
//                                             </small> <br />
//                                             {this.convertStatus(trans.status)}
//                                         </div>
//                                         <div className="col-lg-3">
//                                             <small className="text-danger">Status Pembayaran</small>{" "}
//                                             <br />
//                                             {this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}
//                                         </div>
//                                         <div className="col-lg-3">
//                                             <small className="text-danger">Total</small> <br />
//                                             Rp. {formatNumber(trans.total)}
//                                         </div>
//                                         <div className="col-lg-3">
//                                             <small className="text-danger">Option</small> <br />
//                                             <button
//                                                 className="btn btn-sm btn-danger "
//                                                 onClick={() => this.deleteTransaksi(trans.id_transaksi)}> <i class="fas fa-trash"></i> Hapus
//                                             </button>
//                                         </div>
//                                     </div>                    
//                                     <h5>Detail Transaksi</h5>
//                                     {trans.detail_transaksi.map(detail => (
//                                         <div className="row">
//                                             {/* area nama paket col-3 */}
//                                             <div className="col-lg-3">
//                                                 {detail.paket.jenis_paket}
//                                             </div>
//                                             {/* area quantity col-2 */}
//                                             <div className="col-lg-2">
//                                                 Qty: {detail.qty}
//                                             </div>
//                                             {/* area harga paket col-3 */}
//                                             <div className="col-lg-3">
//                                                 @ Rp {detail.paket.harga}
//                                             </div>
//                                             {/* area harga total col-4 */}
//                                             <div className="col-lg-4">
//                                                 Rp {detail.paket.harga * detail.qty}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }