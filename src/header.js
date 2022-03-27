import React from "react"
import { Link } from "react-router-dom";


function Header() {
    return (
        <div className="col-12">
            <div className="col">
                <h2 className="fw-bolder">Admin</h2>
            </div>
            <div className="col">
                <span className="p-4 fw-bold" title="Username"><i className="fas fa-id-card"></i> Admin</span>
                <span className="p-4 fw-bold" title="Role/Level"><i class="fas fa-user-tag"></i> Kasir</span>
                <span className="p-4 fw-bold" title="Outlet/Cabang"><i class="fas fa-store"></i> Malang</span>
            </div>
        </div>
    )
}

export default Header;