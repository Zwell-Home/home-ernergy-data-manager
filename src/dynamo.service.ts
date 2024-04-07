import { DynamoDBClient, PutItemCommand, QueryCommand, DeleteItemCommand, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";


export class DynamoService {

  private client: DynamoDBClient;
  private table: string;

  public constructor(client: DynamoDBClient, table: string) {
    this.client = client;
    this.table = table
  }

  public async getItem(key: any, options?: any) {
    console.log(`Getting ${key}`);
    const getCommand = new GetItemCommand({
      TableName: this.table,
      
      Key: key,
      ...options
    });
    
    return await this.client.send(getCommand);
  }

  public async putItem(item: any) {
    const putCommand = new PutItemCommand({
      TableName: this.table,
      Item: item
    });
  
    console.log(`inserting ${item}`);
    return await this.client.send(putCommand);
  }

  public async deleteItem(key: any) {
    const deleteCommand = new DeleteItemCommand({
      TableName: this.table,
      Key: key
    });

    const deleteResult = await this.client.send(deleteCommand);
    console.log(`delete for ${key}: ${deleteResult.$metadata.httpStatusCode}`);
    return deleteResult;
  }

  public async queryItem(expression: string, attribute: any) {
    const queryCommand = new ScanCommand({
      TableName: this.table,
      Select: 'ALL_ATTRIBUTES',
      FilterExpression: expression,
      ExpressionAttributeValues: attribute
    });

    return await this.client.send(queryCommand);
  }

  public async getAll() {
    const queryCommand = new ScanCommand({
      TableName: this.table,
      Select: 'ALL_ATTRIBUTES'
    });

    return await this.client.send(queryCommand);
  }

  public getTable() {
    return this.table;
  }

  public setTable(newTable: string) {
    this.table = newTable;
  }
}