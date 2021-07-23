import React, { useState } from "react";
import Select from "react-select";
import ReactDOM from "react-dom";
import "./../app.js";

class Productos extends React.Component {
    constructor(props) {
        super(props);

        var percentages = [];

        this.state = {
            key: this.props.index,
            cont: this.props.cont - 1,
            item: this.props.item,
            keyWord: this.props.keyWord,
            productsCodes: this.props.productsCodes,
            ProductCode: this.props.ProductCode,
            UnitCode: { label: "Pieza", value: "H87" },
            selectedTax: "",
            selectedPercentageTax: "",
            IsRetention: "",
            IsQuota: "",
            taxOptions: [],
            Name: "",
            Rate: "",
            totalWithTaxes: "",
            totalWithDiscount: "",
            impuestoTotal: "",
        };
    }

    handleChange(event) {
        this.props.onKeyWordChange(event.target.value);
        this.setState({
            keyWord: event.target.value,
            productsCodes: this.props.productsCodes,
            ProductCode: this.props.ProductCode,
        });
    }

    handleSelectChange(name, e) {
        this.setState({ [name]: { value: e.value, label: e.label } });
        this.props.updateState(this.state.key, name, e.value);
    }

    // onChangeInput(name, e) {
    //     this.props.updateState(name, e.target.value);
    // }

    isRetentionFunction(name, e) {
        const taxByTranslation = [
            { value: "IVA 0.000000 Tasa", label: "IVA 0.000000 Tasa" },
            { value: "IVA 0.160000 Tasa", label: "IVA 0.160000 Tasa" },
            { value: "IEPS 0.265000 Tasa", label: "IEPS 0.265000 Tasa" },
            { value: "IEPS 0.300000 Tasa", label: "IEPS 0.300000 Tasa" },
            { value: "IEPS 0.530000 Tasa", label: "IEPS 0.530000 Tasa" },
            { value: "IEPS 0.500000 Tasa", label: "IEPS 0.500000 Tasa" },
            { value: "IEPS 0.600000 Tasa", label: "IEPS 0.600000 Tasa" },
            { value: "IEPS 0.304000 Tasa", label: "IEPS 0.304000 Tasa" },
            { value: "IEPS 0.250000 Tasa", label: "IEPS 0.250000 Tasa" },
            { value: "IEPS 0.090000 Tasa", label: "IEPS 0.090000 Tasa" },
            { value: "IEPS 0.080000 Tasa", label: "IEPS 0.080000 Tasa" },
            { value: "IEPS 0.070000 Tasa", label: "IEPS 0.070000 Tasa" },
            { value: "IEPS 0.060000 Tasa", label: "IEPS 0.060000 Tasa" },
            { value: "IEPS 0.030000 Tasa", label: "IEPS 0.030000 Tasa" },
            { value: "IEPS 0.000000 Tasa", label: "IEPS 0.000000 Tasa" },
            { value: "IEPS 0.000000 Cuota", label: "IEPS 0.000000 Cuota" },
            { value: "IEPS 43.770000 Cuota", label: "IEPS 43.770000 Cuota" },
            { value: "IVA 0.080000 Tas';a", label: "IVA 0.080000 Tasa" },
        ];

        const taxByRetention = [
            { value: "IVA 0.000000 Tasa", label: "IVA 0.000000 Tasa" },
            { value: "IVA 0.160000 Tasa", label: "IVA 0.160000 Tasa" },
            { value: "IEPS 0.000000 Cuota", label: "IVA 0.000000 Tasa" },
            { value: "IEPS 43.770000 Cuota", label: "IEPS 43.770000 Cuota" },
            { value: "ISR 0.000000 Tasa", label: "ISR 0.000000 Tasa" },
            { value: "ISR 0.350000 Tasa", label: "ISR 0.350000 Tasa" },
            { value: "IEPS 0.265000 Tasa", label: "IEPS 0.265000 Tasa" },
            { value: "IEPS 0.300000 Tasa", label: "IEPS 0.300000 Tasa" },
            { value: "IEPS 0.530000 Tasa", label: "IEPS 0.530000 Tasa" },
            { value: "IEPS 0.500000 Tasa", label: "IEPS 0.500000 Tasa" },
            { value: "IEPS 0.600000 Tasa", label: "IEPS 0.600000 Tasa" },
            { value: "IEPS 0.304000 Tasa", label: "IEPS 0.304000 Tasa" },
            { value: "IEPS 0.250000 Tasa", label: "IEPS 0.250000 Tasa" },
            { value: "IEPS 0.090000 Tasa", label: "IEPS 0.090000 Tasa" },
            { value: "IEPS 0.080000 Tasa", label: "IEPS 0.080000 Tasa" },
            { value: "IEPS 0.070000 Tasa", label: "IEPS 0.070000 Tasa" },
            { value: "IEPS 0.060000 Tasa", label: "IEPS 0.060000 Tasa" },
            { value: "IVA 0.060000 Tasa", label: "IVA 0.060000 Tasa" },
        ];
        this.setState({ [name]: { value: e.value, label: e.label } });
        if (e.value) {
            this.setState({ taxOptions: taxByRetention });
        } else {
            this.setState({ taxOptions: taxByTranslation });
        }
    }

    selectTax(name, e) {
        this.setState({ [name]: { value: e.value, label: e.label } });
        var value = e.value.split(" ");
        var total,
            impuestoTotal,
            base,
            IsQuota,
            rate,
            str1,
            str2,
            str3,
            str4,
            str5;
        rate = Number.parseFloat(value[1]).toFixed(2);
        IsQuota = value[2] == "Cuota" ? true : false;
        base = this.state.item.amount - this.state.item.discount_amount;
        impuestoTotal = base * value[1];
        total = Number.parseFloat(base + impuestoTotal).toFixed(2);

        str1 = base.toString();
        str2 = impuestoTotal.toString();
        str3 = total.toString();
        str4 = base.toString();
        str5 = rate.toString();

        this.setState({
            Name: value[0],
            Rate: value[1],
            IsQuota: IsQuota,
            totalWithDiscount: str1,
            impuestoTotal: str2,
            totalWithTaxes: str3,
        });

        this.props.updateState(this.state.key, "IsQuota", IsQuota);
        this.props.updateState(
            this.state.key,
            "IsRetention",
            this.state.IsRetention.value
        );
        this.props.updateState(this.state.key, "Name", value[0]);
        this.props.updateState(this.state.key, "Rate", str5);
        this.props.updateState(this.state.key, "totalWithTaxes", str3);
        this.props.updateState(this.state.key, "Total", str2);
        this.props.updateState(this.state.key, "Base", str4);
    }

    render() {
        const unitCodes = [
            { label: "Pieza", value: "H87" },
            { label: "Elemento", value: "EA" },
            { label: "Unidad de Servicio", value: "E48" },
            { label: "Actividad", value: "ACT" },
            { label: "Kilogramo", value: "KGM" },
            { label: "Trabajo", value: "E51" },
            { label: "Tarifa", value: "A9" },
            { label: "Metro", value: "MTR" },
            { label: "Paquete a granel", value: "AB" },
            { label: "Caja base", value: "BB" },
            { label: "Kit", value: "KT" },
            { label: "Conjunto", value: "SET" },
            { label: "Litro", value: "LTR" },
            { label: "Caja", value: "XBX" },
            { label: "Mes", value: "MON" },
            { label: "Hora", value: "HUR" },
            { label: "Metro cuadrado", value: "MTK" },
            { label: "Equipos", value: "11" },
            { label: "Miligramo", value: "MGM" },
            { label: "Paquete", value: "XPK" },
            { label: "Kit (Conjunto de piezas)", value: "XKI" },
            { label: "Variedad", value: "AS" },
            { label: "Gramo", value: "GRM" },
            { label: "Par", value: "PR" },
            { label: "Docenas de piezas", value: "DPC" },
            { label: "Unidad", value: "xun" },
            { label: "Día", value: "DAY" },
            { label: "Lote", value: "XLT" },
            { label: "Grupos", value: "10" },
            { label: "Mililitro", value: "MLT" },
            { label: "Viaje", value: "E54" },
        ];

        const yesNo = [
            { value: true, label: "Retencion" },
            { value: false, label: "Traslado" },
        ];
        return (
            <div className="row gy-2 gx-3 align-items-center">
                <legend>{this.props.item.name}</legend>
                <div className="col-auto">
                    <label className="visually-hidden"></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Palabras clavee"
                        name="searchBar"
                        value={this.state.keyWord}
                        onInput={this.handleChange.bind(this)}
                    />
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-0">
                    <label className="visually-hidden"></label>
                    <Select
                        className="form-control border-0 m-0 py-0"
                        inputId="ProductCode"
                        aria-labelledby="aria-label"
                        value={this.state.ProductCode}
                        options={this.state.productsCodes}
                        onChange={this.handleSelectChange.bind(
                            this,
                            "ProductCode"
                        )}
                    />
                </div>
                <div className="col-auto">
                    <label
                        className="visually-hidden"
                        htmlFor="autoSizingInput"
                    ></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Quantity"
                        value={this.state.item.qty}
                        disabled
                    />
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-0">
                    <label className="visually-hidden"></label>
                    <Select
                        className="form-control border-0 m-0 py-0"
                        inputId="UnitCode"
                        aria-labelledby="aria-label"
                        options={unitCodes}
                        value={this.state.UnitCode}
                        onChange={this.handleSelectChange.bind(
                            this,
                            "UnitCode"
                        )}
                    />
                </div>
                <div className="form-floating">
                    <textarea
                        className="form-control"
                        placeholder="Leave a comment here"
                        style={{ height: "100px", resize: "none" }}
                        value={this.state.item.description}
                        disabled
                    ></textarea>
                    <label>Descripcion</label>
                </div>
                <div className="col-auto">
                    <label className="visually-hidden"></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Precio Unitario"
                        value={this.state.item.rate}
                        disabled
                    />
                </div>
                <div className="col-auto">
                    <label className="visually-hidden"></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Descuento"
                        value={this.state.item.discount_amount}
                        disabled
                    />
                </div>
                <div className="col-auto">
                    <label className="visually-hidden"></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="DiscountVal"
                        value={this.state.item.discount_percentage}
                        disabled
                    />
                </div>
                <div className="col-auto">
                    <label className="visually-hidden"></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Sub Total"
                        value={this.state.item.amount}
                        disabled
                    />
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-0">
                    <label className="visually-hidden"></label>
                    <Select
                        className="form-control border-0 m-0 py-0"
                        inputId="productCode"
                        aria-labelledby="aria-label"
                        options={yesNo}
                        value={this.state.IsRetention}
                        onChange={this.isRetentionFunction.bind(
                            this,
                            "IsRetention"
                        )}
                    />
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-0">
                    <label className="visually-hidden"></label>
                    <Select
                        className="form-control border-0 m-0 py-0"
                        inputId="productCode"
                        aria-labelledby="aria-label"
                        options={this.state.taxOptions}
                        value={this.state.selectedTax}
                        onChange={this.selectTax.bind(this, "selectedTax")}
                    />
                </div>
                <div className="col-auto">
                    <label className="visually-hidden"></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Rate"
                        value={this.state.Rate}
                        disabled

                    />
                </div>
                <div className="col-auto">
                    <label className="visually-hidden"></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Impuesto Total"
                        value={this.state.impuestoTotal}
                        disabled

                    />
                </div>
                <div className="col-auto">
                    <label className="visually-hidden"></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Base"
                        value={this.state.totalWithDiscount}
                        disabled

                    />
                </div>
                <div className="col-auto">
                    <label className="visually-hidden"></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Total"
                        value={this.state.totalWithTaxes}
                        disabled
                    />
                </div>
            </div>
        );
    }
}
export default Productos;
