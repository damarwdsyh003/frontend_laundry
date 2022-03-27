import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config";

//nama class member sesuai dengan file
class Users extends React.Component {
  constructor() {
    super();
    this.state = {
      id_user: 0,
      nama: "",
      username: "",
      password: "",
      role: "",
      action: "",

      users: [],
    };
  }
  tambahData() {
    //memunculkan modal
    this.modalUser = new Modal(document.getElementById("modal-user"));
    this.modalUser.show();

    //mengosongkan inputannya
    this.setState({
      nama: "",
      username: "",
      password: "",
      role: "Admin",
      id_user: Math.random(1, 10000000),
      action: "tambah",
    });
  }

  simpanData(event) {
    event.preventDefault();
    //event preventDefault adalah mencegah aksi default dari form submit

    //menghilangkan modal
    this.modalUser.hide();

    //cek aksi tambah atau ubah
    if (this.state.action === "tambah") {
      //menampung data dari pengguna
      let endpoint = `${baseUrl}/users`;
      let newUser = {
        id_user: this.state.id_user,
        nama: this.state.nama,
        username: this.state.username,
        password: this.state.password,
        role: this.state.role,
      };

      //let temp = this.state.users
      //temp.push(newUser)

      //this.setState({users: temp})
      axios
        .post(endpoint, newUser, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
    } else if (this.state.action === "ubah") {
      this.modalUser.hide();
      let endpoint = `${baseUrl}/users/` + this.state.id_user;
      let newUser = {
        id_user: this.state.id_user,
        nama: this.state.nama,
        username: this.state.username,
        password: this.state.password,
        role: this.state.role,
      };
      axios
        .put(endpoint, newUser, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));

      //mencari posisi index dari data member
      //berdasarkan id member nya pada array "members"

      let index = this.state.users.findIndex(
        (user) => user.id_user === this.state.id_user
      );

      //let temp = this.state.users
      //temp[index].nama = this.state.nama
      //temp[index].username = this.state.username
      //temp[index].password = this.state.password
      //temp[index].role = this.state.role

      //this.setState({ users:temp })
    }
  }

  ubahData(id_user) {
    this.modalUser = new Modal(document.getElementById("modal-user"));
    this.modalUser.show();

    //mencari posisi index dari data user
    //berdasarkan id user nya pada array "users"

    let index = this.state.users.findIndex((user) => user.id_user == id_user);

    this.setState({
      id_user: this.state.users[index].id_user,
      nama: this.state.users[index].nama,
      username: this.state.users[index].username,
      password: "",
      role: this.state.users[index].role,
      action: "ubah",
    });
  }

  hapusData(id_user) {
    if (window.confirm("Apakah anda yakin menghapus data ini?")) {
      //mencari posisi index dari data yang akan dihapus

      let endpoint = `${baseUrl}/users/${id_user}`
      axios
        .delete(endpoint, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
      //let temp = this.state.users
      //let index = temp.findIndex(
      //    user => user.id_user === id_user)

      //menghapus data pada array
      //temp.splice(index, 1)

      //this.setState({user: temp})
    }
  }

  getData() {
    let endpoint = `${baseUrl}/users`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    this.getData();
    let user = JSON.parse(localStorage.getItem("user"));

    // cara pertama
    this.setState({
      role: user.role,
    })

    //cara kedua
    if (user.role === "Admin" || user.role === "Kasir") {
      this.setState({
        visible : true
      })     
  }else {
    this.setState({
      visible : false
    })
  }
}

showAddButton() {
  if (this.state.role === "Admin" || this.state.role === "Kasir") {
    return (
      <button
        className="btn btn-success me-md-2"
        type="button"
        onClick={() => this.tambahData()}>
          Tambah
      </button>
    );
  }
}

    render(){
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header bg-dark">
                        <h3 className="text-white" align="center">
                            List of Users
                        </h3>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.users.map(user => (
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-lg-5">
                                            <small className="text-info">Nama</small> <br />
                                            <h6>{user.nama}</h6>
                                        </div>
                                        <div className="col-lg-3">
                                            <small className="text-info">Username</small> <br />
                                            <h6>{user.username}</h6>
                                        </div>
                                        <div className="col-lg-3">
                                            <small className="text-info">Role</small> <br />
                                            <h6>{user.role}</h6>
                                        </div>
                                     
                                        <div className="col-lg-1">
                                            <div className="d-grid gap-2">
                                                <button className="btn btn-sm btn-warning"
                                                    onClick={() => this.ubahData(user.id_users)}>
                                                    Edit
                                                </button>

                                                <button className="btn btn-sm btn-danger"
                                                    onClick={() => this.hapusData(user.id_users)}>
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
                <div className="modal" id="modal_users">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header bg-success">
                                <h4 className="text-white">
                                    Form Data Users
                                </h4>
                            </div>
                            <form onSubmit={ev => this.simpanData(ev)}>
                            <div className="modal-body">
                                Nama 
                                <input type="text" className="form-control mb-2" value={this.state.nama} 
                                onChange={(ev) => this.setState({nama: ev.target.value})} />

                                Username
                                <input type="text" className="form-control mb-2" value={this.state.username} 
                                onChange={(ev) => this.setState({username: ev.target.value})} />

                                Password
                                <input type="text" className="form-control mb-2" value={this.state.password} 
                                onChange={(ev) => this.setState({password: ev.target.value})} />

                                Role
                                <select className="form-control mb-2" value={this.state.role}
                                onChange={(ev) => this.setState({role: ev.target.value})}>
                                    <option value="Admin">Admin</option>
                                    <option value="Kasir">Kasir</option>
                                    <option value="Member">Member</option>
                                </select>


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
export default Users