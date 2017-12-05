import {ScoreAdjuster} from "../model/ScoreAdjuster"
import {Device} from "../model/Device"
import {Battery} from "../model/Battery"
import {PIDController, Options} from "../model/PIDController"
import {Event} from "../model/Event"
import {mock, instance, when} from "../node_modules/ts-mockito"

declare let Plotly : any
declare function require(name:string) : any

interface ITest{
    title: String
    domElementId: String
    batteryDrainFunction: (x: number) => number
}

export class ScoreAdjusterTester{

    private device: Device
    private scoreAdjuster: ScoreAdjuster
    private pidController: PIDController
    private x: number[]
    private adjusterY: number[]
    private oldtY: number[]

    constructor(){
        console.log("helloo")
        this.setup()
       
        this.drawTest({
            title: 'Linear battery drain scenario',
            domElementId: 'score-adjuster-test-linear',
            batteryDrainFunction: this.linearOLDT
        })

        this.drawTest({
            title: 'Exponential battery drain scenario',
            domElementId: 'score-adjuster-test-exponential',
            batteryDrainFunction: this.exponentialOLDT
        })

        this.drawTest({
            title: 'Periodic battery drain scenario',
            domElementId: 'score-adjuster-test-periodic',
            batteryDrainFunction: this.periodicOLDT
        })

        this.drawTest({
            title: 'Randromised battery drain scenario',
            domElementId: 'score-adjuster-test-random',
            batteryDrainFunction: this.randomOLDT
        })
         
    }

    linearOLDT = (val: number) : number => {
        return 300
    }

    exponentialOLDT = (val: number) : number => {
        let constant = 20
        return Math.pow(constant, 2) - Math.pow(val, 2)
    }

    periodicOLDT = (val: number) : number => {
        return 350 * Math.abs(Math.sin(val/4))
    }

    randomOLDT = (val: number) : number => {
        return 350 * Math.random()
    }

    drawTest(testInfo: ITest){
        this.beforeEach()
    
        for(let i = 0; i < 20; ++i){
            let oldtValue = testInfo.batteryDrainFunction(i)
            this.scoreAdjuster._ctr.setSampling(oldtValue);
            this.scoreAdjuster.dataAvailable(oldtValue)
            this.x.push(i)
            this.adjusterY.push(this.scoreAdjuster.adjustment)
            this.oldtY.push(oldtValue)
        }
    
        let adjusterTrace = {
            x: this.x,
            y: this.adjusterY,
            name: 'adjuster trace',
            type: 'scatter'
        }
        
        let oldtTrace = {
            x: this.x,
            y: this.oldtY,
            xaxis: 'x2',
            yaxis: 'y2',
            name: 'OLDT trace',
            type: 'scatter'
        }


        let layout = {
            xaxis: {
                title: 'sample',
                type: 'number',
            },
            yaxis: {
                title: 'adjustment',
                type: 'number',
                range: [-1.1, 1.1],
                domain: [0, 0.45],
            }, 

            xaxis2: {
                anchor: 'y2',
                type: 'number'
            },

            yaxis2: {
                title: 'One Level Drop Time',
                type: 'number',
                domain: [0.55, 1]
            },
        

            title: testInfo.title
        }

        let data = [adjusterTrace, oldtTrace]
        
        Plotly.newPlot(testInfo.domElementId, data, layout)
    }

    private beforeEach(){
        this.x = []
        this.adjusterY = []
        this.oldtY = []
        this.scoreAdjuster._ctr.reset()
    }

    private setup(){
        this.device = new Device()
        let mockedBattery = mock(Battery)
        let mockedEvent = mock(Event)

        when(mockedBattery.OLDTChanged).thenReturn(instance(mockedEvent))
        this.device.battery = instance(mockedBattery)
        this.scoreAdjuster = new ScoreAdjuster(this.device)

        this.scoreAdjuster._ctr = new PIDController({
            k_p : 0.4,
            k_i : 0.3,
            k_d : 0.1,
            i_max : 300
        })
        let targetOneLevelDropTime = 240 // one level drain in 4 minutes
        this.scoreAdjuster._ctr.setTarget(targetOneLevelDropTime)
    }
}