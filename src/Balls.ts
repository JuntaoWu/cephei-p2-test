
module game {

    export class Balls extends egret.Sprite {
        public ballShapes = [];
        public ballBody = [];
        public ballBmps = [];
        public ballR = [];
        public maxR = [];

        public constructor(private world: p2.World, private config: Array<GameObjectInfo>) {
            super();
            this.createBall();
        }

        public createBall() {
            // for (var e = 0; 4 > e; e++) {
            //     var t = new p2.Circle({
            //         radius: 10
            //     })
            //         , i = new p2.Body({
            //             mass: 1,
            //             position: [200, 220 + 20 * e]
            //         });
            //     i.addShape(t),
            //         this.world.addBody(i);
            //     var o = new egret.Bitmap(RES.getRes("redBall_png"));
            //     o.width = o.height = 20,
            //         o.anchorOffsetX = 10,
            //         o.anchorOffsetY = 10,
            //         o.x = i.position[0],
            //         o.y = i.position[1],
            //         this.addChild(o),
            //         i.displays = [o],
            //         this.ballBmps.push(o),
            //         this.ballShapes.push(t),
            //         this.ballBody.push(i)
            // }
            // for (var a = 0; 3 > a; a++) {
            //     var t = new p2.Circle({
            //         radius: 10
            //     })
            //         , i = new p2.Body({
            //             mass: 1,
            //             position: [220, 230 + 20 * a]
            //         });
            //     i.addShape(t),
            //         this.world.addBody(i);
            //     var o = new egret.Bitmap(RES.getRes("redBall_png"));
            //     o.width = o.height = 20,
            //         o.anchorOffsetX = 10,
            //         o.anchorOffsetY = 10,
            //         o.x = i.position[0],
            //         o.y = i.position[1],
            //         this.addChild(o),
            //         i.displays = [o],
            //         this.ballBmps.push(o),
            //         this.ballShapes.push(t),
            //         this.ballBody.push(i)
            // }
            // for (var s = 0; 2 > s; s++) {
            //     var t = new p2.Circle({
            //         radius: 10
            //     })
            //         , i = new p2.Body({
            //             mass: 1,
            //             position: [240, 240 + 20 * s]
            //         });
            //     i.addShape(t),
            //         this.world.addBody(i);
            //     var o = new egret.Bitmap(RES.getRes("redBall_png"));
            //     o.width = o.height = 20,
            //         o.anchorOffsetX = 10,
            //         o.anchorOffsetY = 10,
            //         o.x = i.position[0],
            //         o.y = i.position[1],
            //         this.addChild(o),
            //         i.displays = [o],
            //         this.ballBmps.push(o),
            //         this.ballShapes.push(t),
            //         this.ballBody.push(i)
            // }
            this.updateConfig(this.config);
        }

        public removeBallBmp = function (e) {
            if(this.ballBmps[e]) {
                this.removeChild(this.ballBmps[e]);
                this.ballBmps[e] = undefined;
            }
        }

        public updateConfig(config: Array<GameObjectInfo>) {
            this.config = config;

            this.ballBody.forEach(body => {
                body && this.world.removeBody(body);
            });
            this.ballBody.length = 0;
            this.ballShapes.length = 0;
            this.ballBmps.forEach((ballBmp, index) => {
                this.removeBallBmp(index);
            });
            this.ballBmps.length = 0;

            this.config.forEach(ball => {
                var t = new p2.Circle({
                    radius: ball.width / 2
                })
                    , i = new p2.Body({
                        mass: 1,
                        position: [ball.x, ball.y]
                    });
                i.addShape(t),
                    this.world.addBody(i);
                var o = new egret.Bitmap(RES.getRes("redBall_png"));
                o.width = o.height = ball.width,
                    o.anchorOffsetX = ball.width / 2,
                    o.anchorOffsetY = ball.height / 2,
                    o.rotation = -90,
                    this.addChild(o),
                    i.displays = [o],
                    this.ballBmps.push(o),
                    this.ballShapes.push(t),
                    this.ballBody.push(i)
            });
        }

    }
}