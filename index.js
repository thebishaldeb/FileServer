const Express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const { static } = require('express');
const fs = require('fs');

const app = Express();
app.use(bodyParser.json());

app.use('/images/', static('./images/'));
app.use('/videos/', static('./videos/'));

const Storage = text =>
  multer.diskStorage({
    async destination(req, file, callback) {
      if (text !== 'video') {
        const dir = `./images/${text}/${file.originalname}`;
        await checkImageUploadPath(dir, callback);
      } else {
        const dir = `./videos/${file.originalname}`;
        await checkVideoUploadPath(dir, callback);
      }
    },
    async filename(req, file, callback) {
      await callback(null, `${file.originalname}_${new Date().getTime()}`);
    },
  });

const checkVideoUploadPath = async (path, callback) => {
  await fs.exists(path, async function (exists) {
    if (exists) {
      await callback(null, path);
    } else await makeDirectory(path, callback);
  });
};

const makeDirectory = async (uploadPath, callback) => {
  console.log('Making a fresh folder...');
  await fs.mkdir(uploadPath, function (err) {
    if (err) {
      console.log('Error in folder creation');
      throw err;
    }
    console.log('Saving the data...');
    callback(null, uploadPath);
  });
};

const checkImageUploadPath = async (path, callback) => {
  const uploadPath = `${path}/`;
  console.log('Checking the existence of previous file...');
  await fs.exists(uploadPath, async function (exists) {
    if (exists) {
      console.log('Removing the previous folder...');
      await fs.rmdir(path, { recursive: true }, async err => {
        if (err) await console.log('err', err);
        else await makeDirectory(uploadPath, callback);
      });
    } else await makeDirectory(uploadPath, callback);
  });
};

const upload = text => multer({ storage: Storage(text) });

app.get('/', (req, res) => {
  res
    .status(200)
    .send(
      'You can post to /api/upload-profile or /api/upload-cover or /api/upload-video.',
    );
});

app.post(
  '/api/upload-profile',
  upload('profile').array('photo', 1),
  async (req, res) => {
    console.log('Sending successful response...');
    console.log('file', req.files);
    res.status(200).json({
      link: req.files[0].path,
      message: 'success!',
    });
  },
);

app.post(
  '/api/upload-cover',
  upload('cover').array('photo', 1),
  async (req, res) => {
    console.log('Sending successful response...');
    console.log('file', req.files);
    res.status(200).json({
      link: req.files[0].path,
      message: 'success!',
    });
  },
);

app.post(
  '/api/upload-video',
  upload('video').array('video', 1),
  async (req, res) => {
    console.log('Sending successful response...');
    console.log('file', req.files);
    res.status(200).json({
      link: req.files[0].path,
      message: 'success!',
    });
  },
);

app.listen(3000, () => {
  console.log('App running on http://localhost:3000');
});
