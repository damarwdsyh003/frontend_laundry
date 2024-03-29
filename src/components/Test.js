import React from "react"

class Test extends React.Component{
    render(){
        return(
            <div className={`alert alert-${this.props.bgColor}`}>
                {this.props.label} <br />
                <button className={`btn btn-${this.props.btnColor}`}>
                {this.props.btnLabel}
            </button>
            </div>

        )
    }
}

export default Test     



/* Tanpa Label / BACKUP
import React from "react"

class Test extends React.Component{
    render(){
        return(
            <div>
                Get Good, Get Gamesense <br />
                <button>
                Click This Button
            </button>
            </div>

        )
    }
}

export default Test     
*/