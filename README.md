## Real Analytics API

**Live @ [AWS lambda]( https://i8bsrn67me.execute-api.ap-south-1.amazonaws.com/production/v1/data-collector/{)** 

### How to run locally
 

### Problems and Assumptions 
1. Following unit has a tenant and a lease period but is not rented - Assumed that the tenent has already made the
 payment till the agreement ends)
```json
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
    
Architectural diagram and a brief summery.
 
