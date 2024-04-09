# home-ernergy-data-manager
Manage the data in the dynamoDB

# Run Data Manager

The `data-manager` can be run locally from any developer machine, using `node` and AWS CREDENTIALS

1. `export` user's aws access key credneitals in shell.

  ```(shell)
  export AWS_ACCESS_KEY_ID=<your access key ID>
  export AWS_SECRET_ACCESS_KEY=<you secret access key>
  ```

2. In the same shell run:

```(shell)
  npm start
```

*This repo uses node:20.*

## ZIPCODE Data

The zipcode table has **27,602** Items. In Database terms a relatively small amount, but in comparison to the other tables, a huge difference in size. Because of this the code to actually update the **code to update zipcode is commented out**. Simply uncomment the section of code to also update the zipcode tables as well.

```(node)
  // update zipcode table

  // ***** ZIPCODE has 27602 records... uncomment to update *****

  // client.setTable('prod_zwell_zipcode_table');
  // console.log(`
  // ----
  // Successfully updated zipcode count: ${(await uploadToDynamo(zipcodeData as any[], ['_id', 'zipcode'])).length}
  // ----
  // `);
```

**UPDATE TO**

```(node)
  // update zipcode table

  // ***** ZIPCODE has 27602 records... uncomment to update *****

  client.setTable('prod_zwell_zipcode_table');
  console.log(`
  ----
  Successfully updated zipcode count: ${(await uploadToDynamo(zipcodeData as any[], ['_id', 'zipcode'])).length}
  ----
  );
```
