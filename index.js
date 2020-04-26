const Express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const { static } = require('express');
const fs = require('fs');

const app = Express()
app.use(bodyParser.json())

app.use('/images/', static('./images/'));

const Storage = multer.diskStorage({
  async destination(req, file, callback) {
    const dir = `./images/${file.originalname}`
    await checkUploadPath(dir, callback)
  },
  async filename(req, file, callback) {
    await callback(null, `${file.originalname}_${new Date().getTime()}`)
  },
})

const makeDirectory = async (uploadPath, callback) => {
  console.log("Making a fresh folder...")
  await fs.mkdir(uploadPath, function (err) {
    if (err) {
      console.log('Error in folder creation');
      throw err;
    }
    console.log("Saving the picture...")
    callback(null, uploadPath)
  })
}

const checkUploadPath = async (path, callback) => {
  const uploadPath = `${path}/`
  console.log("Checking the existence of previous file...")
  await fs.exists(uploadPath, async function (exists) {
    if (exists) {
      console.log("Removing the previous folder...")
      await fs.rmdir(path, { recursive: true }, async (err) => {
        if (err) await console.log("err", err)
        else await makeDirectory(uploadPath, callback)
      })
    }
    else await makeDirectory(uploadPath, callback)
  })
}

const upload = multer({ storage: Storage })

app.get('/', (req, res) => {
  res.status(200).send('You can post to /api/upload.')
})

app.post('/api/upload', upload.array('photo', 3), async (req, res) => {
  console.log("Sending successful response...")
  console.log('file', req.files)
  res.status(200).json({
    link: req.files[0].path,
    message: 'success!',
  })
})

app.listen(3000, () => {
  console.log('App running on http://localhost:3000')
})
