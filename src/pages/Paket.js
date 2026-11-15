import React from "react"
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config";
class Paket extends React.Component {
    constructor() {
        super()
        this.state = {
            id_paket: Math.random(1, 1000000),
            jenis_paket: "",
            harga: "",
            paket: []
        }
    }

    getData() {
        axios.get(`${baseUrl}/paket`, authorization)
            .then(response => this.setState({ paket: response.data }))
            .catch(error => window.alert(error.response?.data?.message || "Paket gagal dimuat."));
    }

    componentDidMount() {
        this.getData();
    }

    tambahData() {
        this.modalPaket = new Modal(document.getElementById("modal_paket"))
        this.modalPaket.show()

        this.setState({
            action: "tambah",
            id_paket: Math.random(1, 1000000),
            jenis_paket: "Cuci Setrika",
            harga: ""
        })
    }

    simpanData(event) {
        event.preventDefault();

        const data = {
            jenis_paket: this.state.jenis_paket,
            harga: this.state.harga,
        }
        const request = this.state.action === "tambah"
            ? axios.post(`${baseUrl}/paket`, data, authorization)
            : axios.put(`${baseUrl}/paket/${this.state.id_paket}`, data, authorization)

        request
            .then(response => {
                this.modalPaket.hide()
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => window.alert(error.response?.data?.message || "Paket gagal disimpan."))
    }

    ubahData(id_paket) {
        this.modalPaket = new Modal(document.getElementById("modal_paket"))
        this.modalPaket.show()

        let index = this.state.paket.findIndex(
            paket => paket.id_paket === id_paket
        )

        this.setState({
            action: "ubah",
            id_paket: id_paket,
            jenis_paket: this.state.paket[index].jenis_paket,
            harga: this.state.paket[index].harga,
        })
    }

    hapusData(id_paket) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            axios.delete(`${baseUrl}/paket/${id_paket}`, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => window.alert(error.response?.data?.message || "Paket gagal dihapus."))
        }
    }

    render() {
        return (
            <div className="container catalog-page">
                <div className="card">
                    <div className="card-header bg-dark">
                        <h3 className="text-white" align="center">
                            List of Package
                        </h3>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.paket.map(paket => (
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <small className="text-info">Jenis Paket</small> <br />
                                            <h6>{paket.jenis_paket}</h6>
                                        </div>
                                        <div className="col-lg-5">
                                            <small className="text-info">Harga</small> <br />
                                            <h6>{paket.harga}</h6>
                                        </div>

                                        <div className="col-lg-1">
                                            <div className="d-grid gap-2">
                                                <button className="btn btn-sm btn-warning"
                                                    onClick={() => this.ubahData(paket.id_paket)}>
                                                    Edit
                                                </button>

                                                <button className="btn btn-sm btn-danger"
                                                    onClick={() => this.hapusData(paket.id_paket)}>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <br /><button className="btn btn-success btn-sm my-1"
                            onClick={() => this.tambahData()}>Tambah Data</button>
                    </div>
                </div>
                <div className="modal" id="modal_paket">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header bg-success">
                                <h4 className="text-white">
                                    Form Data Package
                                </h4>
                            </div>
                            <form onSubmit={ev => this.simpanData(ev)}>
                                <div className="modal-body">
                                    Jenis Paket
                                    <select className="form-control mb-2" value={this.state.jenis_paket}
                                        onChange={(ev) => this.setState({ jenis_paket: ev.target.value })}>
                                        <option value="Cuci Setrika">Cuci Setrika</option>
                                        <option value="Cuci">Cuci</option>
                                        <option value="Setrika">Setrika</option>
                                    </select>

                                    Harga
                                    <input type="text" className="form-control mb2" value={this.state.harga}
                                        onChange={(ev) => this.setState({ harga: ev.target.value })} /> <br />

                                    <button className="btn btn-success">
                                        SIMPAN
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Paket