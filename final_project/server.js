const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const port = 3001

const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'mysecretkey'
const bookController = require('./controllers/BookController')
const cors = require('cors')
const DateLib = require('./libs/to_thai_date')
const fileUpload = require('express-fileupload')
const path = require('path')
const fs = require('fs')
const MemberController = require('./controllers/MemberController')
const TodoController = require('./controllers/TodoController')

// Middleware สำหรับรับ JSON และ form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  "origin": "*",
  "methods": "GET,PUT,POST,DELETE",
}))
app.use(fileUpload())

const uploadDir = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// Middleware สำหรับเช็ค JWT Token
function authenticationToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

  if (!token) return res.sendStatus(401)

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(401)

    req.user = user
    next()
  })
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ================= Routes =================

app.get('/books', bookController.list)
app.post('/books', bookController.create)
app.put('/books/:id', bookController.update)
app.delete('/books/:id', bookController.delete)

app.post('/members/signup', MemberController.signup)
app.post('/members/signin', MemberController.signin)
app.get('/members/info', MemberController.info)
app.put('/members/update', MemberController.update)
app.post('/members/uploadProfile', MemberController.uploadProfile)

app.post('/todo/create', TodoController.create)
app.get('/todo/list', TodoController.list)
app.put('/todo/update/:id', TodoController.update)
app.delete('/todo/remove/:id', TodoController.remove)
app.put('/todo/updateStatus/:id', TodoController.updateStatus)
app.get('/todo/filter/:status', TodoController.filter)
app.get('/todo/dashboard', TodoController.dashboard)

app.get('/use-lib', (req, res) => {
  const date = new Date()
  res.json({ date: DateLib.to_thai(date) })
})

app.get('/', (req, res) => {
  res.send('Hello Express');
});

app.get('/hello', (req, res) => {
  res.send('hello api');
});

app.get('/hi/:name', (req, res) => {
  const name = req.params.name;
  res.send('hello ' + name);
});

app.get('/hi/:name/:age', (req, res) => {
  const name = req.params.name;
  const age = req.params.age;
  res.send('hello ' + name + ' age = ' + age);
});

app.post('/post-method', (req, res) => {
  res.send('post-method');
});

app.post('/post-data', (req, res) => {
  const name = req.body.name
  const age = req.body.age

  res.send('name = ' + name + ' age = ' + age)
})

app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;

  res.json({ id, name, price });
});

app.delete('/remove/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id: id });
});

app.post('/login', (req, res) => {
  try {
    const username = req.body.username
    const password = req.body.password

    if (username == 'admin' && password == 'admin') {
      const payload = { id: 1 }
      const options = { expiresIn: '1h' }
      const token = jwt.sign(payload, SECRET_KEY, options)

      return res.json({ token: token })
    }

    res.json({ message: 'user not found' })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

app.get('/profile', authenticationToken, (req, res) => {
  res.json({ message: 'This is protected', user: req.user })
})

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('no files were uploaded.')
  }

  const uploadedFile = req.files.file
  const uploadPath = path.join(uploadDir, uploadedFile.name)

  uploadedFile.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err)

    res.json({
      message: 'file uploaded successfully',
      filename: uploadedFile.name,
      path: uploadPath
    })
  })
})

// ================= Start Server =================

const server = app.listen(port, () => {
  console.log(`server is running on localhost:${port}`);
});

// Handling termination signals gracefully
const shutdown = (signal) => {
  console.log(`Received ${signal}. Closing server...`);
  server.close(err => {
    if (err) {
      console.error('Error closing server:', err);
      process.exit(1);
    }
    process.exit(0);
  });
};

['SIGTERM', 'SIGINT', 'SIGHUP'].forEach(sig => {
  try {
    process.on(sig, () => shutdown(sig));
  } catch (e) {
    // Signal not available on platform
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});