
// POP UPS hechos con sweetalert
(async () => {

    // Mensaje de bienvenida
    await Swal.fire({
        title: "Bienvenido al mercadito de la Susi",
        confirmButtonText: "Ver productos",
        showCancelButton: false,
    });

    // Llamar lista de productos
    await ListadeProductos();

})();

// Función lista de productos
async function ListadeProductos() {
    do {
        var { value: producto, isDenied, isConfirmed } = await Swal.fire({
            title: "¿Qué desea comprar?",
            input: "text",
            html: `<div style="display: flex; justify-content: center;">
            <table>
            <tr style="font-weight: bold;">
            <td>\u00A0 ID \u00A0</td> <td> \u00A0Producto\u00A0 </td> <td>\u00A0 Precio \u00A0</td>
            </tr>
            <tr><td> 1 </td> <td> Paleta de sombra de ojos </td> <td> $7990 </td></tr> 
            <tr><td> 2 </td> <td> Labial </td> <td> $4490 </td></tr>
            <tr><td> 3 </td> <td> Gloss </td> <td> $3290 </td></tr> 
            <tr><td> 4 </td> <td> Máscara de pestañas </td> <td> $3490 </td></tr> 
            <tr><td> 5 </td> <td> Blush </td> <td> $5990</td></tr>
            <tr><td> 6 </td> <td> Polvo de hadas </td> <td> $4990 </td></tr>
            <tr><td> 7 </td> <td> Desmaquillante </td> <td> $3490 </td></tr>
            <tr><td> 8 </td> <td> Set de brochas </td> <td> $8490 </td></tr> 
            <tr><td> 9 </td> <td> Delineador de ojos 24h </td> <td> $4490 </td></tr>  
            </table></div>`,
            inputPlaceholder: "Escriba el id del producto que desea comprar",
            confirmButtonText: "Agregar al carro",
            denyButtonText: "Ver carro",
            showDenyButton: true,
            showCancelButton: false,
        });

        //Abrir el carro
        if (isDenied) {
            await VerCarro();
            return;
            //Continuar compra
        } else if (isConfirmed) {
            //Validar
            if (isNaN(producto) || producto < 1 || producto > 9) {
                await Swal.fire({
                    title: "El ID ingresado no es válido",
                    confirmButtonText: "Intentar de nuevo",
                    showCancelButton: false,
                });
            };
        };
    } while (isNaN(producto) || producto < 1 || producto > 9)

    // Preguntar cuántas unidades lleva
    do {
        if (producto) {
            var { value: cantidad, isDenied } = await Swal.fire({
                title: "¿Cuántas unidades lleva?",
                input: "text",
                confirmButtonText: "Continuar",
                denyButtonText: "Ver carro",
                showDenyButton: true,
                showCancelButton: false,
            });

            //Abrir el carro
            if (isDenied) {
                await VerCarro();
                return;
            };
        }
        //Validar
        if (isNaN(cantidad) || cantidad < 0) {
            await Swal.fire({
                title: "Ingrese solo números positivos",
                confirmButtonText: "Intentar de nuevo",
                showCancelButton: false,
            });
            //Internamente agrega al carro
        } else if (cantidad) {
            agregar(p[producto - 1], cantidad); // Agregar al carrito
            await agregarmas();
        }
    } while (isNaN(cantidad) || cantidad < 0);
}

// Ver carro
async function VerCarro() {
    // Regenerar el HTML del carrito cada vez que se vea el carro
    let htmlStr = "<table><tr style='font-weight: bold;'><td> \u00A0Producto\u00A0 </td><td> \u00A0Cantidad\u00A0 </td> <td>\u00A0 Precio \u00A0</tr>";
    for (let i = 0; i < ProductosCarro.length; ++i) {
        htmlStr += "<tr>";
        htmlStr += "<td>" + ProductosCarro[i] + "</td>"; // Nombre
        htmlStr += "<td>" + CantidadCarro[i] + "</td>"; // Cantidad
        htmlStr += "<td>$" + PrecioCarro[i] + "</td>"; // Precio
        htmlStr += "</tr>";
    }
    htmlStr += "</table>";

    //Precio total
    FinCompra()
    var { isConfirmed, isDenied } = await Swal.fire({
        title: "Carro",
        html: `<div style="display: flex; justify-content: center;"> ${htmlStr} </div> <p> Total a pagar: $${final}</p>`,
        confirmButtonText: "Agregar nuevos productos",
        denyButtonText: "Finalizar compra",
        showDenyButton: true,
        showCancelButton: false,
    });
    if (isConfirmed) {
        await ListadeProductos();
    } else if (isDenied) {
        VerFinal();
    }
}

// Mostar detalle de compra al final
async function VerFinal() {
    // Regenerar el HTML del carrito cada vez que se vea el carro
    let htmlStr = "<table><tr style='font-weight: bold;'> <td> \u00A0Producto\u00A0 </td><td> \u00A0Cantidad\u00A0 </td> <td>\u00A0 Precio \u00A0</tr>";
    for (let i = 0; i < ProductosCarro.length; ++i) {
        htmlStr += "<tr>";
        htmlStr += "<td>" + ProductosCarro[i] + "</td>"; // Nombre
        htmlStr += "<td>" + CantidadCarro[i] + "</td>"; // Cantidad
        htmlStr += "<td>$" + PrecioCarro[i] + "</td>"; // Precio
        htmlStr += "</tr>";
    }
    htmlStr += "</table>";

    //Internamente finalizar compra
    FinCompra();
    await Swal.fire({
        title: "Detalle de la compra",
        html: `<div style="display: flex; justify-content: center;"> ${htmlStr} </div> <p> Total de la compra: $${final}</p>`,

        showConfirmButton: false,
        showDenyButton: false,
        showCancelButton: false,
    });
}

// ¿Desea agregar más productos?
async function agregarmas() {
    var { isConfirmed, isDenied } = await Swal.fire({
        title: "¿Desea agregar más productos?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Sí",
        denyButtonText: "No",
    });

    if (isConfirmed) {
        await ListadeProductos();
    } else if (isDenied) {
        VerCarro();
    }
}

// Clase productos
class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}

// Productos disponibles
const p = [
    new Producto("Paleta de sombra de ojos", 7990),
    new Producto("Labial", 4490),
    new Producto("Gloss", 3290),
    new Producto("Máscara de Pestañas", 3490),
    new Producto("Blush", 5990),
    new Producto("Polvo de hadas", 4990),
    new Producto("Desmaquillante", 3490),
    new Producto("Set de Brochas", 8490),
    new Producto("Delineador de ojos 24h", 4490),
];

// El carrito
class Carrito {
    constructor() {
        this.ProductoSeleccionado = [];
        this.CantidadProducto = [];
        this.PrecioProducto = [];
    }

    ingresar(ProductoNuevo, ProductoCantidad, ProductoPrecio) {
        this.ProductoSeleccionado.push(ProductoNuevo);
        this.CantidadProducto.push(ProductoCantidad);
        this.PrecioProducto.push(ProductoPrecio);
    }

    NuevoProductoNombre() {
        return this.ProductoSeleccionado;
    }

    NuevoProductoCantidad() {
        return this.CantidadProducto;
    }

    NuevoProductoPrecio() {
        return this.PrecioProducto;
    }
}

// Agregar cosas al carro
var agregarProducto = new Carrito();
var ProductosCarro = agregarProducto.NuevoProductoNombre();
var CantidadCarro = agregarProducto.NuevoProductoCantidad();
var PrecioCarro = agregarProducto.NuevoProductoPrecio();

// Función para agregar productos al carrito
var agregar = function (objeto, cantidad) {
    agregarProducto.ingresar(objeto.nombre, cantidad, cantidad * objeto.precio);
};

//Función para calcular el precio final/total
var FinCompra = function () {
    final = 0;
    for (let i = 0; i < ProductosCarro.length; ++i) {
        final += PrecioCarro[i]
    }
    return final;
}
