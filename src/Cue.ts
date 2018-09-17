
module game {

    export class Cue extends egret.Sprite {

        public cueBmp: egret.Bitmap;

        public constructor(t, i) {
            super();
            this.createCue(t, i);
        }

        createCue(t, e) {
            this.cueBmp = new egret.Bitmap(RES.getRes("cue_png")),
                this.cueBmp.anchorOffsetX = 0,
                this.cueBmp.anchorOffsetY = 16.5,
                this.cueBmp.x = e,
                this.cueBmp.y = t,
                this.cueBmp.rotation = Math.PI * Math.random() * 360,
                this.addChild(this.cueBmp);
        }
    }
}