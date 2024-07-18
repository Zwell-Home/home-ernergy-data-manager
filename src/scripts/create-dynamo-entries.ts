import fs from 'fs';
import path from 'path';
import { mapFieldNames } from '../utils/mapping.utils';

const inputDir = path.resolve(__dirname, '../constants/Home_Energy_Data');
const outputDIr = path.resolve(__dirname, '../../dynamo-entries');

(async () => {
    try {
        const constantsFiles = await fs.promises.readdir(inputDir);
        await fs.promises.mkdir(outputDIr);
        for (let file of constantsFiles) {
            const filePath = `${inputDir}/${file}`
            try {
                const entries = JSON.parse(await fs.promises.readFile(filePath, { encoding: 'utf-8' }));
                await fs.promises.writeFile(
                    `${outputDIr}/${file}`,
                    JSON.stringify(entries.map(mapFieldNames), null, 2),
                    { flag: 'wx', encoding: 'utf-8' }
                )
            } catch(e) {
                console.error(`Failed processing "${filePath}": ${e}`);
                continue;        
            }
        }
    } catch (e) {
        console.error(`Failed generating Dynamo entries: ${e}`)
        process.exit(1);
    }
})()