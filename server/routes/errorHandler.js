const express = require('express')

module.exports = (error, req, res, next) => {
    // console.error("Error Message", error.message);
    res.status(500).json(error);
    // throw error;
  };