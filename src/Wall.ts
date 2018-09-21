
module game {

    export class Wall extends egret.Sprite {

        public wallBodys = [];
        public airWallBodys = [];
        public upOneWall: p2.Box;
        public downOneWall: p2.Box;
        public leftWall: p2.Box;
        public downTwoWall: p2.Box;
        public rightWall: p2.Box;

        public airWall: p2.Box;
        public airWallTypes = [];

        public constructor(private world: p2.World, private config: Array<GameObjectInfo>) {
            super();
            this.createWall();
        }

        public createWall() {
            //upOneWall
            var e = new p2.Box({
                width: 800,
                height: 85
            });
            const t = new p2.Body({
                mass: 0,
                position: [400, 45]
            });
            t.addShape(e),
                t.displays = [],
                this.world.addBody(t),
                this.upOneWall = e,
                this.wallBodys.push(t);

            //downOneWall
            var a = new p2.Box({
                width: 800,
                height: 85
            });
            const s = new p2.Body({
                mass: 0,
                position: [400, 435]
            });
            s.addShape(a),
                s.displays = [],
                this.world.addBody(s),
                this.downOneWall = a,
                this.wallBodys.push(s);

            //leftWall
            var n = new p2.Box({
                width: 100,
                height: 300
            });
            const h = new p2.Body({
                mass: 0,
                position: [50, 240]
            });
            h.displays = [],
                h.addShape(n),
                this.world.addBody(h),
                this.leftWall = n,
                this.wallBodys.push(h);
            var d = new p2.Box({
                width: 100,
                height: 300
            });
            const p = new p2.Body({
                mass: 0,
                position: [750, 240]
            });
            p.displays = [],
                p.addShape(d),
                this.world.addBody(p),
                this.rightWall = d,
                this.wallBodys.push(p);

            this.updateConfig(this.config);
        }

        public updateConfig(config: Array<GameObjectInfo>) {
            this.config = config;

            this.airWallTypes.length = 0;
            this.airWallBodys.forEach(body => {
                body && this.world.removeBody(body);
            });
            this.airWallBodys.length = 0;

            this.config.forEach(airWall => {
                //airWall
                var airBox = new p2.Box({
                    width: airWall.width,
                    height: airWall.height,
                });
                const airBody = new p2.Body({
                    mass: 0,
                    position: [airWall.x, airWall.y],
                });

                airBody.addShape(airBox),
                    airBody.displays = [],
                    this.world.addBody(airBody),
                    this.airWall = airBox,
                    this.airWallBodys.push(airBody),
                    this.airWallTypes.push(airWall.type);

                if (airWall.endX && airWall.endY) {
                    let doSth = () => {
                        if (!airBody) {
                            return;
                        }
                        egret.Tween.get(airBody).to({ position: [airWall.endX, airWall.endY] }, 1000, egret.Ease.backInOut).to({
                            position: [airWall.x, airWall.y]
                        }, 1000).call(() => {
                            doSth();
                        });
                    }
                    doSth();
                }
            });
        }

    }

}