## Real Analytics API

**Live @ [AWS lambda]( https://i8bsrn67me.execute-api.ap-south-1.amazonaws.com/production/v1/data-collector/{)** 

### Prerequisites 
1. Docker up and running
2. Node and npm installed
3. aws-cli
4. [Postman Collection](https://documenter.getpostman.com/view/2822837/T1DpBd1b) or [goto](./_/)  for postman
 collection and the environment

### How to run locally
Skip if you have already setup the following.
1. On AWS console, create a aws user for serverless framework (lambda, ynamo db, cloud formation, IAM, AWS API gateway)
    ````shell script
    $ pip3 install awscli
    $ aws --version
    # configure aws-cli by setting the aws credentials 
    $ aws login 
    ````
2. install serverless framework
    ```shell script
    $ npm install -g serverless
    $ sls login
    # create a serverless app on dashboard   
    $ serverless --org {organization name} --app youtube-collections
    ```
3. Run the Mongodb locally
    ```shell script
    docker run -p 27017:27017 {Docker Container name}
    ```
4. Create a Serverless framework account for local deployment automation 
5. install npm packages inside the project
    ```shell script
    npm i
    ```
6. Set the .env configuration according to the environment
- Example .env names:
    1. .env.development
    2. .env.testing
    3. .env.production
    4. .env.${name_of_the_env}

    ```dotenv
    L_AWS_ACCESS_KEY=
    L_AWS_SECRET=
    L_AWS_REGION=
    APP_NAME=
    NODE_ENV=
    JWT_SECRET=
    JWT_ALGORITHM=
    JWT_EXP=5m
    DB_NAME=
    DB_HOST=
    DB_PORT=
    DB_PASSWORD=
    DB_USER=
    REDIS_ENDPOINT=
    REDIS_PASSWORD=
    REDIS_PORT=
    PUSHER_APP_ID
    PUSHER_KEY=
    PUSHER_SECRET=
    PUSHER_CLUSTER=

    ```
    
7. Add the offline plugin to serverless framework 
 ```yaml
     plugins:
       - serverless-dotenv-plugin
       - serverless-offline
 ```
8. Run the project
```shell script
 sls offline start --stage development 
```  
### Unit tests
* 6 test cases covering the major functionality.
 
 ```shell script
  npm run test
 ```
### Important commands
   
##### Invoke functions individually  
```shell script
  sls invoke local -f {function name} --stage {environment} 
```
##### Deploy to AWS
```shell script
  sls deploy --stage production
```

##### Remove from production
```shell script
    sls remove --stage production
```
### Discussion

 The application is naturally scalable since lambda can be scaled function wise. Breaking a tightly coupled API logic
  into small functions gives room for extending, scaling and improves testability. Also the get api is independant of
   the less frequently used CSV upload utility. 

### Problems and Assumptions 
1. Following unit has a tenant and a lease period but is not rented - Assumed that the tenent has already made the
 payment till the agreement ends)
```shell script
 {
      _id: 5f21d6f5ceafb71f5beafb38,
      ref: 'A_5_5',
      timestamp: '01.02.19',
      __v: 0,
      asset: [Object],
      createdAt: 2020-07-29T20:07:17.717Z,
      is_rented: false,
      lease_end: '01.02.20',
      lease_start: '01.02.19',
      rent: 600,
      size: 60,
      tenant: 'Stephania Sagers',
      type: 'RESIDENTIAL',
      updatedAt: 2020-08-04T16:35:17.993Z
    }

```
2. Some units didn't have a lease end date, therefore I didn't calculate the WALT value since it will high
3. Some units were occupied by the same tenant. Therefore I calculated the occupancy area as the addition of all
 areas occupied by the tenant under the asset.
4. The CSV files will be added newly only if the timestamp is different. If it's same, it will update the data
 already in the database if exists, else it will create the missing data.
    
### Architectural diagram and a brief summery.
 
 <img src="docs/pusherarch.jpg"/>

