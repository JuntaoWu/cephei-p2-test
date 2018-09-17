
module game {

    export class GameBackground extends egret.Sprite {

        public constructor() {
            super();
            const i = new egret.Bitmap(RES.getRes("table_jpg"));
            this.addChild(i);
        }

    }
}

