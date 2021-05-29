export class Nutrient {
  public key: string;
  public name: string;
  public unit_quantity: number;
  public unit_type: string;
  public calories: number;
  public protein: number;

  constructor() {
    this.key = '';
    this.name = '';
    this.unit_quantity = 0;
    this.unit_type = '';
    this.calories = 0;
    this.protein = 0;
  }
}
