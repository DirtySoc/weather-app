const path = require('path')
const sslRedirect = require('heroku-ssl-redirect')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3001

// Define paths for express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Handlebars Configuration
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Configure static directory to serve
app.use(express.static(publicPath))

// Configure app to redirect http to https traffic
app.use(sslRedirect())

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Derek Willingham'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'You need help!',
        name: 'Derek Willingham'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Derek Willingham'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        } else {
            forecast(longitude, latitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error })
                } else {
                    return res.send({
                        forecast: forecastData,
                        location,
                        address: req.query.address,
                        longitude,
                        latitude
                    })
                }
              })
        }
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        message: 'Sorry, that help page was not found!',
        name: 'Derek Willingham'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        message: `We couldn't locate that page! Sorry!`,
        name: 'Derek Willingham'
    })
})

app.listen(port, () => console.log(`Express listening on port ${port}`))