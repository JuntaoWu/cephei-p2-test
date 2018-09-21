

module game {
    export class DirectionHelper {

		/**
		 * 获取某一方向的偏移位置
		 * @param direction 0: 上, 1: 右, 2:下, 3: 左
		 */
		public static getVector(direction: number): any {
			if (direction == 0) { return { "x": 0, "y": -1 }; }
			else if (direction == 1) { return { "x": 1, "y": 0 }; }
			else if (direction == 2) { return { "x": 0, "y": 1 }; }
			else if (direction == 3) { return { "x": -1, "y": 0 }; }
			else { return null; }
		}
    }
}