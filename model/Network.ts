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
    rtt: number,
    onchange: any
}

export class Network{
    private _type : ConnectionType
    private _effectiveType: String
    private _downlink : number
    private _uplink : number
    private _roundTripTime : number

    constructor() {
        let networkInfo : NetworkInfo = navigator.connection

        this._type = ConnectionType.wifi

        // if the NetworkInformation API is not provided
        // measure download speed manually in every 5 minutes
        if(networkInfo === undefined){ 
            setInterval(()=>{
                this.measureDownloadSpeed()
            }, 300000)
        }else{
            this.updateNetworkInfos(networkInfo)
            networkInfo.onchange += this.updateNetworkInfos(networkInfo)
        }
        
        // measure upload speed manually in every 5 minutes
        setInterval(()=>{
            this.measureUploadSpeed()
        }, 300000)
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
        return this._downlink
    }

    get uplink(): number {
        return this._uplink
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
}
