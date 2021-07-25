import { isArray, isBoolean, isNumber, isObject } from "lodash";
import React from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import Productos from "./Productos";

class Formulario extends React.Component {
    constructor(props) {
        super(props);
        var invoices = JSON.parse(this.props.invoices);

        var options = [];

        invoices.forEach((invoice) => {
            options.push({ value: invoice, label: invoice });
        });

        this.state = {
            invoices: options,
            selectedInvoice: "",
            invoiceData: "",
            formasPago: [],
            formaPago: "",
            metodosPago: [],
            metodoPago: "",
            expeditionPlace: "",
            cfdiType: "",
            rfc: "",
            customer: "",
            CfdiUse: "",
            cfdiUses: [],
            items: [],
            productsCodes: [],
            ProductCode: "",
            qty: "",
            cfdiItems: [],
            codeSelected: "",
            Name: "",
            Rate: "",
            Base: "",
            IsRetention: "",
            IsQuota: "",
            Total: "",
            TotalWithTaxes: "",
            cfdiTypeSelected: "",
            Cfdi: "",
        };
        this.SelectInvoice = React.createRef();
        this.getCatalogs = this.getCatalogs.bind(this);
        this.getCatalogs();
    }

    getCatalogs() {
        var formasPago = [];
        var metodosPago = [];
        var cfdiUses = [];

        Facturama.Catalogs.PaymentForms(
            (result) => {
                if (result.length > 0) {
                    formasPago = result.map((forma) => {
                        return { value: forma.Value, label: forma.Name };
                    });
                }
                this.setState({
                    formasPago: formasPago,
                });
            },
            (error) => {
                if (error && error.responseJSON) {
                    console.log("errores", error.responseJSON);
                }
            }
        );
        Facturama.Catalogs.PaymentMethods(
            (result) => {
                if (result.length > 0) {
                    metodosPago = result.map((method) => {
                        return { value: method.Value, label: method.Name };
                    });
                }
                this.setState({
                    metodosPago: metodosPago,
                });
            },
            function (error) {
                if (error && error.responseJSON) {
                    console.log("errores", error.responseJSON);
                }
            }
        );

        Facturama.Catalogs.CfdiUses(
            "POAJ870619123",
            (result) => {
                if (result.length > 0) {
                    cfdiUses = result.map((use) => {
                        return {
                            value: use.Value,
                            label: use.Value + ": " + use.Name,
                        };
                    });
                }
                this.setState({
                    cfdiUses: cfdiUses,
                });
            },
            function (error) {
                if (error && error.responseJSON) {
                    console.log("errores", error.responseJSON);
                }
            }
        );
    }

    getProductCodes(palabrasClave) {
        var productsCodes = [];
        Facturama.Catalogs.ProductsOrServices(
            palabrasClave,
            (result) => {
                if (result.length > 0) {
                    productsCodes = result.map((use) => {
                        return {
                            value: use.Value,
                            label: use.Value + ": " + use.Name,
                        };
                    });
                }
                this.setState({
                    productsCodes: productsCodes,
                    ProductCode: productsCodes[0],
                });
            },
            function (error) {
                if (error && error.responseJSON) {
                    console.log("errores", error.responseJSON);
                }
            }
        );
    }

    updateState(indice, name, value) {
        var cfdiItems = this.state.cfdiItems.map((i) => {
            return i;
        });
        if (
            name == "ProductCode" ||
            name == "UnitCode" ||
            name == "totalWithTaxes"
        ) {
            name != "totalWithTaxes"
                ? (cfdiItems[indice][name] = value)
                : (cfdiItems[indice]["Total"] = value);
        } else {
            cfdiItems[indice]["Taxes"][0][name] = value;
        }
        this.setState({ cfdiItems: cfdiItems });
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    };

    mySelectHandler(name, event) {
        this.setState({ [name]: { value: event.value, label: event.label } });
    }

    selectInvoice(event) {
        var items = [];

        this.setState({
            selectedInvoice: { value: event.value, label: event.label },
        });

        fetch("/getInvoice/" + event.value, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message == "success") {
                    this.setState(
                        {
                            invoiceData: data.data,
                            items: data.data.items,
                            customer: data.data.customer,
                        },
                        () => {
                            items = this.state.items.map((element) => {
                                var subtotal,
                                    dicount,
                                    discountVal,
                                    cantidad,
                                    precioUnitario;

                                subtotal = element.amount.toString();
                                dicount = element.discount_amount.toString();
                                discountVal =
                                    element.discount_percentage.toString();
                                cantidad = element.qty.toString();
                                precioUnitario = element.rate.toString();

                                return {
                                    Quantity: cantidad,
                                    ProductCode: "",
                                    UnitCode: "",
                                    Description: element.description,
                                    IdentificationNumber: element.name,
                                    UnitPrice: precioUnitario,
                                    Subtotal: subtotal,
                                    Discount: dicount,
                                    DiscountVal: discountVal,
                                    Taxes: [
                                        {
                                            Name: "",
                                            Rate: "",
                                            Total: "",
                                            Base: "",
                                            IsRetention: "",
                                            IsQuota: "",
                                        },
                                    ],
                                    Total: "",
                                };
                            });
                            this.setState({ cfdiItems: items });
                        }
                    );
                }
            })
            .catch(function (error) {
                console.log("Hubo un problema con la petición Fetch:" + error);
            });
    }

    buildCfdi() {
        var cfdiName = this.state.invoiceData.name.split("-");
        cfdiName = cfdiName[3];

        var newCfdi = {
            Receiver: {
                Name: this.state.customer,
                CfdiUse: this.state.CfdiUse.value,
                Rfc: this.state.rfc,
            },
            CfdiType: this.state.cfdiTypeSelected.value,
            NameId: cfdiName,
            ExpeditionPlace: this.state.expeditionPlace,
            PaymentForm: this.state.formaPago.value,
            PaymentMethod: this.state.metodoPago.value,
            Date: this.state.invoiceData.creation,
            Items: [],
        };
        newCfdi["Items"] = this.state.cfdiItems.map((element) => {
            return element;
        });
        this.setState({ Cfdi: newCfdi });
        return newCfdi;
    }

    generarCfdi(cfdi) {
        Facturama.Cfdi.Create(
            cfdi,
            (result) => {
                console.log("creacion de una factura", result);
            },
            (error) => {
                if (error && error.responseJSON) {
                    console.log("errores", error.responseJSON);
                    var errores = error.responseJSON["ModelState"];
                    var message = error.responseJSON["Message"];
                    var errors = "";

                    for (const key in errores) {
                        if (Object.hasOwnProperty.call(errores, key)) {
                            const element = errores[key];
                            errors = errors + element + "\n";
                        }
                    }

                    alert(message + ":\n\n" + errors);
                }
            }
        );
    }

    focus() {
        this.SelectInvoice.current.focus();
    }

    render() {
        const style = {
            blockquote: {
                fontStyle: "italic",
                fontSize: ".75rem",
                margin: "1rem 0",
            },
            label: {
                fontSize: ".75rem",
                fontWeight: "bold",
                lineHeight: 2,
            },
        };
        const title = (titulo) => (
            <div style={{ textAlign: "left" }}>
                <p style={style.label} id="aria-label">
                    {titulo}
                </p>
            </div>
        );
        let titulo;

        const cfdiType = [
            { value: "I", label: "Ingreso" },
            { value: "E", label: "Egreso" },
            { value: "T", label: "Traslado" },
            { value: "N", label: "Nota de credito" },
            { value: "P", label: "Pago" },
        ];
        var cont = 0;
        return (
            <div>
                <div className="container center" style={{ width: "20rem" }}>
                    <label
                        style={style.label}
                        id="aria-label"
                        htmlFor="selectInvoice"
                    >
                        Selecciona una factura
                    </label>
                    <Select
                        ref={this.SelectInvoice}
                        inputId="selectInvoice"
                        aria-labelledby="aria-label"
                        options={this.state.invoices}
                        value={this.state.selectedInvoice}
                        onChange={this.selectInvoice.bind(this)}
                    />
                </div>
                <div className="conainter m-3">
                    <form className="row gy-2 gx-3 align-items-center">
                        {(titulo = title("CFDI"))}
                        <div className="col-auto">
                            <label className="visually-hidden"></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="NameId"
                                value={this.state.invoiceData.name || ""}
                                disabled
                            />
                        </div>
                        <div className="col-auto">
                            <label className="visually-hidden"></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ExpeditionPlace"
                                name="expeditionPlace"
                                value={this.state.expeditionPlace}
                                onChange={this.myChangeHandler}
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-0">
                            <label className="visually-hidden"></label>
                            <Select
                                className="form-control border-0 m-0 py-0"
                                inputId="cfdiType"
                                aria-labelledby="aria-label"
                                name="cfdiType"
                                options={cfdiType}
                                value={this.state.cfdiTypeSelected}
                                onChange={this.mySelectHandler.bind(
                                    this,
                                    "cfdiTypeSelected"
                                )}
                                placeholder="CFDI Type"
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-0">
                            <label className="visually-hidden"></label>
                            <Select
                                className="form-control border-0 m-0 py-0"
                                inputId="CfdiUse"
                                aria-labelledby="aria-label"
                                options={this.state.cfdiUses}
                                value={this.state.CfdiUse}
                                onChange={this.mySelectHandler.bind(
                                    this,
                                    "CfdiUse"
                                )}
                                placeholder={"CFDI Use"}
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-0">
                            <label className="visually-hidden"></label>
                            <Select
                                className="form-control border-0 m-0 py-0"
                                inputId="formaPago"
                                aria-labelledby="aria-label"
                                options={this.state.formasPago}
                                value={this.state.formaPago}
                                onChange={this.mySelectHandler.bind(
                                    this,
                                    "formaPago"
                                )}
                                placeholder={"Forma de Pago"}
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-0">
                            <label className="visually-hidden"></label>
                            <Select
                                className="form-control border-0 m-0 py-0"
                                inputId="metodoPago"
                                aria-labelledby="aria-label"
                                options={this.state.metodosPago}
                                value={this.state.metodoPago}
                                onChange={this.mySelectHandler.bind(
                                    this,
                                    "metodoPago"
                                )}
                                placeholder={"Metodo de Pago"}
                            />
                        </div>
                        <div className="col-auto">
                            <label className="visually-hidden"></label>
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.invoiceData.creation || ""}
                                disabled
                            />
                        </div>
                        {(titulo = title("Cliente"))}
                        <div className="col-auto">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name="customer"
                                value={this.state.customer}
                                onChange={this.myChangeHandler}
                            />
                        </div>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="RFC"
                                aria-label="rfc"
                                name="rfc"
                                value={this.state.rfc}
                                onChange={this.myChangeHandler}
                            />
                        </div>
                        {(titulo = title("Productos y servicios"))}
                        {this.state.items.length > 0 &&
                            this.state.items.map((i, indexOf) => (
                                <Productos
                                    index={indexOf}
                                    item={i}
                                    onKeyWordChange={this.getProductCodes.bind(
                                        this
                                    )}
                                    updateState={this.updateState.bind(this)}
                                    productsCodes={this.state.productsCodes}
                                    ProductCode={this.state.ProductCode}
                                />
                            ))}
                        {this.state.items.length == 0 && <Productos item />}
                        <button
                            type="button"
                            className="btn btn-primary"
                            style={{ marginTop: "2rem" }}
                            onClick={() => {
                                if (!this.state.selectedInvoice) {
                                    this.focus();
                                    alert("Seleccione una factura.");
                                } else {
                                    // var cfdi = ;
                                    this.generarCfdi(this.buildCfdi());
                                }
                            }}
                        >
                            Timbrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

if (document.getElementById("second")) {
    const root = document.getElementById("second");
    const element = <Formulario invoices={root.attributes.invoices.value} />;
    ReactDOM.render(element, root);
}
