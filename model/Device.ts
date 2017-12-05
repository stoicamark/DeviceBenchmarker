/**
 * Created by Habanero on 2017. 10. 06..
 */

import {Battery} from "./Battery"
import {Network} from "./Network"

export class Device{

    private _network : Network
    private _battery : Battery
   
    constructor(){
        this._battery = new Battery()
        this._network = new Network()
    }

    public get network() : Network {
        return this._network
    }

    public set network(value : Network) {
        this._network = value
    }

    public get battery() : Battery {
        return this._battery
    }

    public set battery(value : Battery) {
        this._battery = value
    }
}