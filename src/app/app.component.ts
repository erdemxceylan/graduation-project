import { Component, OnDestroy, OnInit } from '@angular/core';
import { Nutrient } from 'src/models/nutrient.model';
import { HttpManager } from 'src/services/http-manager.service';
import { Dropdown } from 'primeng/dropdown';
import { PrimeNGConfig } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, timeoutWith } from 'rxjs/operators';
import { PageTypes } from 'src/enums/page-types.enum';
import { KeyValue } from 'src/models/key-value.model';
import { Settings } from 'src/models/settings.model';
import { FitnessTargets } from 'src/enums/fitness-targets.enum';
import { ProcessTypes } from 'src/enums/process-types.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpManager],
})
export class AppComponent implements OnInit, OnDestroy {
  public readonly FitnessTargets: typeof FitnessTargets = FitnessTargets;
  public readonly PageTypes: typeof PageTypes = PageTypes;
  public readonly ProcessTypes: typeof ProcessTypes = ProcessTypes;

  public processType: ProcessTypes = ProcessTypes.Add;
  public pageType: PageTypes = PageTypes.HomePage;
  public showDataSettings: boolean = false;
  public showAddUpdateNutrient: boolean = false;

  public menuItems: MenuItem[] = [];
  public nutrientList: Nutrient[] = [];
  public selectedNutrient: Nutrient = new Nutrient();
  public enteredNutrientList: Nutrient[] = [];
  public gridSelectedNutrient: Nutrient = new Nutrient();
  public gridNLSelectedNutrient: Nutrient = new Nutrient();

  public totalProtein: number = 0;
  public totalCalories: number = 0;

  public dataSettings: Settings = new Settings();
  public targets: KeyValue[] = [
    { key: FitnessTargets.LosingWeight, value: 'Kilo Verme' },
    { key: FitnessTargets.Bulking, value: 'Kütle Arttırma' },
  ];

  public dataSettingsPopupModel: Settings = new Settings();
  public addUpdatePopupNutrientModel: Nutrient = new Nutrient();

  private _originalNutrientList: Nutrient[] = [];
  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private _httpManager: HttpManager,
    private _primengConfig: PrimeNGConfig
  ) { }

  public async ngOnInit() {
    this._primengConfig.ripple = true;
    this._setMenuItems();
    await this._getAllNutrients();
    await this._getDataSettings();
    this._setMenuClickListeners();
  }

  private async _getAllNutrients() {
    await this._httpManager.getAllNutrients()
      .pipe(takeUntil(this._unsubscribe$))
      .toPromise()
      .then((nutrientList: Nutrient[]) => {
        this.nutrientList = JSON.parse(JSON.stringify(nutrientList));
        this._originalNutrientList = JSON.parse(JSON.stringify(nutrientList));
      });
  }

  private async _getDataSettings() {
    await this._httpManager.getDataSettings()
      .pipe(takeUntil(this._unsubscribe$))
      .toPromise()
      .then((settings: Settings) => {
        this.dataSettings.key = settings.key;
        this.dataSettings.dailyCalorieNeed = settings.dailyCalorieNeed;
        this.dataSettings.fatRatio = settings.fatRatio;
        this.dataSettings.weight = settings.weight;
        this.dataSettings.target.key = settings.target.key;
        this.dataSettings.target.value = this._getTargetValue(settings.target.key);

        this.dataSettingsPopupModel.key = settings.key;
        this.dataSettingsPopupModel.dailyCalorieNeed = settings.dailyCalorieNeed;
        this.dataSettingsPopupModel.fatRatio = settings.fatRatio;
        this.dataSettingsPopupModel.weight = settings.weight;
        this.dataSettingsPopupModel.target.key = settings.target.key;
        this.dataSettingsPopupModel.target.value = this._getTargetValue(settings.target.key);
      });
  }

  public onSelectedNutrientChanged() {
    this.gridSelectedNutrient = new Nutrient();
  }

  public onAddClicked(nutrientDropdown: Dropdown) {
    if (this.selectedNutrient && this.enteredNutrientList) {
      if (this.enteredNutrientList.some((n) => n.key === this.selectedNutrient.key)) {
        const index = this.enteredNutrientList.findIndex(n => n.key === this.selectedNutrient.key);
        const activeNutrient = this.enteredNutrientList[index];
        const updatedNutrient = new Nutrient();
        updatedNutrient.key = activeNutrient.key;
        updatedNutrient.name = activeNutrient.name;
        updatedNutrient.unitType = activeNutrient.unitType;
        updatedNutrient.unitQuantity = activeNutrient.unitQuantity + this.selectedNutrient.unitQuantity;
        updatedNutrient.calories = updatedNutrient.unitQuantity * this.selectedNutrient.calories;
        updatedNutrient.protein = updatedNutrient.unitQuantity * this.selectedNutrient.protein;
        this.enteredNutrientList[index] = updatedNutrient;
      } else {
        const newNutrient: Nutrient = new Nutrient();
        newNutrient.key = this.selectedNutrient.key;
        newNutrient.name = this.selectedNutrient.name;
        newNutrient.unitType = this.selectedNutrient.unitType;
        newNutrient.unitQuantity = this.selectedNutrient.unitQuantity;
        newNutrient.protein = newNutrient.unitQuantity * this.selectedNutrient.protein;
        newNutrient.calories = newNutrient.unitQuantity * this.selectedNutrient.calories;
        this.enteredNutrientList.push(newNutrient);
      }
      this._clearItems(nutrientDropdown);
      this._calculateTotals();
    }
  }

  public onEditClicked(nutrientDropdown: Dropdown) {
    if (this.selectedNutrient && this.enteredNutrientList) {
      const index = this.enteredNutrientList.findIndex(n => n.key === this.selectedNutrient.key);
      const activeNutrient = this.enteredNutrientList[index];
      const updatedNutrient = new Nutrient();
      updatedNutrient.key = activeNutrient.key;
      updatedNutrient.name = activeNutrient.name;
      updatedNutrient.unitType = activeNutrient.unitType;
      updatedNutrient.unitQuantity = this.selectedNutrient.unitQuantity;
      updatedNutrient.calories = updatedNutrient.unitQuantity * this.selectedNutrient.calories;
      updatedNutrient.protein = updatedNutrient.unitQuantity * this.selectedNutrient.protein;
      this.enteredNutrientList[index] = updatedNutrient;
      this._clearItems(nutrientDropdown);
      this._calculateTotals();
    }
  }

  public onDeleteClicked(nutrientDropdown: Dropdown) {
    if (this.selectedNutrient && this.enteredNutrientList) {
      this.enteredNutrientList = this.enteredNutrientList.filter(n => n.key !== this.selectedNutrient.key);
    }
    this._clearItems(nutrientDropdown);
    this._calculateTotals();
  }

  public onRowSelect() {
    if (this.nutrientList && this.gridSelectedNutrient) {
      const originalNutrient = this.nutrientList.find((n) => n.key === this.gridSelectedNutrient.key) || new Nutrient();
      const nutrient = new Nutrient();
      nutrient.key = originalNutrient.key;
      nutrient.name = originalNutrient.name;
      nutrient.unitType = originalNutrient.unitType;
      nutrient.unitQuantity = this.gridSelectedNutrient.unitQuantity;
      nutrient.calories = originalNutrient.calories;
      nutrient.protein = originalNutrient.protein;
      this.selectedNutrient = nutrient;
    }
  }

  public onRowUnselect() {
    this.selectedNutrient = new Nutrient();
  }

  private _clearItems(nutrientDropdown: Dropdown) {
    this.nutrientList = JSON.parse(JSON.stringify(this._originalNutrientList));
    this.selectedNutrient = new Nutrient();
    this.gridSelectedNutrient = new Nutrient();
    if (nutrientDropdown) nutrientDropdown.focus();
  }

  private _calculateTotals() {
    if (this.enteredNutrientList && this.enteredNutrientList.length > 0) {
      const tNutrient = this.enteredNutrientList.reduce((pNutrient: Nutrient, cNurtient: Nutrient) => {
        const nutrient = new Nutrient();
        nutrient.calories = pNutrient.calories + cNurtient.calories;
        nutrient.protein = pNutrient.protein + cNurtient.protein;
        return nutrient;
      });

      if (tNutrient) {
        this.totalCalories = tNutrient.calories;
        this.totalProtein = tNutrient.protein;
      }
    }
  }

  private _setMenuItems() {
    this.menuItems = [
      { id: 'menu-home', label: 'Anasayfa', icon: 'pi pi-fw pi-home' },
      { id: 'menu-list', label: 'Besin Listesi', icon: 'pi pi-fw pi-list' },
      { id: 'menu-settings', label: 'Veri Ayarları', icon: 'pi pi-fw pi-cog' },
    ];
  }

  private _setMenuClickListeners() {
    setTimeout(() => {
      const menuHome = document.getElementById('menu-home');
      if (menuHome) {
        fromEvent(menuHome, 'click')
          .pipe(takeUntil(this._unsubscribe$))
          .subscribe(() => {
            this._clearNutrientModels();
            this.pageType = PageTypes.HomePage
          });
      }

      const menuNurientList = document.getElementById('menu-list');
      if (menuNurientList) {
        fromEvent(menuNurientList, 'click')
          .pipe(takeUntil(this._unsubscribe$))
          .subscribe(async () => {
            await this._getAllNutrients();
            this._clearNutrientModels();
            this.pageType = PageTypes.NutrientList;
          });
      }

      const menuSettings = document.getElementById('menu-settings');
      if (menuSettings) {
        fromEvent(menuSettings, 'click')
          .pipe(takeUntil(this._unsubscribe$))
          .subscribe(() => {
            this._clearNutrientModels();
            this.showDataSettings = true
          });
      }
    });
  }

  private _clearNutrientModels() {
    this.selectedNutrient = new Nutrient();
    this.addUpdatePopupNutrientModel = new Nutrient();
    this.gridSelectedNutrient = new Nutrient();
    this.gridNLSelectedNutrient = new Nutrient();
  }

  private _getTargetValue(key: number): string {
    return key === FitnessTargets.LosingWeight ? "Kilo Verme" : "Kütle Arttırma";
  }

  public async onDataSettingsUpdateClicked() {
    if (this.dataSettingsPopupModel && this.dataSettingsPopupModel.key !== "") {
      let isUpdated: boolean = false;
      await this._httpManager.updateDataSettings(this.dataSettingsPopupModel)
        .pipe(takeUntil(this._unsubscribe$))
        .toPromise()
        .then((result: boolean) => isUpdated = result);
      if (isUpdated) {
        await this._getDataSettings();
        this.showDataSettings = false;
      }
    }
  }

  public getDailyCalorieIntervalLowerBound(): number {
    if (this.dataSettings.target.key === FitnessTargets.LosingWeight)
      return this.dataSettings.dailyCalorieNeed - 500;
    return this.dataSettings.dailyCalorieNeed;
  }

  public getDailyCalorieIntervalUpperBound(): number {
    if (this.dataSettings.target.key === FitnessTargets.Bulking)
      return this.dataSettings.dailyCalorieNeed + 300;
    return this.dataSettings.dailyCalorieNeed;
  }

  public getDailyProteinNeed(): number {
    if (this.dataSettings.target.key === FitnessTargets.Bulking)
      return this.dataSettings.weight * (100 - this.dataSettings.fatRatio) / 100 * 2;
    return this.dataSettings.weight * (100 - this.dataSettings.fatRatio) / 100 * 1.5;
  }

  public onNLRowSelect() {

  }

  public onNLRowUnselect() {
    this.addUpdatePopupNutrientModel = new Nutrient();
  }

  public onNLAddClicked() {
    this._clearNutrientModels();
    this.processType = ProcessTypes.Add;
    this.showAddUpdateNutrient = true;
  }

  public onNLEditClicked() {
    if (this.gridNLSelectedNutrient && this.gridNLSelectedNutrient.key !== "") {
      this.addUpdatePopupNutrientModel.key = this.gridNLSelectedNutrient.key;
      this.addUpdatePopupNutrientModel.name = this.gridNLSelectedNutrient.name;
      this.addUpdatePopupNutrientModel.unitType = this.gridNLSelectedNutrient.unitType;
      this.addUpdatePopupNutrientModel.calories = this.gridNLSelectedNutrient.calories;
      this.addUpdatePopupNutrientModel.protein = this.gridNLSelectedNutrient.protein;
      this.processType = ProcessTypes.Update;
      this.showAddUpdateNutrient = true;
    }
  }

  public async onNLDeleteClicked() {
    if (this.gridNLSelectedNutrient && this.gridNLSelectedNutrient.key !== "") {
      let isDeleted: boolean = false;
      await this._httpManager.deleteNutrient(this.gridNLSelectedNutrient.key)
        .pipe(takeUntil(this._unsubscribe$))
        .toPromise()
        .then((result: boolean) => isDeleted = result);
      if (isDeleted) {
        await this._getAllNutrients();
        this.gridNLSelectedNutrient = new Nutrient();
        this.enteredNutrientList = [];
      }
    }
  }

  public async onNLSaveClicked() {
    let isUpdated: boolean = false;
    let isAdded: boolean = false;
    if (this.processType === ProcessTypes.Add) {
      await this._httpManager.addNutrient(this.addUpdatePopupNutrientModel)
        .pipe(takeUntil(this._unsubscribe$))
        .toPromise()
        .then((result: boolean) => isAdded = result);
    }
    else if (this.processType === ProcessTypes.Update) {
      await this._httpManager.updateNutrient(this.addUpdatePopupNutrientModel)
        .pipe(takeUntil(this._unsubscribe$))
        .toPromise()
        .then((result: boolean) => isUpdated = result);
    }
    if (isAdded || isUpdated) {
      await this._getAllNutrients();
      this.gridNLSelectedNutrient = new Nutrient();
      if (isUpdated) this.enteredNutrientList = [];
      this.showAddUpdateNutrient = false;
    }
  }

  public getTotalCaloriesClass() {
    if (this.totalCalories > this.getDailyCalorieIntervalUpperBound())
      return "red";
    else if (this.totalCalories >= this.getDailyCalorieIntervalLowerBound() && this.totalCalories <= this.getDailyCalorieIntervalUpperBound())
      return "green";
    return null;
  }

  public getTotalProteinClass() {
    if (this.totalProtein >= this.getDailyProteinNeed())
      return "green";
    return null;
  }

  public onAddUpdateNutrientHide() {
    this.addUpdatePopupNutrientModel = new Nutrient();
  }

  public onDataSettingsHide() {
    if (this.dataSettings && this.dataSettings.key !== "") {
      this.dataSettingsPopupModel = new Settings();
      this.dataSettingsPopupModel.key = this.dataSettings.key;
      this.dataSettingsPopupModel.dailyCalorieNeed = this.dataSettings.dailyCalorieNeed;
      this.dataSettingsPopupModel.fatRatio = this.dataSettings.fatRatio;
      this.dataSettingsPopupModel.weight = this.dataSettings.weight;
      this.dataSettingsPopupModel.target.key = this.dataSettings.target.key;
      this.dataSettingsPopupModel.target.value = this._getTargetValue(this.dataSettings.target.key);
    }
  }

  public ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}

/* TODO List */
/*
  - Mobile responsive design
  - Popuplar kapandıktan sonra, popup açılmadan önce hangi tab aktif ise o tab tekrar aktif olmalıdır.
  - Update, delete, Add işlemlerinden sonra success message
  */