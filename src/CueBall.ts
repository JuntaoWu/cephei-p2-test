
module game {

    export class CueBall extends egret.Sprite {

        public cueBallShape: p2.Circle;
        public cueBallBody: p2.Body;
        private cueBallBmp: egret.Bitmap;

        public constructor(private world: p2.World, private config: Array<GameObjectInfo>) {
            super();
            this.createCueBall();
        }

        public createCueBall() {
            this.updateConfig(this.config);
        }

        public cueBallRemoveBmp = function () {
            if (this.cueBallBmp) {
                this.removeChild(this.cueBallBmp);
                this.cueBallBmp = undefined;
            }
        }

        public updateConfig(config: Array<GameObjectInfo>) {
            this.config = config;

            this.cueBallBody && this.world.removeBody(this.cueBallBody);
            this.cueBallBody = undefined;
            this.cueBallShape = undefined;
            this.cueBallRemoveBmp();

            this.config.forEach(gameObjectInfo => {
                var e = new p2.Circle({
                    radius: gameObjectInfo.width / 2
                });
                var t = new p2.Body({
                    mass: 1,
                    position: [gameObjectInfo.x, gameObjectInfo.y]
                });
                t.addShape(e),
                    this.world.addBody(t),
                    this.cueBallShape = e;
                var i = new egret.Bitmap(RES.getRes("cueBall_png"));
                i.width = gameObjectInfo.width,
                    i.height = gameObjectInfo.height,
                    i.anchorOffsetX = i.anchorOffsetY = 25,
                    i.rotation = -90,
                    this.addChild(i),
                    t.displays = [i],
                    this.cueBallBody = t,
                    this.cueBallBmp = i
            });
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