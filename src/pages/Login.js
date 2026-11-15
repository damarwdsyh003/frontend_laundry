import React from "react"
import axios from "axios" //Lib untuk membantu membuat request ke backend
import { baseUrl } from "../config";
import { Link, useLocation, useNavigate } from "react-router-dom";

class LoginForm extends React.Component {
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
        const url = baseUrl + "/auth"
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
                    window.location.href = "/dashboard"
                } else {
                    window.alert(result.data.message || "Username atau password tidak valid.")
                }
            })
            .catch(error => {
                window.alert(
                    error.response?.data?.message || "Login gagal. Pastikan backend sedang berjalan."
                )
            })
    }

    render() {
        return (
            <main className="auth-page">
                <div className="auth-decoration auth-decoration-one" />
                <div className="auth-decoration auth-decoration-two" />
                <div className="auth-shell">
                    <Link to="/" className="brand-mark auth-brand"><span className="brand-icon">✦</span>FreshFold</Link>
                    <div className="auth-card">
                        <div className="auth-heading">
                            <span className="eyebrow">Welcome back</span>
                            <h1>Good to see you again.</h1>
                            <p>Sign in to pick up where you left off.</p>
                        </div>
                        <form onSubmit={ev => this.loginProcess(ev)}>
                            <label htmlFor="login-username">Username</label>
                            <input id="login-username" type="text" placeholder="Your username" required value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} />
                            <label htmlFor="login-password">Password</label>
                            <input id="login-password" type="password" placeholder="Your password" required value={this.state.password} onChange={ev => this.setState({ password: ev.target.value })} />
                            <button type="submit" className="btn btn-primary btn-lg w-100">Sign in →</button>
                        </form>
                        <p className="auth-switch">New to FreshFold? <Link to="/register">Create an account</Link></p>
                    </div>
                </div>
            </main>
        )
    }
}

function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    return <LoginForm location={location} navigate={navigate} />;
}

export default Login
