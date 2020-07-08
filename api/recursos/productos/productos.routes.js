const express = require("express");
const _ = require("underscore");
const uuidv4 = require("uuid/v4");
const productEjem = require("../../../databaseArr").productEjem;
const middValidarProducto = require("./productos.middleware");
const productsRouter = express.Router();
const log = require("../../../utils/logger");

//Ejemplo usando un arreglo

productsRouter.get("/", (req, res) => {
  res.json(productEjem);
});

productsRouter.post("/", middValidarProducto.validarPorducto, (req, res) => {
  let newProduct = req.body;
  /* if (!newProduct.moneda || !newProduct.precio || !newProduct.titulo) {
    res.status(400).send("Faltan algunos datos");
    return;
  } */

  newProduct.id = uuidv4();
  productEjem.push(newProduct);
  log.info("Nuevo producto agregado", newProduct);
  res.status(201).json(newProduct);
});

productsRouter.get("/:id", (req, res) => {
  for (let producto of productEjem) {
    if (producto.id === req.params.id) {
      res.json(producto);
      return;
    }
  }
  res.status(404).send(`El producto con id ${req.params.id} no existe`);
});

productsRouter.put("/:id", middValidarProducto.validarPorducto, (req, res) => {
  let id = req.params.id;
  let reemplazoProducto = req.body;

  let indice = _.findIndex(productEjem, (product) => product.id === id); //Encuentra el indice del array productEjem

  if (indice !== -1) {
    reemplazoProducto.id = id;
    productEjem[indice] = reemplazoProducto;
    log.info(`El producto con id ${id} fue reemplazado`, reemplazoProducto);
    res.status(200).send(reemplazoProducto);
  } else {
    log.warn(`El producto con id ${id} no existe`);
    res.status(404).send(`El producto con id ${id} no existe`);
  }
});

productsRouter.delete("/:id", (req, res) => {
  let indiceBorrar = _.findIndex(
    productEjem,
    (product) => product.id === req.params.id
  ); //Encuentra el indice del array productEjem
  if (indiceBorrar === -1) {
    log.warn(`El producto con id ${req.params.id} no existe`);
    res.status(404).send(`El producto con id ${req.params.id} no existe`);
    return;
  } else {
    log.warn(`El producto con id ${req.params.id} fue borrado`);
    let borrado = productEjem.splice(indiceBorrar, 1);
    res.json(borrado);
  }
});

//Fin de ejemplo

module.exports = productsRouter;