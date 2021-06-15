import { KeyValue } from "./key-value.model";

export class Settings {
    public key: string;
    public dailyCalorieNeed: number;
    public weight: number;
    public fatRatio: number;
    public target: KeyValue;

    constructor() {
        this.key = "";
        this.dailyCalorieNeed = 0;
        this.weight = 0;
        this.fatRatio = 0;
        this.target = new KeyValue();
    }
}