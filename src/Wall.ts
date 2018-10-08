
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

        public constructor(private world: p2.World, private config: Array<GameObjectInfo> = []) {
            super();
            this.createWall();
        }

        public createWall() {
            //upOneWall
            var e = new p2.Box({
                width: 720,
                height: 60
            });
            const t = new p2.Body({
                mass: 0,
                position: [360, 30 + 180]
            });
            t.addShape(e),
                t.displays = [],
                this.world.addBody(t),
                this.upOneWall = e,
                this.wallBodys.push(t);

            //downOneWall
            var a = new p2.Box({
                width: 720,
                height: 60
            });
            const s = new p2.Body({
                mass: 0,
                position: [360, 1100 + 150]
            });
            s.addShape(a),
                s.displays = [],
                this.world.addBody(s),
                this.downOneWall = a,
                this.wallBodys.push(s);

            //leftWall
            var n = new p2.Box({
                width: 40,
                height: 1100
            });
            const h = new p2.Body({
                mass: 0,
                position: [20, 1100 / 2 + 180]
            });
            h.displays = [],
                h.addShape(n),
                this.world.addBody(h),
                this.leftWall = n,
                this.wallBodys.push(h);
            var d = new p2.Box({
                width: 40,
                height: 1100,
            });
            const p = new p2.Body({
                mass: 0,
                position: [700, 1100 / 2 + 180]
            });
            p.displays = [],
                p.addShape(d),
                this.world.addBody(p),
                this.rightWall = d,
                this.wallBodys.push(p);

            this.updateConfig(this.config);
        }

        public updateConfig(config: Array<GameObjectInfo> = []) {
            this.config = config;

            this.airWallTypes.length = 0;
            this.airWallBodys.forEach(body => {
                body && this.world.removeBody(body);
            });
            this.airWallBodys.length = 0;

            this.config.forEach(airWall => {
                airWall.width = parseFloat(airWall.width as string) * 100;
                airWall.height = parseFloat(airWall.height as string) * 100;
                airWall.x = parseFloat(airWall.x as string) * 100;
                airWall.y = 1100 - parseFloat(airWall.y as string) * 100 + 180;

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

                        // var a = new Array();
                        // p2.vec2.subtract(a, airBody.position, [airWall.endX, airWall.endY]);
                        // airBody.applyImpulse(a, airBody.position);

                        let originalPositionX = airBody.position[0];
                        let originalPositionY = airBody.position[1];

                        this.world.on("postStep", () => {
                            // Kinematic bodies are controlled via velocity.
                            airBody.position[0] = originalPositionX + (airWall.endX - airWall.x) * Math.sin(2 / 10 * this.world.time);
                            airBody.position[1] = originalPositionY + (airWall.endY - airWall.y) * Math.sin(2 / 10 * this.world.time);
                        });

                        // egret.Tween.get(airBody).to({ position: [airWall.endX, airWall.endY] }, 1000, egret.Ease.backInOut).to({
                        //     position: [airWall.x, airWall.y]
                        // }, 1000).call(() => {
                        //     doSth();
                        // });
                    }
                    doSth();
                }
            });
        }

    }

}