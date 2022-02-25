import "./App.css";
import { useEffect, useState } from "react";
import Paginacion from "./templates/Paginacion";

function App() {
  //declaracion de los states de las variables
  const [Token, setToken] = useState([]);
  const [Condicion, setCondicion] = useState(false);
  const [Vector, setVector] = useState([]);
  const [count, setCount] = useState(0);
  const [datos, setDatos] = useState({
    consulta: "",
  });
  const [paginaActual, setPaginaActual] = useState(1);

  //de obligatorio cumplimiento al entrar al hook
  useEffect(() => {
    if (count !== 5) {
      const timer = setTimeout(() => {
        const counter = count + 1;
        setCount(counter);
        setVector("a");
        obtenerToken();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [count]);

  //maneja el cambio de texto al tipear
  const handleInputChange = (event) => {
    // console.log(event.target.name)
    // console.log(event.target.value)
    setDatos({
      ...datos,
      [event.target.name]: event.target.value,
    });
  };

  //token de login en spotify se creo una ruta en un backend privado para obtener el token
//  const express = require('express');
// const router = express.Router();
// var request = require('request');
// router.get('/', async (req,res) => {
//     var client_id = '629ae71881f44dbb86b08fe751cc5d0f';
//     var client_secret = 'd4827318c5984c60ba06cfe355540d0c';
// var authOptions = {
//   url: 'https://accounts.spotify.com/api/token',
//   headers: {
//     'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//   },
//   form: {
//     grant_type: 'client_credentials'
//   },
//   json: true
// };
// request.post(authOptions, function(error, response, body) {
//   if (!error && response.statusCode === 200) {
//     var token = body.access_token;
//     res.json(token);
//   }
// });

// });
// module.exports = router;

  const obtenerToken = async () => {
    await fetch("https://backend-amtec-drop.herokuapp.com/api/spotify", {
      METHOD: "GET",
      headers: {
        Accept: "aplication/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setToken(data);
      });
  };

  //consulta en spotify con GET segun API WEB
  var enviarDatos = async (event) => {
    setCondicion(true);
    // console.log("enviando datos..." + datos.consulta);
    await fetch(
      `https://api.spotify.com/v1/search?type=track&include_external=audio&q=name:${datos.consulta}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setVector(data), 
      // console.log(Vector)
      )
      .catch((err) => console.log(err), event.preventDefault())
      .then(({ beats }) => {
        beats.forEach((beat, index) => {
          console.log(`Beat ${index} starts at ${beat.start}`);
        });
      });

    event.preventDefault();
  };

  const TOTAL_POR_PAGINA = 6;

  const getTotalPaginas = () => {
    let cantidadTotalDeProductos = Vector.tracks.items.length;
    return Math.ceil(cantidadTotalDeProductos / TOTAL_POR_PAGINA);
  };

  // Renderizado de l contenedor de canciones
  const mostrarCanciones = () => {
    if (Condicion === false) {
    
      return <div className="text-white">NO HAY CONSULTA</div>;
    } else {
      if (Vector === "a") {
        <div>A</div>;
      
      } else {
        let productPagina = Vector.tracks.items.slice(
          (paginaActual - 1) * TOTAL_POR_PAGINA,
          paginaActual * TOTAL_POR_PAGINA
        );
        // console.log(Vector);
        // console.log("Ahora");

        return (
          <div>
            <main className="main">
              <div className="page-header text-center">
                <div className="container co">
                  <br />
                  <h3 className="page-title text-white">
                    Resultados de tu consulta
                  </h3>
                </div>
              </div>

              <br />

              <div className="page-content">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="products mb-3">
                        <div className="row justify-content-center">

                          {/* mapeo de las canciones en el contenedor  */}
                          {productPagina.map((cancion) => (
                            <div className="col-6 col-md-4 col-lg-4">
                              <div className="product product-7 text-center">
                                <figure className="product-media">
                                  <div>
                                    <a href={cancion.external_urls.spotify}>
                                      <img
                                        src={cancion.album.images[1].url}
                                        alt="Product"
                                        className="product-image "
                                      />
                                    </a>
                                    <br />
                                  </div>
                                  <div className="product-action-vertical">
                                    <div
                                      className="btn-product-icon btn-quickview"
                                      title="Vista Rapida"
                                    >
                                      <span className="text-white">
                                        Artista: {cancion.album.artists[0].name}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="product-action-vertical">
                                    <div
                                      className="btn-product-icon btn-quickview"
                                      title="Vista Rapida"
                                    >
                                      <span className="text-white">
                                        <a
                                          href={
                                            cancion.album.artists[0]
                                              .external_urls.spotify
                                          }
                                          target="_blank"
                                        >
                                          Ver Artista
                                        </a>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="product-action-vertical">
                                    <div
                                      className="btn-product-icon btn-quickview"
                                      title="Vista Rapida"
                                    >
                                      <span className="text-white">
                                        Album: {cancion.album.name}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="product-action-vertical">
                                    <div
                                      className="btn-product-icon btn-quickview"
                                      title="Vista Rapida"
                                    >
                                      <span className="text-white">
                                        Cancion: {cancion.name}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="product-action-vertical">
                                    <div
                                      className="btn-product-icon btn-quickview"
                                      title="Vista Rapida"
                                    >
                                      <span className="text-white">
                                        <a
                                          href={cancion.preview_url}
                                          target="_blank"
                                        >
                                          PREVIEW
                                        </a>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="product-action">
                                    <a
                                      href={cancion.external_urls.spotify}
                                      className="btn-product btn-cart"
                                      target="_blank"
                                    >
                                      <span>Ver detalle</span>
                                    </a>
                                  </div>
                                </figure>
                              </div>
                            </div>
                          ))}
                          <Paginacion
                            pagina={paginaActual}
                            total={getTotalPaginas()}
                            onChange={(pagina) => {
                              setPaginaActual(pagina);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        );
      }
    }
  };

  return (
    <div className="App">
      <div>
        <h1 className="text-white">BIENVENIDO AL API DE CONSULTA DE SPOTIFY</h1>
      </div>

      <div className="row justify-content-center">
        <h3 className="text-white">Introduzca un termino de busqueda</h3>
        <form onSubmit={enviarDatos}>
          <div class="mb-3 row justify-content-center">
            <input
              placeholder="INTRODUZCA EL TERMINO AQUI Y PRESIONE ENVIAR"
              type="text"
              className="form-control w-25"
              onChange={handleInputChange}
              name="consulta"
            />
          </div>
          <button type="submit" class="btn btn-primary">
            ENVIAR
          </button>
        </form>
      </div>

      <div className="products mb-3">
        <div className="row justify-content-center">
          {
            <div className="products mb-3">
              <div className="row justify-content-center">
                {mostrarCanciones()}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
