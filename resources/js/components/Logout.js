import React from "react";
import ReactDOM from "react-dom";

class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }


    render() {
        return (
            <div>
               <nav className="navbar navbar-dark bg-dark">
                    <span className="navbar-brand mb-0 h1"><a className="nav-link" href="/logout">Logout</a></span>

                </nav>
            </div>

        );
    }
}

export default Logout;

if (document.getElementById("fourth")) {
    const root = document.getElementById("fourth");
    const element = <Logout/>;
    ReactDOM.render(element, root);
}
