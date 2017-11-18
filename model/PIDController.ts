
export interface Options{
    k_p: number
    k_d: number
    k_i: number
    dt?: number
    i_max?: number
}

export class PIDController{

    private k_p: number;
    private k_d: number;
    private k_i: number;
    private dt?: number;
    private i_max?: number;

    private sumError: number;
    private lastError: number;
    private lastTime: number;

    private currentValue: number;
    private target: number;

    constructor(options: Options){
        this.k_d = options.k_d;
        this.k_i = options.k_i;
        this.k_p = options.k_p;

        if(options.dt){
            this.dt = options.dt;
        }
        if(options.i_max){
            this.i_max = options.i_max;
        }

        // Interval of time between two updates
        // If not set, it will be automatically calculated
        this.dt = this.dt || 0;
    
        // Maximum absolute value of sumError
        this.i_max = this.i_max || 0;
    
        this.sumError = 0;
        this.lastError = 0;
        this.lastTime = 0;
    
        this.target = 0; // default value, can be modified with .setTarget
    }

    public setTarget(target: number) {
        this.target = target;
    }
    
    public update(currentValue: number) {
       this.currentValue = currentValue;
    
        if (!this.dt) {
          let currentTime = Date.now();
          if (this.lastTime === 0) { // First time update() is called
            this.dt = 0;
          } else {
            this.dt = (currentTime - this.lastTime) / 1000; // in seconds
          }
          this.lastTime = currentTime;
        }
    
        let error = (this.target - this.currentValue);
        this.sumError = this.sumError + error * this.dt;
        if (this.i_max > 0 && Math.abs(this.sumError) > this.i_max) {
          let sumSign = (this.sumError > 0) ? 1 : -1;
          this.sumError = sumSign * this.i_max;
        }
    
        let dError = (error - this.lastError) / this.dt;
        this.lastError = error;
    
        return (this.k_p * error) + (this.k_i * this.sumError) + (this.k_d * dError);
    }

    public setSampling(sampling: number){
        this.dt = sampling
    }
    
    public reset() {
        this.sumError = 0;
        this.lastError = 0;
        this.lastTime = 0;
    }
}