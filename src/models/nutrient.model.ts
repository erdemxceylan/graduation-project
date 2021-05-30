export class Nutrient {
  public key: string;
  public name: string;
  public unitQuantity: number;
  public unitType: string;
  public calories: number;
  public protein: number;

  constructor() {
    this.key = '';
    this.name = '';
    this.unitQuantity = 0;
    this.unitType = '';
    this.calories = 0;
    this.protein = 0;
  }
}
