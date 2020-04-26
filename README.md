# Server to upload the files

## To run the repo

- Using npm

```
npm install
npm start
```

- Using Yarn

```
yarn add
yarn start
```

Server starts at http://localhost:3000

## Details

The images uploaded get saved in the images folder and returns the path link which can be saved in the database.

The API for uploading image is `/api/upload/` in which form data is sent.

Other APIs will be created as amd when needed.

Link for the images is `/images/{image_name}`
