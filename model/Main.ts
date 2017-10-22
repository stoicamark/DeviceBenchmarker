import {DeviceBenchmarker, weights} from './DeviceBenchmarker';
declare function require(name:string) : any;
let temporal = require("temporal");

(()=>{
    let benchmarker = new DeviceBenchmarker();
    benchmarker.start();
})();