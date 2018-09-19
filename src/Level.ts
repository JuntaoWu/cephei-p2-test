
module game {
    export class Level {
        public level: number;
        public balls: Array<GameObjectInfo>;
        public walls: Array<GameObjectInfo>;
        public cueBalls: Array<GameObjectInfo>;
        public holes: Array<GameObjectInfo>;
    }

    export class GameObjectInfo {
        public width: number;
        public height: number;
        public x: number;
        public y: number;
    }
}