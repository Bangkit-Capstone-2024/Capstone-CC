# BACKEND API FOR MOMEE.ID

## How to Install

```
git clone -b dev https://github.com/Bangkit-Capstone-2024/Capstone-CC.git

cp .env.example .env
npm install
npm install -g nodemon

npx prisma migrate dev -n users_schema

npm run dev

npm start
```

> Should be changed at .env

## Google Cloud Storage Bucket

1. Create new Project
2. Enable Cloud Storage API:

```

API & Services > Library > Google Cloud Storage > Enable

```

3. Create New Bucket:

```

Navigation Menu > Storage > Browser > Create Bucket > (Name Bucket) > Create

```

4. Create Service Account

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
j. create and save JSON file to new Folder  : `mkdir credeentials`
```

5. Edit .env

```
GOOGLE_APPLICATION_CREDENTIALS=./credentials/<service-account.json>
GCS_BUCKET_NAME=<BUCKET-NAME>

```

## User Model

## Tenants Model

## Product Model

## Rent Model

## Category Model
