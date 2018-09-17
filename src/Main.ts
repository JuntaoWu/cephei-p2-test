//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
class Main extends egret.DisplayObjectContainer {

    private stageW: number;
    private stageH: number;
    private debugDraw: p2DebugDraw;
    private world: p2.World;

    private _gameBg: game.GameBackground;
    private _wall: game.Wall;
    private _holes: game.Holes;
    private _cueBall: game.CueBall;
    private _ball: game.Balls;

    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    private onAddToStage(): void {
        this.addEventListener(egret.Event.ENTER_FRAME, this.loop, this);
        //鼠标点击添加刚体
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.addOneBox, this);

        this.createWorld();
        // this.createWalls();
        // //this.createGround();
        // this.createBodies();
        this.createGameScene();
        this.createDebug();
    }

    private createGameScene() {
        this.touchEnabled = !0,
            this.stageW = egret.MainContext.instance.stage.stageWidth,
            this.stageH = egret.MainContext.instance.stage.stageHeight,
            this.createWorld(),
            this.createDebug(),
            this.addChild(this._gameBg = new game.GameBackground()),
            this.addChild(this._wall = new game.Wall(this.world)),
            this.addChild(this._holes = new game.Holes(this.world)),
            this.addChild(this._cueBall = new game.CueBall(this.world)),
            this.addChild(this._ball = new game.Balls(this.world)),
            this.createMaterial(),
            this.hitListener(),
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchEvent, this),
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEvent, this),
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEvent, this);
    }

    private createWorld(): void {
        var wrd: p2.World = new p2.World();
        wrd.sleepMode = p2.World.BODY_SLEEPING;
        wrd.gravity = [0, 0];
        this.world = wrd;
    }

    private createWalls() {
        var stageWidth: number = egret.MainContext.instance.stage.stageWidth;
        var stageHeight: number = egret.MainContext.instance.stage.stageHeight;
        this.createWall(50, stageHeight - 100, 50, 100, 0);
        this.createWall(50, stageHeight - 100, stageWidth - 50, 100, 0);
        this.createWall(50, stageWidth - 100, 50, 100, Math.PI / 2);
    }

    private createWall(width, height, x, y, angle): void {

        var wallShape: p2.Box = new p2.Box({
            width: width,
            height: height
        });
        var wallBody: p2.Body = new p2.Body({ mass: 0 });
        wallBody.position[0] = x;
        wallBody.position[1] = y;
        wallBody.angle = angle;
        wallBody.addShape(wallShape);

        this.world.addBody(wallBody);
    }

    private createGround(): void {
        var stageHeight: number = egret.MainContext.instance.stage.stageHeight;
        var groundShape: p2.Plane = new p2.Plane();
        var groundBody: p2.Body = new p2.Body();
        groundBody.position[1] = stageHeight - 100;
        groundBody.angle = Math.PI;
        groundBody.addShape(groundShape);


        this.world.addBody(groundBody);
    }
    private createBodies(): void {
        //var boxShape: p2.Shape = new p2.Rectangle(100, 50);
        var boxShape: p2.Shape = new p2.Box({ width: 100, height: 50 });
        var boxBody: p2.Body = new p2.Body({ mass: 1, position: [200, 200] });
        boxBody.addShape(boxShape);
        this.world.addBody(boxBody);

        //var boxShape: p2.Shape = new p2.Rectangle(50, 50);
        var boxShape: p2.Shape = new p2.Box({ width: 50, height: 50 });
        var boxBody: p2.Body = new p2.Body({ mass: 1, position: [200, 180] });
        boxBody.addShape(boxShape);
        this.world.addBody(boxBody);
    }
    private createDebug(): void {
        //创建调试试图
        this.debugDraw = new p2DebugDraw(this.world);
        var sprite: egret.Sprite = new egret.Sprite();
        this.addChild(sprite);
        this.debugDraw.setSprite(sprite);
    }

    private touchEvent(e: egret.TouchEvent) {
        var t = this;
        switch (e.type) {
        case egret.TouchEvent.TOUCH_BEGIN:
            this.cueBallState == game.CueBallState.CUEBALLVISIBLE && (this.addChild(this._cueBall = new game.CueBall(this.world)),
            this.cueState == game.CueState.CUEOFF,
            this._cueBall.cueBallBody.sleepState = p2.Body.SLEEPY,
            this.addChild(this._cue = new Cue(this._cueBall.cueBallBody.position[0],this._cueBall.cueBallBody.position[1])),
            this.createMaterial());
            var i = e.stageX - this._cue.cueBmp.x
              , o = e.stageY - this._cue.cueBmp.y;
            this._cue.cueBmp.rotation = 180 * Math.atan2(o, i) / Math.PI,
            this.mouseStart = new Array(this._cueBall.cueBallBody.position[0],this._cueBall.cueBallBody.position[1]);
            break;
        case egret.TouchEvent.TOUCH_END:
            if (this.cueBallState == game.CueBallState.CUEBALLVISIBLE)
                return void (this.cueBallState = CueBallState.CUEBALLSTOP);
            egret.Tween.get(this._cue.cueBmp).to({
                x: this._cueBall.cueBallBody.position[0],
                y: this._cueBall.cueBallBody.position[1]
            }, 100).call(function() {
                t.removeChild(t._cue),
                t.cueState = CueState.CUEOFF
            }),
            this.mouseEnd = new Array(e.stageX,e.stageY);
            var a = new Array;
            p2.vec2.subtract(a, this.mouseStart, this.mouseEnd),
            a.length > 1 && (p2.vec2.scale(a, a, 2),
            this._cueBall.cueBallBody.applyImpulse(a, this.mouseStart),
            this.mouseStart = null,
            this.mouseEnd = null,
            this.cueHitSound.play(0, 1),
            this.cueBallState = CueBallState.CUEBALLMOVE);
            break;
        case egret.TouchEvent.TOUCH_MOVE:
            var i = e.stageX - this._cueBall.cueBallBody.position[0]
              , o = e.stageY - this._cueBall.cueBallBody.position[1];
            this._cue.cueBmp.rotation = 180 * Math.atan2(o, i) / Math.PI,
            this._cue.cueBmp.x = e.stageX,
            this._cue.cueBmp.y = e.stageY
        }
    }

    private loop(): void {
        this.world.step(60 / 1000);
        this.debugDraw.drawDebug();
    }
    private types: string[] = ["box", "circle", "capsule", "line", "particle"]
    private addOneBox(e: egret.TouchEvent): void {
        var positionX: number = Math.floor(e.stageX);
        var positionY: number = Math.floor(e.stageY);
        var shape: p2.Shape;
        var body = new p2.Body({ mass: 1, position: [positionX, positionY] });

        var shapeType = this.types[Math.floor((Math.random() * this.types.length))];
        //shapeType = "particle";
        switch (shapeType) {
            case "box":
                //shape = new p2.Rectangle(Math.random() * 150 + 50, 100);
                shape = new p2.Box({ width: Math.random() * 150 + 50, height: 100 });
                break;
            case "circle":
                //shape = new p2.Circle(50);
                shape = new p2.Circle({ radius: 50 });
                break;
            case "capsule":
                //shape = new p2.Capsule(50, 10);
                shape = new p2.Capsule({ length: 50, radius: 10 });
                break;
            case "line":
                //shape = new p2.Line(150);
                shape = new p2.Line({ length: 150 });
                break;
            case "particle":
                shape = new p2.Particle();
                break;
        }
        body.addShape(shape);
        this.world.addBody(body);
    }
}
