
module game {
    
    export class Balls extends egret.Sprite {
        public ballShapes = [];
        public ballBody = [];
        public ballBmps = [];
        public ballR = [];
        public maxR = [];

        public constructor(private world: p2.World) {
            super();
            this.createBall();
        }

        public createBall() {
            for (var e = 0; 4 > e; e++) {
                var t = new p2.Circle({
                    radius: 10
                })
                    , i = new p2.Body({
                        mass: 1,
                        position: [200, 220 + 20 * e]
                    });
                i.addShape(t),
                    this.world.addBody(i);
                var o = new egret.Bitmap(RES.getRes("redBall_png"));
                o.width = o.height = 20,
                    o.anchorOffsetX = 10,
                    o.anchorOffsetY = 10,
                    o.x = i.position[0],
                    o.y = i.position[1],
                    this.addChild(o),
                    i.displays = [o],
                    this.ballBmps.push(o),
                    this.ballShapes.push(t),
                    this.ballBody.push(i)
            }
            for (var a = 0; 3 > a; a++) {
                var t = new p2.Circle({
                    radius: 10
                })
                    , i = new p2.Body({
                        mass: 1,
                        position: [220, 230 + 20 * a]
                    });
                i.addShape(t),
                    this.world.addBody(i);
                var o = new egret.Bitmap(RES.getRes("redBall_png"));
                o.width = o.height = 20,
                    o.anchorOffsetX = 10,
                    o.anchorOffsetY = 10,
                    o.x = i.position[0],
                    o.y = i.position[1],
                    this.addChild(o),
                    i.displays = [o],
                    this.ballBmps.push(o),
                    this.ballShapes.push(t),
                    this.ballBody.push(i)
            }
            for (var s = 0; 2 > s; s++) {
                var t = new p2.Circle({
                    radius: 10
                })
                    , i = new p2.Body({
                        mass: 1,
                        position: [240, 240 + 20 * s]
                    });
                i.addShape(t),
                    this.world.addBody(i);
                var o = new egret.Bitmap(RES.getRes("redBall_png"));
                o.width = o.height = 20,
                    o.anchorOffsetX = 10,
                    o.anchorOffsetY = 10,
                    o.x = i.position[0],
                    o.y = i.position[1],
                    this.addChild(o),
                    i.displays = [o],
                    this.ballBmps.push(o),
                    this.ballShapes.push(t),
                    this.ballBody.push(i)
            }
            var t = new p2.Circle({
                radius: 10
            })
                , i = new p2.Body({
                    mass: 1,
                    position: [260, 250]
                });
            i.addShape(t),
                this.world.addBody(i);
            var o = new egret.Bitmap(RES.getRes("redBall_png"));
            o.width = o.height = 20,
                o.anchorOffsetX = 10,
                o.anchorOffsetY = 10,
                o.x = i.position[0],
                o.y = i.position[1],
                this.addChild(o),
                i.displays = [o],
                this.ballBmps.push(o),
                this.ballShapes.push(t),
                this.ballBody.push(i)
        }

        public removeBallBmp = function (e) {
            this.removeChild(this.ballBmps[e])
        }

    }
}