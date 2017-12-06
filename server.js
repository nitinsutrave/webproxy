'use strict'

const axios = require('axios')
const hapi = require('hapi')
const path = require('path')
const http = require('http')
const https = require('https')
const url = require('url')
const fs = require('fs')

// const httpsServer = https.createServer((req, res) => {
//   console.log("test++")
//   console.log(req, res)
//   res.end();
// });

// httpsServer.listen(8018)

const server = hapi.server({
  port: 4000,
  host: 'localhost'
  // tls: true,
  //listener: httpsServer
  //autoListen: false
  // tls: {
  //   key: fs.readFileSync(path.join(__dirname, "key.pem"), 'utf8'),
  //   cert: fs.readFileSync(path.join(__dirname, "certificate.pem"), 'utf8')
  // }
})



server.route([
  {
    method: 'GET',
    path: '/ping',
    handler: (req, h) => {
      return 'pong'
    }
  },
  {
    method: 'GET',
    path: '/{anypath*}',
    handler: async (req, res) => {
      let page = `${currentDomain}${req.url.href}`

      if (!page.startsWith('http://') && !page.startsWith('https://')) {
        page = `http:\/\/${page}`
      }

      try {
        const p = await axios.get(page, {
          responseType: 'arraybuffer'
        })
        req.myheaders = p.headers
        return p.data
      } catch (err) {
        console.log('ERROR: ')
        console.log(err)
        return 'ERROR'
      }
    }
  }
])


const preResponse = function (request, h) {
  if (request.response && request.myheaders) {
    request.response.headers = request.myheaders
  }

  return h.continue
};

server.ext('onPreResponse', preResponse);

server.ext('onRequest', function (request, reply) {
  // console.log(request)
  return reply.continue
})

const start = async function () {
  try {
    await server.start()
    // httpsServer.listen(5000)
    console.log('Server started!')
  } catch (err) {
    console.log('Error starting server')
    console.log(err)
  }
}

module.exports = {
  start
}
