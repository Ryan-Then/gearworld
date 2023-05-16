// Class responsible for dynamically assigning parent-child relationship for child pieces (accessories) stuck onto parent pieces (snowballs)

class StickyItemActor {
    /*
    movement behavior for accessories. the obect with always be attached to another object and 
    will always face perpendicular to the surface it is attached to. usful for object that need to be 
    placed radially outward.
    */
    setup() {
        this.listen("dragStart", "dragStart");
        this.listen("dragEnd", "dragEnd");
        this.listen("dragMove", "dragMove");
    }

    dragStart({viewId}) {
        if (!this.occupier) {// see SingleUser behavior
            this.say("focus", viewId);  // grab single user focus
            this.unstick();
        }
    }

    dragMove({viewId, translation, rotation}) {
        if (viewId === this.occupier) { // see SingleUser behavior
            if (translation) this.translateTo(translation);
            //if (rotation) this.rotateTo(rotation);
            this.say("focus", viewId);  // refresh single user focus
        }
    }

    dragEnd({viewId, parent}) {
        if (viewId === this.occupier) { // see SingleUser behavior
            this.stickTo(parent);
            this.say("unfocus", viewId); // release single user focus
        }
    }

    // remove from current parent into world-space
    unstick() {
        if (!this.parent) {return;}
        // use our global transform as our own translation and rotation
        let {m4_getTranslation, m4_getRotation} = Microverse;
        let translation = m4_getTranslation(this.global);
        let rotation = m4_getRotation(this.global);
        this.set({parent: null});
    }

    // stick to a parent preserving our world-space translation and rotation
    stickTo(parent) {
        if (!parent || this.parent|| this.isMeOrMyChild(parent)) {return;}
        // make our rotation and translation relative to the new parent
        let {m4_invert, m4_multiply, m4_getTranslation, m4_getRotation} = Microverse;
        let relativeToParent = m4_multiply(this.global, m4_invert(parent.global));
        let translation = m4_getTranslation(relativeToParent);
        let rotation = m4_getRotation(relativeToParent);
        this.set({parent});
    }

    isMeOrMyChild(actor) {
        while (actor) {
            // compare IDs because actor may be a behavior proxy
            if (actor.id === this.id) {return true;}
            actor = actor.parent;
        }
        return false;
    }
}

class StickyItemPawn {
    setup() {
        this.addEventListener("pointerMove", "pointerMove");
        this.addEventListener("pointerDown", "pointerDown");
        this.addEventListener("pointerUp", "pointerUp");
    }

    dragging() {
        return this.actor.occupier === this.viewId; // see SingleUser behavior
    }

    pointerMove(evt) {
        if (!this.dragging()) {return;}

        // do a raycast to find objects behind this one
        let render = this.service("ThreeRenderManager");
        let objects = render.threeLayerUnion("pointer", "walk");
        let avatar = this.getMyAvatar();
        avatar.setRayCast(evt.xy);
        let hits = avatar.raycaster.intersectObjects(objects);

        // hits are sorted by distance, so we find the first hit that is not us or our child
        let renderObject = (obj) => {
            while (obj && !obj.wcPawn) obj = obj.parent;
            return obj;
        }
        let isMeOrMyChild = (obj) => {
            let actor = renderObject(obj)?.wcPawn.actor;
            return this.actorCall("StickyItemActor", "isMeOrMyChild", actor);
        }
        let hit = hits.find(h => !isMeOrMyChild(h.object));

        // if we hit something, move to the hit point, and rotate according to the hit normal
        let normal = hit?.face?.normal?.toArray();
        if (normal) {
            let {q_lookAt} = Microverse;
            let rotation = q_lookAt([0, 1, 0], [0, 0, 1], normal);
            let translation = hit.point.toArray();
            this.say("dragMove", {viewId: this.viewId, translation, rotation});

            // remember distance
            this.dragInfo.distance = hit.distance;

            // we reparent on pointerUp
            let other = renderObject(hit.object).wcPawn;
            this.dragInfo.parent = other.actor;

            return;
        }

        // no hit, so move along at distance along ray
        let {THREE} = Microverse;
        let translation = avatar.raycaster.ray.at(this.dragInfo.distance, new THREE.Vector3()).toArray();
        this.say("dragMove", {viewId: this.viewId, translation});
    }

    pointerDown(evt) {
        if (!evt.xyz) {return;}
        if (this.dragInfo) {return;}

        let avatar = this.getMyAvatar();

        this.dragInfo = {distance: evt.distance, parent: this.actor.parent};
        if (avatar) {
            avatar.addFirstResponder("pointerMove", {}, this);
        }
        // remove from parent (if any)
        this.say("dragStart", {viewId: this.viewId});
    }

    pointerUp(_evt) {
        if (!this.dragInfo) {return;}

        let avatar = this.getMyAvatar();
        if (avatar) {
            avatar.removeFirstResponder("pointerMove", {}, this);
        }

        // attach to the object I was dragged on
        this.say("dragEnd", {viewId: this.viewId, parent: this.dragInfo.parent});

        this.dragInfo = null;
    }
}

export default {
    modules: [

        {
            name: "StickyItem",
            actorBehaviors: [StickyItemActor],
            pawnBehaviors: [StickyItemPawn],
        }


    ]
}