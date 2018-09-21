
module game {

    export class Balls extends egret.Sprite {
        public ballShapes = [];
        public ballBody = [];
        public ballBmps = [];
        public ballR = [];
        public maxR = [];

        public types = [];

        public hps = [];

        public constructor(private world: p2.World, private config: Array<GameObjectInfo>) {
            super();
            this.createBall();
        }

        public createBall() {
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

            this.types.length = 0;
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
                    this.ballBody.push(i),
                    this.types.push(ball.type || "enemy"),
                    this.hps.push(ball.type == "hero" ? 2 : 3);
            });
        }

    }
}