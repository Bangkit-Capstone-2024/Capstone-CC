# BACKEND API FOR MOMEE.ID

## How to Install and running Development

```
git clone -b dev https://github.com/Bangkit-Capstone-2024/Capstone-CC.git

cp .env.example .env
npm install
npm install -g nodemon
npm install -g pm2

npx prisma migrate deploy

npm run dev

```

## How to Run on Production

```
npm install

npm run build

npm run start:pm2
```

<details><summary>Usefull Command</summary>


### Check status Application

```
pm2 status
```

### Stop Application
```
pm2 stop dev-momee
```
### Restart Application
```
pm2 restart dev-momee
```
### Delete Application
```
pm2 delete dev-momee
```
### Running after Reboot
```
pm2 save
pm2 startup
```

</details>

> Should be changed at .env

## Google Cloud Storage Bucket

1. Create new Project
2. Enable Cloud Storage API:

```

Navigation Menu > API & Services > Library > Google Cloud Storage > Enable

```

3. Create New Bucket:

```

Navigation Menu > Storage > Browser > Create Bucket > (Name Bucket) > Create

```

4. Give Public Access for Bucket

```
Bucket Name > PERMISSIONS > + GRANT ACCESS > New Principals : allUsers > Roles: Storage Object Viewer
```

5. Create Service Account

```
a. Open Navigation Menu > IAM & Admin > Service Account
b. Click Create Service Account
c. Give name and click Create
d. At 'Role', Choose Storage > Storage Admin
e. Click Done
f. Click 'Manage keys'
g. Click Add Key > Create new key
h. Choose 'JSON' and 'Create'
i. Download JSON File and Save
j. create and save JSON file to new Folder  : `mkdir credentials`
```

6. Edit .env

```
GOOGLE_APPLICATION_CREDENTIALS=./credentials/<service-account.json>
GCS_BUCKET_NAME=<BUCKET-NAME>
GOOGLE_MAPS_API_KEY=<your-MAPS-API-KEY>

```
