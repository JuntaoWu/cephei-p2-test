
module game {

    export class Cue extends egret.Sprite {

        public cueBmp: egret.Bitmap;

        public constructor(t, i) {
            super();
            this.createCue(t, i);
        }

        createCue(t, e) {
            this.cueBmp = new egret.Bitmap(RES.getRes("cue_png")),
                this.cueBmp.anchorOffsetX = 25,
                this.cueBmp.anchorOffsetY = 25,
                this.cueBmp.x = e,
                this.cueBmp.y = t,
                this.cueBmp.width = 50,
                this.cueBmp.height = 50,
                this.cueBmp.rotation = -90,
                this.addChild(this.cueBmp);
        }
    }
}