/* eslint-disable react/jsx-no-target-blank */
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
      `https://api.spotify.com/v1/search?type=track&include_external=audio&q=artist:${datos.consulta}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
    )
      .then((response) => response.json())
      .then(
        (data) => setVector(data),
       //console.log(Vector)
      )
      .catch((err) => alert(err), event.preventDefault())
      //Se apago esta condicion porque da error en consola el indice no esta definido
      // .then(({ beats }) => {
      //   beats.forEach((beat, index) => {
      //     console.log(`Beat ${index} starts at ${beat.start}`);
      //   });
      // });

    
  };

  const TOTAL_POR_PAGINA = 6;

  const getTotalPaginas = () => {
    let cantidadTotalDeProductos = Vector.tracks.items.length;
    return Math.ceil(cantidadTotalDeProductos / TOTAL_POR_PAGINA);
  };

  function secondsToString(seconds) {
    // var hour = Math.floor(seconds / 3600);
    // hour = (hour < 10)? '0' + hour : hour;
    var minute = Math.floor((seconds / 60) % 60);
    minute = (minute < 10)? '0' + minute : minute;
    var second = seconds % 60;
    second = (second < 10)? '0' + second : second;
    return minute + ':' + Math.trunc(second);
  }

  // Renderizado de l contenedor de canciones
  const mostrarCanciones = () => {
    if (Condicion === false) {
      return (
        <div className="text-white">
          NO HAY CONSULTA, Intruduce un termino y presiona enviar
        </div>
      );
    } else {
      if (Vector === "a") {
        <div>NO HAY TOKEN</div>;
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
                  <h5 className="page-title text-white">
                    Resultados de tu consulta
                  </h5>
                  <h6 className="page-title text-white">
                    ¡ Presiona sobre la imagen para ver detalles del album !
                  </h6>
                </div>
              </div>

              <br />

              <div className="page-content">
                <div
                  className="
                
                "
                >
                  <div className="row">
                    <div className="col12 col-lg-12">
                      <div className="products mb-3">
                        <div className="row justify-content-center">
                          {/* mapeo de las canciones en el contenedor  */}
                          {productPagina.map((cancion) => (
                            <div className="col-md-4 col-lg-3 col-sm-12 marginl">
                              <div className="product product-7 text-center">
                                <figure className="product-media">
                                  <div>
                                    <a href={cancion.album.external_urls.spotify}
                                        target="_blank"
                                    >
                                      <img
                                        src={cancion.album.images[1].url}
                                        alt="Product"
                                        className="product-image rounded"
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
                                        <strong>ARTISTA: </strong>
                                        {cancion.album.artists[0].name}
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
                                          className="cspoti"
                                          href={
                                            cancion.album.artists[0]
                                              .external_urls.spotify
                                          }
                                          target="_blank"
                                        >
                                          DETALLE DEL ARTISTA
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
                                        <strong>ALBUM: </strong>{" "}
                                        {cancion.album.name}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="product-action-vertical">
                                    <div
                                      className="btn-product-icon btn-quickview"
                                      title="Vista Rapida"
                                    >
                                      <span className="text-white">
                                        <strong>CANCION: </strong> {cancion.name}
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
                                          className="cspoti"
                                          href={cancion.external_urls.spotify}
                                          target="_blank"
                                        >
                                          DETALLE DE LA CANCION
                                        </a>
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-white">
                                        Duracion: {secondsToString(cancion.duration_ms/1000)}
                                        </span>
                                  <div className="product-action">
                                  <span className="text-white">PREVIEW</span>
                                    <audio controls>
                                      <source
                                        src={cancion.preview_url}
                                        type="audio/mp3"
                                      />
                                    </audio>
                                  
                                      
                                    
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
    <div className="App row justify-content-center">
      <div>
        <h3 className="text-white" font="GothamBold">Bienvenido a la APP de consulta de Spotify</h3>
      </div>
      <div className="col3 row justify-content-center w-50">
        <img
          src="https://c.tenor.com/iczjaEFdW20AAAAC/spotify-music.gif"
          // src="../public/logo.png"
          // className="w-25"

          alt="spotify"
        ></img>
      </div>
      <div className="row justify-content-center degrade">
        <h5 className="text-white">Introduzca un termino de busqueda</h5>
        <form onSubmit={enviarDatos}>
          <div className="mb-3 row justify-content-center">
            <input
              placeholder="AQUI"
              type="text"
              className="form-control w-50"
              onChange={handleInputChange}
              name="consulta"
            />
          </div>
          <button type="submit" className="btn btn-success">
            ENVIAR
          </button>
          <br/>
          <br/>
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
