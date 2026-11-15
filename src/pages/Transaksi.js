import React from "react";
import axios from "axios";
import { baseUrl, formatNumber, authorization } from "../config";

class Transaksi extends React.Component {
    constructor() {
        super();
        this.state = {
            transaksi: [],
            loading: true,
            error: "",
        };
        if (!localStorage.getItem("token")) {
            window.location.href = "/login";
        }
    }
    getData() {
        let endpoint = `${baseUrl}/transaksi`;
        axios
            .get(endpoint, authorization)
            .then((response) => {
                if (!Array.isArray(response.data)) {
                    throw new Error("The transaction response is not a list");
                }

                const dataTransaksi = response.data.map((transaction) => {
                    const details = Array.isArray(transaction.detail_transaksi)
                        ? transaction.detail_transaksi
                        : [];
                    const total = details.reduce((sum, detail) => {
                        const harga = Number(detail.paket?.harga || 0);
                        return sum + (harga * Number(detail.qty || 0));
                    }, 0);

                    return { ...transaction, detail_transaksi: details, total };
                });

                this.setState({ transaksi: dataTransaksi, loading: false, error: "" });
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                    return;
                }

                this.setState({
                    loading: false,
                    error: error.response?.data?.message || "Unable to load transactions. Check that the backend is running."
                });
            });
    }
    convertStatus(id_transaksi, status) {
        if (status === 1) {
            return (
                <div className="transaction-status status-new">
                    <span><i className="far fa-clock"></i> Transaksi Baru</span>
                    <button type="button"
                        onClick={() => this.changeStatus(id_transaksi, 2)}
                        className="status-action"
                    >Update status
                    </button>
                </div>
            );
        } else if (status === 2) {
            return (
                <div className="transaction-status status-processing">
                    <span><i className="far fa-hourglass"></i> Sedang Diproses</span>
                    <button type="button"
                        onClick={() => this.changeStatus(id_transaksi, 3)}
                        className="status-action"
                    >Update status
                    </button>
                </div>
            );
        } else if (status === 3) {
            return (
                <div className="transaction-status status-ready">
                    <span><i className="fas fa-external-link-alt"></i> Siap Diambil</span>
                    <button type="button"
                        onClick={() => this.changeStatus(id_transaksi, 4)}
                        className="status-action"
                    >Update status
                    </button>
                </div>
            );
        } else if (status === 4) {
            return (
                <div className="transaction-status status-complete">
                    <span><i className="far fa-calendar-check"></i> Sudah Diambil</span>
                </div>
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
                .post(endpoint, data, authorization)
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
                <div className="transaction-status payment-unpaid">
                    <span>Belum Dibayar</span>
                    <button type="button"
                        className="status-action"
                        onClick={() => this.changeStatusBayar(id_transaksi, 1)}
                    >Tandai dibayar
                    </button>
                </div>
            );
        } else if (dibayar == 1) {
            return <div className="transaction-status payment-paid"><span><i className="far fa-calendar-check"></i> Sudah Dibayar</span></div>;
        }
    }
    changeStatusBayar(id, status) {
        if (window.confirm(`Apakah anda yakin mengubah status pembayaran ini?`)) {
            let endpoint = `${baseUrl}/transaksi/bayar/${id}`;
            axios
                .get(endpoint, authorization)
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
            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    render() {
        return (

            <div className="container catalog-page">
                <div className="card">
                    <div className="card-header bg-dark">
                        <h4 className="text-white" align="center">
                            List Transaksi
                        </h4>
                    </div>
                    <div className="card-body">
                        {this.state.loading && <div className="page-state">Loading transactions...</div>}
                        {this.state.error && <div className="form-alert">{this.state.error}</div>}
                        {!this.state.loading && !this.state.error && this.state.transaksi.length === 0 && (
                            <div className="page-state">No transactions have been recorded yet.</div>
                        )}
                        {!this.state.error && <ul className="list-group">
                            {this.state.transaksi.map(trans => (
                                <li className="list-group-item">
                                    <div className="row">
                                        {/* Area Member */}
                                        <div className="col-lg-3">
                                            <small className="text-primary">
                                                Member
                                            </small> <br />
                                            {trans.member?.nama || "Member unavailable"}
                                        </div>

                                        {/* Area Status */}
                                        <div className="col-lg-3">
                                            <small className="text-primary">
                                                Status
                                            </small> <br />
                                            {this.convertStatus(trans.id_transaksi, trans.status)}
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
                                                        {detail.paket?.jenis_paket || "Package unavailable"}
                                                    </div>
                                                    {/* area quantity col-2 */}
                                                    <div className="col-lg-2">
                                                        Qty : {formatNumber(detail.qty)}
                                                    </div>
                                                    {/* area harga paket col-3 */}
                                                    <div className="col-lg-3">
                                                        <b> @ </b> Rp. {formatNumber(detail.paket?.harga || 0)}
                                                    </div>
                                                    {/* area harga total col-4 */}
                                                    <div className="col-lg-4">
                                                        Rp. {formatNumber((detail.paket?.harga || 0) * detail.qty)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>}
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