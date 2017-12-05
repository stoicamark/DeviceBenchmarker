import {Device} from "../model/Device"
import {Battery} from "../model/Battery"
import {ScoreAdjuster} from "../model/ScoreAdjuster"
import {ScoreComputer} from "../model/ScoreComputer"
import {PIDController, Options} from "../model/PIDController"
import {mock, instance, when} from "../node_modules/ts-mockito"
import {Network, ConnectionType} from "../model/Network";
import {Event} from "../model/Event"

declare let Plotly : any
declare function require(name:string) : any

interface ITest{
    title: String
    domElementId: String
}

interface ITrace{
    x: number[],
    y: number[],
    name: String,
    type: String
}

export class ScoreComputerTester{

    private battery: Battery
    private network: Network
    private scoreComputer: ScoreComputer

    private mockedDevice: Device
    private mockedBattery: Battery
    private mockedNetwork: Network
    
    constructor(){
        this.setup()
        
        this.drawTestOne({
            title: 'Scenario One',
            domElementId: 'score-computer-test-one',
        })

        this.drawTestTwo({
            title: 'Scenario two',
            domElementId: 'score-computer-test-two'
        })
    }

    private drawTestOne(testInfo: ITest): void{
        let traces = this.buildScenarioOne()

        let layout = {
            xaxis: {
                title: 'time (min)',
                type: 'number',
            },
            yaxis: {
                title: 'score / battery',
                type: 'number',
                range: [0, 1]
            },
            title: testInfo.title
        }

        let data = [traces[0], traces[1]]
        Plotly.newPlot(testInfo.domElementId, data, layout)
    }

    drawTestTwo(testInfo: ITest){
        
        let traces = this.buildScenarioTwo()

        let layout = {
            xaxis: {
                title: 'time (min)',
                type: 'number',
            },
            yaxis: {
                title: 'score / battery',
                type: 'number',
                range: [0, 1]
            },
            title: testInfo.title
        }

        let data = [traces[0], traces[1]]
        Plotly.newPlot(testInfo.domElementId, data, layout)
    }

    private buildScenarioOne(): ITrace[]{
        let x = []
        let y = []
        let y2 = []
        let batteryLevel = 1

        when(this.mockedBattery.level).thenReturn(batteryLevel)
        when(this.mockedNetwork.type).thenReturn(ConnectionType.wifi)
        when(this.mockedNetwork.downlink).thenReturn(this.scoreComputer._downlinkLimit)
        when(this.mockedNetwork.uplink).thenReturn(this.scoreComputer._uplinkLimit)
    
        //one sample in one minute
        let sampleNum = 200
        for(let sampleCount = 0; sampleCount < sampleNum; sampleCount++){
            when(this.mockedBattery.dischargingTimeInSeconds)
                .thenReturn(this.scoreComputer._dischargingTimeLimit * batteryLevel)
            if(sampleCount <= sampleNum/2){
                when(this.mockedBattery.isCharging).thenReturn(false)
                batteryLevel -= (1 / (this.linearOLDT(sampleCount) / 60)) / 100
            }else{
                when(this.mockedBattery.isCharging).thenReturn(true)
                batteryLevel += (1 / (this.linearOLDT(sampleCount) / 60)) / 100
            }
            when(this.mockedBattery.level).thenReturn(batteryLevel)
            
            this.scoreComputer._scoreAdjuster._ctr.setSampling(this.linearOLDT(sampleCount))
            this.scoreComputer._scoreAdjuster.dataAvailable(this.linearOLDT(sampleCount))
            this.scoreComputer.compute()
            
            x.push(sampleCount)
            y.push(this.scoreComputer.ActualScore)
            y2.push(batteryLevel)
        }

        let scoreTrace: ITrace= {
            x: x,
            y: y,
            name: "score trace",
            type: "scatter"
        }

        let batteryTrace: ITrace = {
            x: x,
            y: y2,
            name: "battery trace",
            type: "scatter"
        }

        return [scoreTrace, batteryTrace]
    }

    private buildScenarioTwo(): ITrace[]{
        let x = []
        let y = []
        let y2 = []
        let batteryLevel = 1

        when(this.mockedNetwork.type).thenReturn(ConnectionType.wifi)
        when(this.mockedBattery.level).thenReturn(batteryLevel)
        when(this.mockedBattery.isCharging).thenReturn(false)

        //one sample in one minute
        let sampleNum = 40
        for(let sampleCount = 0; sampleCount < sampleNum; sampleCount++){
            when(this.mockedBattery.dischargingTimeInSeconds)
                .thenReturn(this.scoreComputer._dischargingTimeLimit * batteryLevel)
            if(sampleCount <= sampleNum/3){
                when(this.mockedNetwork.downlink).thenReturn(this.scoreComputer._downlinkLimit / 2)
                when(this.mockedNetwork.uplink).thenReturn(this.scoreComputer._uplinkLimit / 2)
                batteryLevel -= (1 / (this.linearOLDT(sampleCount) / 60)) / 100
                this.scoreComputer._scoreAdjuster._ctr.setSampling(this.linearOLDT(sampleCount))
                this.scoreComputer._scoreAdjuster.dataAvailable(this.linearOLDT(sampleCount))
            }else{
                when(this.mockedNetwork.downlink).thenReturn(this.scoreComputer._downlinkLimit)
                when(this.mockedNetwork.uplink).thenReturn(this.scoreComputer._uplinkLimit)
                batteryLevel -= (1 / (this.exponentialOLDT(sampleCount) / 60)) / 100
                this.scoreComputer._scoreAdjuster._ctr.setSampling(this.exponentialOLDT(sampleCount))
                this.scoreComputer._scoreAdjuster.dataAvailable(this.exponentialOLDT(sampleCount))
            }
            when(this.mockedBattery.level).thenReturn(batteryLevel)
            this.scoreComputer.compute()
            
            x.push(sampleCount)
            y.push(this.scoreComputer.ActualScore)
            y2.push(batteryLevel)
        }

        let scoreTrace: ITrace= {
            x: x,
            y: y,
            name: "score trace",
            type: "scatter"
        }

        let batteryTrace: ITrace = {
            x: x,
            y: y2,
            name: "battery trace",
            type: "scatter"
        }

        return [scoreTrace, batteryTrace]
    }

    linearOLDT = (val: number) : number => {
        return 60
    }

    exponentialOLDT = (val: number) : number => {
        return 8000 / Math.pow(val, 2) 
    }

    private setup(): void{
        this.mockedDevice = mock(Device)
        this.mockedBattery = mock(Battery)
        this.mockedNetwork = mock(Network)

        let mockedEvent = mock(Event)

        when(this.mockedBattery.OLDTChanged).thenReturn(instance(mockedEvent))
    
        when(this.mockedDevice.battery).thenReturn(instance(this.mockedBattery))
        when(this.mockedDevice.network).thenReturn(instance(this.mockedNetwork))

        this.scoreComputer = new ScoreComputer(instance(this.mockedDevice))
        this.scoreComputer._scoreAdjuster._ctr = new PIDController({
            k_p : 0.5,
            k_i : 0.5,
            k_d : 0.5,
            i_max : 200
        })
        let targetOneLevelDropTime = 20 // one level drain in one minute
        this.scoreComputer._scoreAdjuster._ctr.setTarget(targetOneLevelDropTime)
    }
}