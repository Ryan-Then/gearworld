// SimpleSpin
// Copyright 2022 Croquet Corporation
// Croquet Microverse
// Simple start/stop spinner


class SpinningActor {
    setup() {
        this.spinning = false; // start without spinning
        this.angle = 0; // the initial angle
        this.spinSpeed = 0.05; // how fast will we spin (in radians)
        this.addEventListener("pointerDown", "toggle");
    }

    step() {
        if (!this.spinning) {return;}
        this.future(20).step();
        this.angle+=this.spinSpeed;
        this.set({rotation: Microverse.q_euler(0, 0, this.angle)}); // arguments are (x, y, z), set any given axis to "this.angle" to configure spin axis
    }

    toggle() {
        this.spinning = !this.spinning;
        if (this.spinning) this.step();
    }

    teardown() {
        this.removeEventListener("pointerDown", "toggle");
        delete this.spinning;
    }
}

export default {
    modules: [
        {
            name: "gearSpin",
            actorBehaviors: [SpinningActor],
        }
    ]
}
