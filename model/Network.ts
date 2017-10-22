/**
 * Created by Habanero on 2017. 10. 06..
 */

declare let navigator : {connection: any};

export enum ConnectionType {
    wifi = "wifi",
    cellular = "cellular",
    ethernet = "ethernet"
}

interface NetworkInfo{
    downlink: number,
    downlinkMax?: number,
    type?: string,
    effectiveType: string,
    rtt: number,
    onchange: any
}

export class Network{
    private _type : ConnectionType;
    private _effectiveType: any;
    private _downlink : number;
    private _uplink : number;
    private _uplinkLimit : number;
    private _downlinkLimit : number;
    private _downlinkMax : number;
    private _roundTripTime : number;

    constructor() {
        let networkInfo : NetworkInfo = navigator.connection;

        this._type = ConnectionType.wifi;
        this._downlinkLimit = 2.5; // maximum score if the downlink reaches >= 25 Mbps
        this._uplinkLimit = 1;

        if(networkInfo === undefined){
            this.measureDownloadSpeed();
        }else{
            this.updateNetworkInfos(networkInfo);
            networkInfo.onchange += this.updateNetworkInfos(networkInfo);
        }
        
        this.measureUploadSpeed();
    }

    private updateNetworkInfos(networkInfo: NetworkInfo){
        if(networkInfo.type !== undefined){    
            this._type = networkInfo.type as ConnectionType;
        }
        this._downlink = networkInfo.downlink;
        this._downlinkMax = networkInfo.downlinkMax;
        this._effectiveType = networkInfo.effectiveType;
        this._roundTripTime = networkInfo.rtt;
    }

    private measureUploadSpeed(){ //TODO
        this._uplink = 1; 
    }

    private measureDownloadSpeed(){
        let imageAddr = "https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg";
        let downloadSize = 5245329; //bytes
        let download = new Image();
        let startTime : number, endTime : number, duration : number;
        let bitsLoaded = downloadSize * 8;

        startTime = (new Date()).getTime();
        let cacheBuster = "?nnn=" + startTime;

        download.src = imageAddr + cacheBuster;

        download.onload = () => {
            endTime = (new Date()).getTime();
            duration = (endTime - startTime) / 1000;
            let speedbps = Number((bitsLoaded / duration).toFixed(2));
            let speedkbps = Number((speedbps / 1024).toFixed(2));
            this._downlink = Number((speedkbps / 1024).toFixed(2));
        };
    }

    get type(): ConnectionType {
        return this._type;
    }

    get downlink(): number {
        return this._downlink;
    }

    get uplink(): number {
        return this._uplink;
    }

    get ulinkLimit(): number {
        return this._uplinkLimit;
    }

    get downlinkLimit(): number {
        return this._downlinkLimit;
    }

    set type(value: ConnectionType) {
        this._type = value;
    }

    set downlink(value: number) {
        this._downlink = value;
    }

    set uplink(value: number) {
        this._uplink = value;
    }

    set uplinkLimit(value: number) {
        this._uplinkLimit = value;
    }

    set downlinkLimit(value: number) {
        this._downlinkLimit = value;
    }
}
