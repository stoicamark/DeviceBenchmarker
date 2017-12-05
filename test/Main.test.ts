import { ScoreAdjusterTester } from "./ScoreAdjuster.test";
import { ScoreComputerTester } from "./ScoreComputer.test";

export class MainTest{
    constructor(){
        new ScoreAdjusterTester()
        new ScoreComputerTester()
    }
}

new MainTest()