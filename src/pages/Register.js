import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../config";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = React.useState({ nama: "", username: "", password: "" });
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const updateField = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
        setError("");
    };

    const register = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post(`${baseUrl}/auth/register`, form);
            navigate("/login", { state: { message: "Account created. You can sign in now." } });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-decoration auth-decoration-one" />
            <div className="auth-decoration auth-decoration-two" />
            <div className="auth-shell">
                <Link to="/" className="brand-mark auth-brand"><span className="brand-icon">✦</span>FreshFold</Link>
                <div className="auth-card">
                    <div className="auth-heading">
                        <span className="eyebrow">Start fresh</span>
                        <h1>Create your account</h1>
                        <p>Set up your workspace and bring calm to every laundry day.</p>
                    </div>
                    {error && <div className="form-alert">{error}</div>}
                    <form onSubmit={register}>
                        <label htmlFor="nama">Your name</label>
                        <input id="nama" name="nama" type="text" placeholder="e.g. Damar Wijaya" value={form.nama} onChange={updateField} required />
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" type="text" placeholder="Choose a username" value={form.username} onChange={updateField} required />
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" placeholder="Create a password" value={form.password} onChange={updateField} required minLength="4" />
                        <button className="btn btn-primary btn-lg w-100" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create account →"}</button>
                    </form>
                    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </main>
    );
}

export default Register;
