
module game {
    export class Level {
        public level: number;
        public balls: Array<GameObjectInfo>;
        public walls: Array<GameObjectInfo>;
        public cueBalls: Array<GameObjectInfo>;
        public holes: Array<GameObjectInfo>;
    }

    export class GameObjectInfo {
        public width: any;
        public height: any;
        public x: any;
        public y: any;
        public type: string;
        public endX?: any;
        public endY?: any;
        public angle?: any;
    }
}