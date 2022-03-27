import React from "react"
import axios from "axios" //Lib untuk membantu membuat request ke backend
import { baseUrl } from "../config";
import { Link } from "react-router-dom";
import App from "../App";

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: "",
            // role: "user"
        }
    }

    loginProcess(event) {
        event.preventDefault()
        const url = baseUrl + "/login"
        let request = {
            username: this.state.username,
            password: this.state.password,
            // role: this.state.role,
            //  message: "",
            // isLogged: false
        }
        axios.post(url, request)
            .then(result => {
                if (result.data.logged) {
                    // store token in local storage
                    localStorage.setItem("token", result.data.token)
                    localStorage.setItem("user", JSON.stringify(result.data.user))
                    window.alert("Mantap!")
                    window.location.href = "/member"
                } else {
                    window.alert("Maaf, tidak valid !")
                }
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div className="container"> <br /> <br /> <br /> <br /> <br /> 
                <div className="col-lg-4" style={{ margin: "0 auto" }}>
                    <div className="card border-dark mb-3" >
                        <div className="card-header bg-dark">
                            <h4 className="text-center text-white">LOGIN</h4>
                            <ul class="nav nav-tabs card-header-tabs">
                            </ul>
                        </div>
                        <div className="card-body">

                            <form onSubmit={ev => this.loginProcess(ev)}>

                                {/* Username */}
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <n />  <n />  <n /> <label>Username</label>
                                <input type="text" className="form-control mb-2" placeholder="Username" required value={this.state.username}
                                    onChange={ev => this.setState({ username: ev.target.value })} /> <i class='fas fa-lock'></i>

                                {/* Password */}
                                <n /> <label>Password</label>
                                <input type="password" className="form-control mb-2" placeholder="••••••••••" required value={this.state.password}
                                    onChange={ev => this.setState({ password: ev.target.value })} />

                                {/* Role */}
                                {/* <n /><label> Role </label>
                                <select className="form-control mb-2" required value={this.state.role}
                                    onChange={ev => this.setState({ role: ev.target.value })}>
                                    <option value="user">Users</option>
                                    <option value="kasir">Kasir</option>
                                    <option value="admin">Admin</option>
                                </select> */}
                                <button type="submit" className="btn btn-my btn-outline-dark">Login</button>
                            </form>
                            <div></div>
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}
export default Login
