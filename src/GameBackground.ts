
module game {

    export class GameBackground extends egret.Sprite {

        public groupPhysic: eui.Group;

        public constructor() {
            super();
            //this.skinName = "skins.GameBackgroundSkin";
            const i = new egret.Bitmap(RES.getRes("table_jpg"));
            this.addChild(i);
        }

    }
}

