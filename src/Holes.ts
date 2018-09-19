module game {

    export class Holes extends egret.Sprite {

        public holes = [];

        public constructor(private world: p2.World, private config: Array<GameObjectInfo>) {
            super();
            this.createHoles();
        }

        public createHoles() {
            //hole1
            // const circle1 = new p2.Circle({
            //     radius: 15
            // });
            // const body1 = new p2.Body({
            //     mass: 0,
            //     position: [99, 90]
            // });
            // body1.addShape(circle1);
            // body1.displays = [];
            // this.world.addBody(body1);
            // this.holes.push(body1);

            // //hole2
            // const circle2 = new p2.Circle({
            //     radius: 15
            // });
            // var body2 = new p2.Body({
            //     mass: 0,
            //     position: [400, 71]
            // });
            // body2.addShape(circle2);
            // body2.displays = [];
            // this.world.addBody(body2);
            // this.holes.push(body2);

            // //hole3
            // var circle3 = new p2.Circle({
            //     radius: 15
            // });
            // const body3 = new p2.Body({
            //     mass: 0,
            //     position: [700, 91]
            // });
            // body3.addShape(circle3);
            // body3.displays = [];
            // this.world.addBody(body3);
            // this.holes.push(body3);

            // //hole4
            // var circle4 = new p2.Circle({
            //     radius: 15
            // });
            // const body4 = new p2.Body({
            //     mass: 0,
            //     position: [100, 391]
            // });
            // body4.addShape(circle4);
            // body4.displays = [];
            // this.world.addBody(body4);
            // this.holes.push(body4);
            // var circle5 = new p2.Circle({
            //     radius: 15
            // });

            // //hole5
            // const body5 = new p2.Body({
            //     mass: 0,
            //     position: [400, 410]
            // });
            // body5.addShape(circle5);
            // body5.displays = [];
            // this.world.addBody(body5);
            // this.holes.push(body5);

            //hole6

            this.updateConfig(this.config);
        }

        public updateConfig(config: Array<GameObjectInfo>) {
            this.config = config;
            this.holes.forEach(body => {
                this.world.removeBody(body);
            });
            this.holes.length = 0;

            this.config.forEach(hole => {
                var circle6 = new p2.Circle({
                    radius: hole.width / 2
                });
                var body6 = new p2.Body({
                    mass: 0,
                    position: [hole.x, hole.y]
                });
                body6.addShape(circle6);
                body6.displays = [];
                this.world.addBody(body6);
                this.holes.push(body6);
            });
        }
    }

}