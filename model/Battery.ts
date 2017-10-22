/**
 * Created by Habanero on 2017. 10. 06..
 */

declare let navigator : {getBattery: any};

interface BatteryManager{
    level: number,
    dischargingTime: number,
    charging: boolean,
    chargingTime?: number,
    onchargingchange(): void,
    onlevelchange(): void,
    ondischargingtimechange(): void
}

export interface IBatteryListener{
    onLevelDropTimeChanged(measuredLevelDropTime: number): void;
}

export interface IBatteryEventEmitter{
    on(listener : IBatteryListener) : void;
    off(listener : IBatteryListener) : void;
    allOff() : void;
    hasListener() : boolean;
    emitBatteryLevelDropTimeChange(measurement: number) : void;
}

export class Battery implements IBatteryEventEmitter{
    
    private _levelDropTimeInSeconds : number;
    private _avgLevelDropTimeInSeconds: number;
    private _isCharging : boolean;
    private _level : number;
    private _chargingTimeInSeconds : number;
    private _dischargingTimeInSeconds : number;
    private _initialTimeStamp : number;
    private _initialBatteryLevel : number;
    private _batteryListeners : IBatteryListener[] = [];

    constructor(){
        this._levelDropTimeInSeconds = Infinity;
        this._avgLevelDropTimeInSeconds = 180; // one level drop in 3 minutes
        this._initialTimeStamp = Date.now();

        navigator.getBattery().then((battery: BatteryManager) => {
            this.initWithAllInfos(battery);
            battery.onchargingchange = () => {this.updateChargeInfo(battery);};
            battery.onlevelchange = () => {this.updateLevelInfo(battery);};
            battery.ondischargingtimechange = () => {this.updateDischargingInfo(battery);};
        });
    }

    private initWithAllInfos(battery: BatteryManager){
        this.updateChargeInfo(battery);
        this.updateLevelInfo(battery);
        this.updateDischargingInfo(battery);
    }

    private updateDischargingInfo(battery: BatteryManager){
        this._dischargingTimeInSeconds = battery.dischargingTime;
        console.log("Battery discharging time: " + battery.dischargingTime + " seconds");
    }

    private updateLevelInfo(battery: BatteryManager){
        this._level = battery.level;

        let actualTimeStamp = Date.now();
        let dTime = actualTimeStamp - this._initialTimeStamp;
        this._initialTimeStamp = actualTimeStamp;

        if(this._levelDropTimeInSeconds === Infinity){
            this._levelDropTimeInSeconds = this._avgLevelDropTimeInSeconds;
        }else{
            this._levelDropTimeInSeconds = dTime / 1000; 
            this.emitBatteryLevelDropTimeChange(this._levelDropTimeInSeconds);
        } 

        console.log("One level drain duration: " + 
            this._levelDropTimeInSeconds.toFixed(5) + " seconds");
        console.log("Battery level: " + battery.level * 100 + " %");
    }

    private updateChargeInfo(battery: BatteryManager){
        this._isCharging = battery.charging;
        console.log("Battery charging? " + (battery.charging ? "Yes" : "No"));
    } 

    get levelDropTimeInSeconds(): number {
        return this._levelDropTimeInSeconds;
    }

    get isCharging(): boolean {
        return this._isCharging;
    }

    get level(): number {
        return this._level;
    }

    get chargingTimeInSeconds(): number {
        return this._chargingTimeInSeconds;
    }

    get dischargingTimeInSeconds(): number {
        return this._dischargingTimeInSeconds;
    }

    emitBatteryLevelDropTimeChange(measurement: number): void {
        if(this._batteryListeners){
            this._batteryListeners.slice(0).forEach(l => l.onLevelDropTimeChanged(measurement));
        }
    }

    on(listener: IBatteryListener): void {
        this._batteryListeners.push(listener);
    }

    off(listener: IBatteryListener): void {
        this._batteryListeners = this._batteryListeners.filter(l => l !== listener);
    }

    allOff(): void {
        this._batteryListeners = [];
    }

    hasListener(): boolean {
        return this._batteryListeners.length !== 0;
    }
}