
import React from 'react';
import ReactDOM from 'react-dom';


class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            url: '/'
        };
    }


    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    render() {
        let usr = this.state.username;
        let pwd = this.state.password;
        let url = '/check/' + usr + '/' + pwd;
        return (
            <div>
                <form>
                    <div className="row mb-3 pr-3">
                        <label for="inputEmail3" className="col-sm-1 col-form-label">
                        </label>
                        <div className="col-sm-10">
                            <input
                                type=""
                                className="form-control"
                                placeholder="Nombre de usuario"
                                name='username'
                                onChange={this.myChangeHandler}
                            />
                        </div>
                    </div>
                    <div className="row mb-3 pr-3">
                        <label for="inputPassword3" className="col-sm-1 col-form-label">
                        </label>
                        <div className="col-sm-10">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name='password'
                                onChange={this.myChangeHandler}
                            />
                        </div>
                    </div>
                    <a href={`${url}`} >
                        <button
                        type="button"
                        className="btn btn-primary"
                        style={{ margin: "2rem" }}
                        >
                            Iniciar Sesion
                        </button>
                    </a>
                </form>
            </div>
        );

    }
}

// DOM element
if (document.getElementById('first')) {
    ReactDOM.render(<User />, document.getElementById('first'));
}
