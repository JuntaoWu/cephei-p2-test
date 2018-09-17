
module game {

    export class Wall extends egret.Sprite {

        public wallBodys = [];
        public upOneWall: p2.Box;
        public upTwoWall: p2.Box;
        public downOneWall: p2.Box;
        public leftWall: p2.Box;
        public downTwoWall: p2.Box;
        public rightWall: p2.Box;

        public constructor(private world: p2.World) {
            super();
            this.createWall();
        }

        public createWall() {
            var e = new p2.Box({
                width: 248,
                height: 90
            });
            const t = new p2.Body({
                mass: 0,
                position: [250, 45]
            });
            t.addShape(e),
                t.displays = [],
                this.world.addBody(t),
                this.upOneWall = e,
                this.wallBodys.push(t);

            var i = new p2.Box({
                width: 248,
                height: 90
            });
            const o = new p2.Body({
                mass: 0,
                position: [549, 45]
            });
            o.addShape(i),
                o.displays = [],
                this.world.addBody(o),
                this.upTwoWall = i,
                this.wallBodys.push(o);
            var a = new p2.Box({
                width: 248,
                height: 90
            });
            const s = new p2.Body({
                mass: 0,
                position: [250, 435]
            });
            s.addShape(a),
                s.displays = [],
                this.world.addBody(s),
                this.downOneWall = a,
                this.wallBodys.push(s);

            var l = new p2.Box({
                width: 248,
                height: 90
            });
            const r = new p2.Body({
                mass: 0,
                position: [549, 435]
            });
            r.addShape(l),
                r.displays = [],
                this.world.addBody(r),
                this.downTwoWall = l,
                this.wallBodys.push(r);
            var n = new p2.Box({
                width: 100,
                height: 250
            });
            const h = new p2.Body({
                mass: 0,
                position: [50, 241]
            });
            h.displays = [],
                h.addShape(n),
                this.world.addBody(h),
                this.leftWall = n,
                this.wallBodys.push(h);
            var d = new p2.Box({
                width: 100,
                height: 250
            });
            const p = new p2.Body({
                mass: 0,
                position: [750, 241]
            });
            p.displays = [],
                p.addShape(d),
                this.world.addBody(p),
                this.rightWall = d,
                this.wallBodys.push(p);
        }

    }

}