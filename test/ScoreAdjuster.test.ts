import {ScoreAdjuster} from "../model/ScoreAdjuster"
import {Device} from "../model/Device"
import {Battery} from "../model/Battery"
import {PIDController, Options} from "../model/PIDController"

declare let Plotly : any
declare function require(name:string) : any

let device: Device
let scoreAdjuster: ScoreAdjuster
let pidController: PIDController
let x: number[]
let adjusterY: number[]
let oldtY: number[]

interface ITest{
    title: String
    domElementId: String
    batteryDrainFunction: (x: number) => number
}

class ScoreAdjusterTester{
    constructor(){
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
            scoreAdjuster._ctr.setSampling(testInfo.batteryDrainFunction(i));
            scoreAdjuster.onLevelDropTimeChanged(oldtValue)
            x.push(i)
            adjusterY.push(scoreAdjuster.adjustment)
            oldtY.push(oldtValue)
        }
    
        let adjusterTrace = {
            x: x,
            y: adjusterY,
            name: 'adjuster trace',
            type: 'scatter'
        }
        
        let oldtTrace = {
            x: x,
            y: oldtY,
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
        x = []
        adjusterY = []
        oldtY = []
        scoreAdjuster._ctr.reset()
    }

    private setup(){
        device = new Device()
        device.battery = null
        scoreAdjuster = new ScoreAdjuster(device)
        scoreAdjuster._ctr = new PIDController({
            k_p : 0.5,
            k_i : 0.4,
            k_d : 0.2,
            i_max : 200
        })
        let targetOneLevelDropTime = 240 // one level drain in 4 minutes
        scoreAdjuster._ctr.setTarget(targetOneLevelDropTime)
    }
}

new ScoreAdjusterTester()