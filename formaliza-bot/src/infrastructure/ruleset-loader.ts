import * as fs from 'fs';
import * as path from 'path';
import { RuleSet } from '../domain/rules/engine';

export class RuleSetLoader {
    static load(filename: string): RuleSet {
        const filePath = path.join(__dirname, '..', 'domain', 'rules', filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    }
}
