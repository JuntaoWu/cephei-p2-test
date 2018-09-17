
module game {

    export class CueBall extends egret.Sprite {

        private cueBallShape: p2.Circle;
        private cueBallBody: p2.Body;
        private cueBallBmp: egret.Bitmap;

        public constructor(private world: p2.World) {
            super();
            this.createCueBall();
        }

        public createCueBall() {
            var e = new p2.Circle({
                radius: 10
            })
                , t = new p2.Body({
                    mass: 1,
                    position: [600, 250]
                });
            t.addShape(e),
                t.fixedRotation = !0,
                this.world.addBody(t),
                this.cueBallShape = e;
            var i = new egret.Bitmap(RES.getRes("cueBall_png"));
            i.width = i.height = 20,
                i.anchorOffsetX = i.anchorOffsetY = 10,
                this.addChild(i),
                t.displays = [i],
                this.cueBallBody = t,
                this.cueBallBmp = i
        }

        public cueBallRemoveBmp = function () {
            null != this.cueBallBmp && this.removeChild(this.cueBallBmp)
        }

    }

    export enum CueBallState {
        CUEBALLMOVE,
        CUEBALLSTOP,
        CUEBALLVISIBLE,
        CUEBALLOUT,
    };

    export enum CueState {
        CUEON,
        CUEOFF
    }

}