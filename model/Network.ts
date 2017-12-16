import { BenchmarkerClient } from "./ScoreComputer";

/**
 * Created by Habanero on 2017. 10. 06..
 */

declare let navigator : {connection: any}

export enum ConnectionType {
    wifi = "wifi",
    cellular = "cellular",
    ethernet = "ethernet"
}

interface NetworkInfo{
    downlink: number,
    type?: String,
    effectiveType: String,
    rtt: number
}

export class Network{
    private _type : ConnectionType
    private _effectiveType: String
    private _downlink : number
    private _uplink : number
    private _roundTripTime : number
    private _client: BenchmarkerClient

    constructor(client?: BenchmarkerClient) {
        this._type = ConnectionType.wifi
        this.Client = client
        this.maintainNetworkInfos()
    }

    private maintainNetworkInfos(){
        if(!this.Client){
            let networkInfo : NetworkInfo = navigator.connection
            setInterval(()=>{
                if(networkInfo === undefined){
                    this.measureDownloadSpeed()
                    this.measureUploadSpeed()
                }else{
                    this.updateNetworkInfos(networkInfo) 
                }
            }, 10000)
        }
    }

    private updateNetworkInfos(networkInfo: NetworkInfo){
        if(networkInfo.type !== undefined){    
            this._type = networkInfo.type as ConnectionType
        }
        this._downlink = networkInfo.downlink
        this._effectiveType = networkInfo.effectiveType
        this._roundTripTime = networkInfo.rtt
    }

    private measureUploadSpeed(){ //TODO
        this._uplink = 1 
    }

    private measureDownloadSpeed(){
        let imageAddr = "https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg"
        let downloadSize = 5245329 //bytes
        let download = new Image()
        let startTime : number, endTime : number, duration : number
        let bitsLoaded = downloadSize * 8

        startTime = (new Date()).getTime()
        let cacheBuster = "?nnn=" + startTime

        download.src = imageAddr + cacheBuster

        download.onload = () => {
            endTime = (new Date()).getTime()
            duration = (endTime - startTime) / 1000
            let speedbps = Number((bitsLoaded / duration).toFixed(2))
            let speedkbps = Number((speedbps / 1024).toFixed(2))
            this._downlink = Number((speedkbps / 1024).toFixed(2))
        }
    }

    get type(): ConnectionType {
        return this._type
    }

    get downlink(): number {
        if(!this.Client){
            return this._downlink
        }
        else{
            return this.Client.getBandwidth()
        }
    }

    get uplink(): number {
        if(!this.Client){
            return this._uplink
        }
        else{
            return this.Client.getBandwidth()
        }
    }

    set type(value: ConnectionType) {
        this._type = value
    }

    set downlink(value: number) {
        this._downlink = value
    }

    set uplink(value: number) {
        this._uplink = value
    }

    get Client(): BenchmarkerClient{
        return this._client
    }

    set Client(value: BenchmarkerClient){
        this._client = value
    }
}
