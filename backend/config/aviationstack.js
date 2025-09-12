const axios = require('axios')

const aviationstack = axios.create({
  baseURL: 'http://api.aviationstack.com/v1',
  params: {
    access_key: process.env.AVIATIONSTACK_API_KEY,
  },
})

module.exports = aviationstack