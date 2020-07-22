export class Timeline {
    constructor () {
        this.animations = [];
        this.tick = this.tick.bind(this);
        this.timer = null;
        this.state = "inited"
    }

    tick () {
        let t = Date.now() - this.startTime;
        console.log(t);
        let animations = this.animations.filter(animation => !animation.finished);
        for (let animation of this.animations) {
            let {object, property, duration,  template, start, end, startTime,timingFunction, delay} = animation;
            let progress = timingFunction((t - delay - startTime) / duration)

            if (t > animation.duration + animation.delay) {
                animation.finished = true;
                progress = 1;
                // continue;
            }
            let value = animation.valueFromProgression(progress);
            object[property] = template(value);
        }
        if (animations.length) {
            this.timer = requestAnimationFrame(this.tick);
        }
    }

    add (animation, startTime) {
        this.animations.push(animation);
        animation.finished = false;
        if (this.state === "playing") {
            animation.startTime = startTime !== void 0 ? startTime : Date.now() - this.startTime;
        } else {
            animation.startTime = startTime !== void 0 ? startTime : 0;
        }
        
    }

    pause() {
        if (this.state !== "playing") {
            return;
        }
        this.state = "paused";
        this.pauseTime = Date.now();
        if (this.timer !== null) {
            cancelAnimationFrame(this.timer);
        }
    }

    resume() {
        if (this.state !== "paused") {
            return;
        }
        this.state = "playing";
        this.startTime = this.startTime + Date.now() - this.pauseTime;
        this.tick();
    }

    start () {
        if (this.state !== "inited") {
            return;
        }
        this.state = "playing";
        this.startTime = Date.now();
        this.tick();
    }

    restart () {
        if (this.state !== 'inited') {
            this.pause();
        }
        this.animations = [];
        this.timer = null;
        this.state = "playing";
        this.startTime = Date.now();
        this.pauseTime = null;
        this.tick();
    }
}

export class Animation {
    constructor (object, property, template, start, end, duration, delay, timingFunction) {
        this.object = object;
        this.property = property;
        this.template = template;
        this.start = start;
        this.startTime = 0;
        this.end = end;
        this.duration = duration;
        this.delay = delay;
        this.finished = false;
        this.timingFunction = timingFunction || ((start, end) => {
            return (t) => start + (t / duration) * (end - start)
            
        });
    }

    valueFromProgression (progression) {
        console.log(progression);
        return this.start + progression * (this.end - this.start);
    }
}


/**
 * let animation = new Animation (object, property, start, end, duration, timingFunction);
 * 
 * animation.start()
 * 
 * animation.stop()
 * 
 * animation.pause()
 */