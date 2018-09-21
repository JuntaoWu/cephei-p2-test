
module game {

    export class Cue extends egret.Sprite {

        public cueGroup: eui.Group;
        public cueBmp: egret.Bitmap;
        public radarBmp: egret.Bitmap;
        public cueBody: p2.Body;

        public constructor(x, y, private world: p2.World) {
            super();
            this.createCue(x, y);
        }

        createCue(x, y) {
            this.cueGroup = new eui.Group();
            this.cueGroup.x = x;
            this.cueGroup.y = y;
            this.cueGroup.width = 50;
            this.cueGroup.height = 50;

            this.radarBmp = new egret.Bitmap(RES.getRes("radar_png")),
                this.radarBmp.anchorOffsetX = 100,
                this.radarBmp.anchorOffsetY = 100,
                this.radarBmp.width = 200,
                this.radarBmp.height = 200,
                this.radarBmp.rotation = -90;
            this.cueGroup.addChild(this.radarBmp);

            this.cueBmp = new egret.Bitmap(RES.getRes("cue_png")),
                this.cueBmp.anchorOffsetX = 25,
                this.cueBmp.anchorOffsetY = 25,
                this.cueBmp.width = 50,
                this.cueBmp.height = 50,
                this.cueBmp.rotation = -90;
            this.cueGroup.addChild(this.cueBmp);

            this.addChild(this.cueGroup);

            var e = new p2.Circle({
                radius: 100
            });
            var t = new p2.Body({
                mass: 0,
                position: [x, y]
            });

            e.collisionGroup = 0;
            e.collisionMask = 0;
            t.addShape(e);
            t.fixedRotation = true;
            this.world.addBody(t);

            t.displays = [this.cueGroup];

            this.cueBody = t;
        }
    }
}