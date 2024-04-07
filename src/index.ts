import { mapFieldNames } from './utils/mapping.utils';
import { DynamoDBClient, PutItemCommand, DeleteItemCommand, GetItemCommand, QueryCommand} from '@aws-sdk/client-dynamodb'

import data from './constants/Home_Energy_Data/Appliances.json';
import { DynamoService } from './dynamo.service';

const client = new DynamoService(new DynamoDBClient({region: 'us-west-2'}), 'prod_zwell_appliance_table')


// a diy upsert to dynamo
const uploadToDynamo = async (items: any[]) => {
  const existingRecords = await client.getAll();
  const formattedItems = items.map(d => mapFieldNames(d));

  // if exists delete
  if (existingRecords.$metadata.httpStatusCode === 200) {
   await Promise.all(existingRecords.Items!.map(async item => {

      return await client.deleteItem({
        _id: {
          S: item._id.S
        },
        appliance: {
          S: item.appliance.S
        }
      });

    }));

    
  }

  return Promise.all(formattedItems.map(async item => client.putItem(item)));
}

(async () => {
  console.log(`Successfully updated count: ${(await uploadToDynamo(data)).length}`);
})();


