import { KeyValue } from "./key-value.model";

export const SETTINGS_INITIAL = { key: "", dailyCalorieNeed: 0, weight: 0, fatRatio: 0, target: { key: 0, value: "" } };

export interface Settings {
    key: string;
    dailyCalorieNeed: number;
    weight: number;
    fatRatio: number;
    target: KeyValue;
}