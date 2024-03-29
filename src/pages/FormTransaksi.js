import React from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { baseUrl, authorization } from "../config";

export default class FormTransaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            id_member: "",
            tgl: "",
            batas_waktu: "",
            tgl_bayar: "",
            dibayar: false,
            id_user: "",
            detail_transaksi: [],
            members: [],
            pakets: [],
            id_paket: "",
            qty: 0,
            jenis_paket: "",
            harga: 0
        }
    }
    hapusData(id_paket) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

            //mencari posisi index dari data yang akan dihapus
            let temp = this.state.detail_transaksi
            let index = temp.findIndex(detail => detail.id_paket === id_paket)

            //menghapus data pada array
            temp.splice(index, 1)

            this.setState({ members: temp })
        }

    }


    getMember() {
        let endpoint =  `${baseUrl}/member`;
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ members: response.data })
            })
            .catch(error => console.log(error))
    }

    getPaket() {
        let endpoint = `${baseUrl}/paket`;
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ pakets: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getMember();
        this.getPaket();

        // ROLE SELECT
        
    let user = JSON.parse(localStorage.getItem("user"));

    if(user.role !== 'Admin' && user.role !== 'kasir') {
      window.alert(
      `Maaf Anda tidak berhak untuk mengakses halaman ini`
      )
      window.location.href = "/"
    }
}

    tambahPaket(e) {
        e.preventDefault()
        //tutup modal
        this.modal.hide()
        //untuk menyimpan data paket yang dipilih
        //kedalam array detail_transaksi
        let idPaket = this.state.id_paket
        let selectedPaket = this.state.pakets.find(
            paket => paket.id_paket == idPaket
        )
        let newPaket = {
            id_paket: this.state.id_paket,
            qty: this.state.qty,
            jenis_paket: selectedPaket.jenis_paket,
            harga: selectedPaket.harga
        }

        //ambil array detalit_transaksinya
        let temp = this.state.detail_transaksi
        temp.push(newPaket)
        this.setState({ detail_transaksi: temp })
    }

    addPaket() {
        //menampilkan form modal untuk 
        this.modal = new Modal(document.getElementById('modal_paket')
        )
        this.modal.show()

        //kosongkan formnya
        this.setState({
            id_paket: "",
            qty: 0,
            jenis_paket: "",
            harga: 0
        })
    }
    simpanTransaksi() {
        let endpoint = `${baseUrl}/transaksi`;
        let user = JSON.parse(localStorage.getItem("user"));
        let newData = {
            id_member: this.state.id_member,
            batas_waktu: this.state.batas_waktu,
            tgl: this.state.tgl,
            tgl_bayar: this.state.tgl_bayar,
            dibayar: this.state.dibayar,
            id_user: this.state.user,
            detail_transaksi: this.state.detail_transaksi,
        };

        axios
            .post(endpoint, newData, authorization)
            .then((response) => {
                window.alert(response.data.message);
            })
            .catch((error) => console.log(error));
    }

    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header bg-dark">
                        <h4 className="text-white" align="center">
                            Form Transaksi
                        </h4>
                    </div>
                    <div className="card-body">
                        Member
                        <select className="form-control mb-2"
                            value={this.state.id_member}
                            onChange={e => this.setState({ id_member: e.target.value })}>
                            {this.state.members.map(member => (
                                <option value={member.id_member}>
                                    {member.nama}
                                </option>
                            ))}
                        </select>
                        tanggal Transaksi
                        <input type="date" className="form-control mb-2"
                            value={this.state.tgl}
                            onChange={e => this.setState({ tgl: e.target.value })} />


                        Batas Waktu
                        <input type="date" className="form-control mb-2"
                            value={this.state.batas_waktu}
                            onChange={e => this.setState({ batas_waktu: e.target.value })} />

                        Tanggal Bayar
                        <input type="date" className="form-control mb-2"
                            value={this.state.tgl_bayar}
                            onChange={e => this.setState({ tgl_bayar: e.target.value })} />

                        Status Bayar
                        <select className="form-control mb-2"
                            value={this.state.dibayar}
                            onChange={e => this.setState({ dibayar: e.target.value })}>
                            <option value={true}>Sudah Dibayar</option>
                            <option value={false}>Belum Dibayar</option>
                        </select>

                        <div className="card">
                            <div className="card-header bg-light">
                                {/* tampil isi detai */}
                                <h5>Detail Transaksi</h5>
                                {this.state.detail_transaksi.map(detail => (
                                    <div className="row">
                                        {/* area nama paket col-3 */}
                                        <div className="col-lg-3">
                                            <small className="text-dark"> Jenis </small> <br />
                                            {detail.jenis_paket}
                                        </div>

                                        {/* area quantity col-2 */}
                                        <div className="col-lg-2">
                                            <small className="text-dark"> Qty </small> <br />
                                            Qty: {detail.qty}
                                        </div>

                                        {/* area harga paket col-3 */}
                                        <div className="col-lg-3">
                                            <small className="text-dark"> Harga </small> <br />
                                            @ Rp {detail.harga}
                                        </div>

                                        {/* area harga total col-4 */}
                                        <div className="col-lg-3">
                                            <small className="text-dark"> Total </small> <br />
                                            Rp {detail.harga * detail.qty}
                                        </div>
                                        <div className="col-lg-1">

                                            <div className="d-grid gap-2">
                                                <button className="btn btn-sm btn-outline-dark  "
                                                    onClick={() => this.hapusData(detail.id_paket)}><i class="fas fa-trash"></i> Hapus
                                                </button>

                                                <button className="btn btn-sm btn-dark " type="submit"
                                                    onClick={() => this.simpanTransaksi()}>
                                                    Simpan
                                                </button>

                                                <br />
                                            </div>
                                        </div>
                                        <br />
                                        <hr />
                                    </div>

                                ))}
                            </div>
                        </div>
                        <br />
                        <button className=" btn btn-sm btn-outline-dark"
                            onClick={() => this.addPaket()}>
                            <i class="fas fa-plus"></i> Tambah Paket</button>

                        {/* modal untuk pilih paket */}
                        <div className="modal fade" id="modal_paket">
                            <div className="modal-dialog modal-md">
                                <div className="modal-content">
                                    <div className="modal-header bg-dark">
                                        <h4 className="text-white">
                                            Pilih Paket
                                        </h4>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={(e) => this.tambahPaket(e)}>
                                            Pilih paket
                                            <select className="form-control mb-2"
                                                value={this.state.id_paket}
                                                onChange={e => this.setState({ id_paket: e.target.value })}>
                                                <option value="">Pilih Paket</option>
                                                {this.state.pakets.map(paket => (
                                                    <option value={paket.id_paket}>
                                                        {paket.jenis_paket}
                                                    </option>
                                                ))}
                                            </select>

                                            Jumlah (qty)
                                            <input type="number" className="form-control mb-2"
                                                value={this.state.qty}
                                                onChange={e => this.setState({ qty: e.target.value })} />

                                            <button type="submit" className="btn btn-dark">
                                                Tambah
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}
// import React from "react";
// import axios from "axios";
// import { Modal } from "bootstrap";
// import { baseUrl, authorization } from "../config";

// export default class FormTransaksi extends React.Component {
//     constructor() {
//         super()
//         this.state = {
//             id_member: "",
//             tgl: "",
//             batas_waktu: "",
//             tgl_bayar: "",
//             dibayar: false,
//             id_user: "",
//             detail_transaksi: [],
//             members: [],
//             pakets: [],
//             id_paket: "",
//             qty: 0,
//             jenis_paket: "",
//             harga: 0
//         }
//     }
//     hapusData(id_paket) {
//         if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

//             //mencari posisi index dari data yang akan dihapus
//             let temp = this.state.detail_transaksi
//             let index = temp.findIndex(detail => detail.id_paket === id_paket)

//             //menghapus data pada array
//             temp.splice(index, 1)

//             this.setState({ members: temp })
//         }

//     }


//     getMember() {
//         let endpoint =  `${baseUrl}/member`;
//         axios.get(endpoint, authorization)
//             .then(response => {
//                 this.setState({ members: response.data })
//             })
//             .catch(error => console.log(error))
//     }

//     getPaket() {
//         let endpoint = `${baseUrl}/paket`;
//         axios.get(endpoint, authorization)
//             .then(response => {
//                 this.setState({ pakets: response.data })
//             })
//             .catch(error => console.log(error))
//     }

//     componentDidMount() {
//         this.getMember();
//         this.getPaket();

//         // ROLE SELECT
        
//     let user = JSON.parse(localStorage.getItem("user"));

//     if(user.role !== 'admin' && user.role !== 'kasir') {
//       window.alert(
//       `Maaf Anda tidak berhak untuk mengakses halaman ini`
//       )
//       window.location.href = "/"
//     }
// }

//     tambahPaket(e) {
//         e.preventDefault()
//         //tutup modal
//         this.modal.hide()
//         //untuk menyimpan data paket yang dipilih
//         //kedalam array detail_transaksi
//         let idPaket = this.state.id_paket
//         let selectedPaket = this.state.pakets.find(
//             paket => paket.id_paket === idPaket
//         )
//         let newPaket = {
//             id_paket: this.state.id_paket,
//             qty: this.state.qty,
//             jenis_paket: selectedPaket.jenis_paket,
//             harga: selectedPaket.harga
//         }

//         //ambil array detalit_transaksinya
//         let temp = this.state.detail_transaksi
//         temp.push(newPaket)
//         this.setState({ detail_transaksi: temp })
//     }

//     addPaket() {
//         //menampilkan form modal untuk 
//         this.modal = new Modal(document.getElementById('modal_paket')
//         )
//         this.modal.show()

//         //kosongkan formnya
//         this.setState({
//             id_paket: "",
//             qty: 0,
//             jenis_paket: "",
//             harga: 0
//         })
//     }
//     simpanTransaksi() {
//         let endpoint = `${baseUrl}/transaksi`;
//         let user = JSON.parse(localStorage.getItem("user"));
//         let newData = {
//             id_member: this.state.id_member,
//             batas_waktu: this.state.batas_waktu,
//             tgl: this.state.tgl,
//             tgl_bayar: this.state.tgl_bayar,
//             dibayar: this.state.dibayar,
//             id_user: this.state.user,
//             detail_transaksi: this.state.detail_transaksi,
//         };

//         axios
//             .post(endpoint, newData, authorization)
//             .then((response) => {
//                 window.alert(response.data.message);
//             })
//             .catch((error) => console.log(error));
//     }

//     render() {
//         return (
//             <div className="container">
//                 <div className="card">
//                     <div className="card-header bg-dark">
//                         <h4 className="text-white">
//                             𝙁𝙤𝙧𝙢 𝙏𝙧𝙖𝙣𝙨𝙖𝙠𝙨𝙞
//                         </h4>
//                     </div>
//                     <div className="card-body">
//                         Member
//                         <select className="form-control mb-2"
//                             value={this.state.id_member}
//                             onChange={e => this.setState({ id_member: e.target.value })}>
//                             {this.state.members.map(member => (
//                                 <option value={member.id_member}>
//                                     {member.nama}
//                                 </option>
//                             ))}
//                         </select>
//                         tanggal Transaksi
//                         <input type="date" className="form-control mb-2"
//                             value={this.state.tgl}
//                             onChange={e => this.setState({ tgl: e.target.value })} />


//                         Batas Waktu
//                         <input type="date" className="form-control mb-2"
//                             value={this.state.batas_waktu}
//                             onChange={e => this.setState({ batas_waktu: e.target.value })} />

//                         Tanggal Bayar
//                         <input type="date" className="form-control mb-2"
//                             value={this.state.tgl_bayar}
//                             onChange={e => this.setState({ tgl_bayar: e.target.value })} />

//                         Status Bayar
//                         <select className="form-control mb-2"
//                             value={this.state.dibayar}
//                             onChange={e => this.setState({ dibayar: e.target.value })}>
//                             <option value={true}>Sudah Dibayar</option>
//                             <option value={false}>Belum Dibayar</option>
//                         </select>

//                         <div className="card">
//                             <div className="card-header bg-light">
//                                 {/* tampil isi detai */}
//                                 <h5>Detail Transaksi</h5>
//                                 {this.state.detail_transaksi.map(detail => (
//                                     <div className="row">
//                                         {/* area nama paket col-3 */}
//                                         <div className="col-lg-3">
//                                             <small className="text-dark"> Jenis </small> <br />
//                                             {detail.jenis_paket}
//                                         </div>

//                                         {/* area quantity col-2 */}
//                                         <div className="col-lg-2">
//                                             <small className="text-dark"> Qty </small> <br />
//                                             Qty: {detail.qty}
//                                         </div>

//                                         {/* area harga paket col-3 */}
//                                         <div className="col-lg-3">
//                                             <small className="text-dark"> Harga </small> <br />
//                                             @ Rp {detail.harga}
//                                         </div>

//                                         {/* area harga total col-4 */}
//                                         <div className="col-lg-3">
//                                             <small className="text-dark"> Total </small> <br />
//                                             Rp {detail.harga * detail.qty}
//                                         </div>
//                                         <div className="col-lg-1">

//                                             <div className="d-grid gap-2">
//                                                 <button className="btn btn-sm btn-outline-dark  "
//                                                     onClick={() => this.hapusData(detail.id_paket)}><i class="fas fa-trash"></i> Hapus
//                                                 </button>

//                                                 <button className="btn btn-sm btn-dark " type="submit"
//                                                     onClick={() => this.simpanTransaksi()}>
//                                                     Simpan
//                                                 </button>

//                                                 <br />
//                                             </div>
//                                         </div>
//                                         <br />
//                                         <hr />
//                                     </div>

//                                 ))}
//                             </div>
//                         </div>
//                         <br />
//                         <button className=" btn btn-sm btn-outline-dark"
//                             onClick={() => this.addPaket()}>
//                             <i class="fas fa-plus"></i> Tambah Paket</button>

//                         {/* modal untuk pilih paket */}
//                         <div className="modal fade" id="modal_paket">
//                             <div className="modal-dialog modal-md">
//                                 <div className="modal-content">
//                                     <div className="modal-header bg-dark">
//                                         <h4 className="text-white">
//                                             Pilih Paket
//                                         </h4>
//                                     </div>
//                                     <div className="modal-body">
//                                         <form onSubmit={(e) => this.tambahPaket(e)}>
//                                             Pilih paket
//                                             <select className="form-control mb-2"
//                                                 value={this.state.id_paket}
//                                                 onChange={e => this.setState({ id_paket: e.target.value })}>
//                                                 <option value="">Pilih Paket</option>
//                                                 {this.state.pakets.map(paket => (
//                                                     <option value={paket.id_paket}>
//                                                         {paket.jenis_paket}
//                                                     </option>
//                                                 ))}
//                                             </select>

//                                             Jumlah (qty)
//                                             <input type="number" className="form-control mb-2"
//                                                 value={this.state.qty}
//                                                 onChange={e => this.setState({ qty: e.target.value })} />

//                                             <button type="submit" className="btn btn-dark">
//                                                 Tambah
//                                             </button>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>


//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }