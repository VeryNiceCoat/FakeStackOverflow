const express = require('express')

module.exports = (error, req, res, next) => {
    // console.error("Error Message", error.message);
    res.status(error.status || 500).send(error.message);
  };