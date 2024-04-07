import { mapFieldNames } from './utils/mapping.utils';
import { DynamoDBClient, PutItemCommand, DeleteItemCommand, GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb'
import util from 'util';

// import json data. this is gross...
import applainceData from './constants/Home_Energy_Data/Appliances.json';
import hvacData from './constants/Home_Energy_Data/HVAC_Appliances.json';
import homeDecadeData from './constants/Home_Energy_Data/Home_Decades.json';
import homeTypeData from './constants/Home_Energy_Data/Home_Type.json';
import stateData from './constants/Home_Energy_Data/State_Data.json';
import zipcodeData from './constants/Home_Energy_Data/Zip_Code_Data.json';
import biomassData from './constants/Home_Energy_Data/Densified_Biomass_Prices.json';


import { DynamoService } from './dynamo.service';

// init creat DynamoService. config later for each table
const client = new DynamoService(new DynamoDBClient({region: 'us-west-2'}), 'NONE')


// diy upsert to dynamo
const uploadToDynamo = async (items: any[], requiredSceham: string[]) => {
  const existingRecords = await client.getAll();
  console.log(`Retrieved ${existingRecords.Count} existing items`);

  // if exists: delete
  if (existingRecords.$metadata.httpStatusCode === 200 && existingRecords.Count! > 0) {
    await Promise.all(existingRecords.Items!.map(async item => {
     

      // build delete command Key from found results
      const deleteItemKey: { [key: string] : any}= {}
      requiredSceham.map(requiredKey => {
        deleteItemKey[requiredKey] = {
          S : item[requiredKey].S //assume required schema types are all S (strings)
        }
      })

      return await client.deleteItem(deleteItemKey);
    }));
  }

  // put new item in dynamo
  const formattedItems = items.map(d => mapFieldNames(d)); // format JSON data for insert
  return Promise.all(formattedItems.map(async item => client.putItem(item)));
}

(async () => {

  // update appliance table
  client.setTable('prod_zwell_appliance_table');
  console.log(`
  ----
  Successfully updated appliance count: ${(await uploadToDynamo(applainceData, ['_id', 'appliance'])).length}
  ----
  `);

  // update hvac table
  client.setTable('prod_zwell_hvac_table');
  console.log(`
  ----
  Successfully updated hvac count: ${(await uploadToDynamo(hvacData, ['_id', 'display_name'])).length}
  ----
  `);

  // update home_decade table
  client.setTable('prod_zwell_home_decade_table');
  console.log(`
  ----
  Successfully updated home_decade count: ${(await uploadToDynamo(homeDecadeData, ['_id', 'decade'])).length}
  ----
  `);

  // update home_type table
  client.setTable('prod_zwell_home_type_table');
  console.log(`
  ----
  Successfully updated home_type count: ${(await uploadToDynamo(homeTypeData, ['_id', 'home_type'])).length}
  ----
  `);

  // update state table
  client.setTable('prod_zwell_state_table');
  console.log(`
  ----
  Successfully updated state count: ${(await uploadToDynamo(stateData, ['_id', 'state'])).length}
  ----
  `);

  // update zipcode table

  // ***** ZIPCODE has 27602 records... uncomment to update *****

  // client.setTable('prod_zwell_zipcode_table');
  // console.log(`
  // ----
  // Successfully updated zipcode count: ${(await uploadToDynamo(zipcodeData as any[], ['_id', 'zipcode'])).length}
  // ----
  // `);

  // update biomass table
  client.setTable('prod_zwell_biomass_table');
  console.log(`
  ----
  Successfully updated biomass count: ${(await uploadToDynamo(biomassData, ['_id', 'name'])).length}
  ----
  `);

})();


