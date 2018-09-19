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
class Main extends eui.UILayer {

    private stageW: number;
    private stageH: number;
    private debugDraw: p2DebugDraw;
    private world: p2.World;

    private _gameBg: game.GameBackground;
    private _wall: game.Wall;
    private _holes: game.Holes;
    private _cueBall: game.CueBall;
    private _ball: game.Balls;
    private _cue: game.Cue;

    private cueBallState: game.CueBallState;
    private cueState: game.CueState;

    private currentLevel: number = 0;

    protected createChildren(): void {

        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createWorld();
        // this.createWalls();
        // //this.createGround();
        // this.createBodies();
        this.createGameScene();
        this.createDebug();
    }

    private async loadResource() {
        try {
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }


    private _levelsArray: Array<game.Level>;
    public get levelsArray(): Array<game.Level> {
        if (!this._levelsArray) {
            this._levelsArray = RES.getRes("level_json");
        }
        return this._levelsArray;
    }

    public updateLevel(level: number) {
        this.currentLevel = level;
        this.currentLevel %= this.levelsArray.length;
        this._wall.updateConfig(this.levelsArray[this.currentLevel].walls);
        this._holes.updateConfig(this.levelsArray[this.currentLevel].holes);
        this._cueBall.updateConfig(this.levelsArray[this.currentLevel].cueBalls);
        this._ball.updateConfig(this.levelsArray[this.currentLevel].balls);
    }

    private createGameScene() {

        this.cueBallState = game.CueBallState.CUEBALLSTOP;
        this.cueState = game.CueState.CUEOFF;

        this.touchEnabled = !0,
            this.stageW = egret.MainContext.instance.stage.stageWidth,
            this.stageH = egret.MainContext.instance.stage.stageHeight,
            this.createWorld(),
            this.createDebug(),
            this.stage.addChild(this._gameBg = new game.GameBackground()),
            this.stage.addChild(this._wall = new game.Wall(this.world, this.levelsArray[this.currentLevel].walls)),
            this.stage.addChild(this._holes = new game.Holes(this.world, this.levelsArray[this.currentLevel].holes)),
            this.stage.addChild(this._cueBall = new game.CueBall(this.world, this.levelsArray[this.currentLevel].cueBalls)),
            this.stage.addChild(this._ball = new game.Balls(this.world, this.levelsArray[this.currentLevel].balls)),
            this.createMaterial(),
            this.hitListener(),
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchEvent, this),
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEvent, this),
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEvent, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.loop, this);
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

    private createMaterial() {
        var e = new p2.Material(0)
            , t = new p2.Material(0)
            , i = new p2.Material(0)
            , o = new p2.ContactMaterial(e, t)
            , a = new p2.ContactMaterial(e, i)
            , s = new p2.ContactMaterial(t, i),
            x = new p2.ContactMaterial(t, i);
        x.restitution = 3;
        o.restitution = 1,
            a.restitution = .8,
            s.restitution = .8,
            this._cueBall.cueBallShape.material = e,
            this._wall.upOneWall.material = t,
            this._wall.downOneWall.material = t,
            this._wall.leftWall.material = t,
            this._wall.rightWall.material = t;
        this._wall.airWall.material = x;
        for (var l = 0; l < this._ball.ballShapes.length; l++) {
            var r = this._ball.ballShapes[l];
            r.material = i
        }
        this.world.addContactMaterial(o),
            this.world.addContactMaterial(a),
            this.world.addContactMaterial(s),
            this.world.addContactMaterial(x);
    }

    private hitListener() {
        var e = this;
        this.world.on("endContact", (t) => {
            for (var i = 0; i < e._holes.holes.length; i++) {
                var o = e._holes.holes[i];
                if (t.bodyA === o || t.bodyB === o) {
                    if (t.bodyA === e._cueBall.cueBallBody || t.bodyB === e._cueBall.cueBallBody) {
                        e.world.removeBody(e._cueBall.cueBallBody);
                        e._cueBall.cueBallRemoveBmp(),
                            e.cueBallState = game.CueBallState.CUEBALLVISIBLE;
                        e.cueState = game.CueState.CUEON;

                        this.updateLevel(this.currentLevel);
                    }
                    else {
                        for (var i = 0; i < e._ball.ballBody.length; i++) {
                            var a = e._ball.ballBody[i];
                            e._ball.ballBmps[i];
                            e.world.removeBody(a);
                            e._ball.removeBallBmp(i);
                        }

                        e.world.removeBody(e._cueBall.cueBallBody);
                        e._cueBall.cueBallRemoveBmp(),
                            e.cueBallState = game.CueBallState.CUEBALLVISIBLE;
                        e.cueState = game.CueState.CUEON;

                        this.updateLevel(this.currentLevel + 1);
                    }
                }
            }
            for (var i = 0; i < e._ball.ballBody.length; i++) {
                var a = e._ball.ballBody[i];
            }
        })
    }

    private createDebug(): void {
        //创建调试试图
        this.debugDraw = new p2DebugDraw(this.world);
        var sprite: egret.Sprite = new egret.Sprite();
        this.stage.addChild(sprite);
        this.debugDraw.setSprite(sprite);
    }

    private mouseStart: Array<number>;
    private mouseMove: Array<number>;
    private mouseEnd: Array<number>;

    private touchEvent(e: egret.TouchEvent) {
        switch (e.type) {
            case egret.TouchEvent.TOUCH_BEGIN: {
                if (this.cueBallState == game.CueBallState.CUEBALLVISIBLE) {
                    this.stage.addChild(this._cueBall = new game.CueBall(this.world, this.levelsArray[this.currentLevel].cueBalls));
                    this.cueState == game.CueState.CUEOFF;
                    this._cueBall.cueBallBody.sleepState = p2.Body.SLEEPY;
                    this.stage.addChild(this._cue = new game.Cue(this._cueBall.cueBallBody.position[0], this._cueBall.cueBallBody.position[1]));
                    this.createMaterial();
                }
                this._cue.cueBmp.x = e.stageX;
                this._cue.cueBmp.y = e.stageY;
                let i = e.stageX - this._cue.cueBmp.x;
                let o = e.stageY - this._cue.cueBmp.y;
                this.mouseStart = new Array(this._cueBall.cueBallBody.position[0], this._cueBall.cueBallBody.position[1]);
                break;
            }
            case egret.TouchEvent.TOUCH_END: {
                if (this.cueBallState == game.CueBallState.CUEBALLVISIBLE) {
                    return void (this.cueBallState = game.CueBallState.CUEBALLSTOP);
                }
                egret.Tween.get(this._cue.cueBmp).to({
                    scaleX: 1.5,
                    scaleY: 1.5
                }, 500).call(() => {
                    this.stage.removeChild(this._cue);
                    this.cueState = game.CueState.CUEOFF;
                });
                this.mouseEnd = new Array(e.stageX, e.stageY);
                var a = new Array();
                p2.vec2.subtract(a, this._cueBall.cueBallBody.position, this.mouseEnd);
                if (a.length > 1) {
                    p2.vec2.scale(a, a, 100 / Math.sqrt(a[0] * a[0] + a[1] * a[1]));
                    this._cueBall.cueBallBody.applyImpulse(a, this.mouseEnd);
                    this._ball.ballBody.forEach(ballBody => {
                        let aRedBall = new Array();
                        p2.vec2.subtract(aRedBall, ballBody.position, this.mouseEnd);

                        if (aRedBall && aRedBall.length > 1) {
                            p2.vec2.scale(aRedBall, aRedBall, 100 / Math.sqrt(aRedBall[0] * aRedBall[0] + aRedBall[1] * aRedBall[1]));
                            ballBody.applyImpulse(aRedBall, this.mouseEnd);
                        }
                    });
                    this.mouseStart = null;
                    this.mouseEnd = null;
                    this.cueBallState = game.CueBallState.CUEBALLMOVE;
                }
                break;
            }
            case egret.TouchEvent.TOUCH_MOVE: {
                this._cue.cueBmp.x = e.stageX;
                this._cue.cueBmp.y = e.stageY;
                break;
            }
        }
    }

    private loop(): void {
        this.world.step(60 / 1000);
        this.debugDraw.drawDebug();
        this.world.step(.1),
            this.debugDraw.drawDebug();
        for (var t = 0; t < this.world.bodies.length; t++) {
            var i = this.world.bodies[t]
                , o = i.displays[0];
            o && (o.x = i.position[0],
                o.y = i.position[1])
        }
        (this._cueBall.cueBallBody.position[0] < 0 || this._cueBall.cueBallBody.position[0] > 800) && (this.cueBallState = game.CueBallState.CUEBALLOUT);
        (this._cueBall.cueBallBody.position[1] < 0 || this._cueBall.cueBallBody.position[1] > 640) && (this.cueBallState = game.CueBallState.CUEBALLOUT);
        if (this.cueBallState == game.CueBallState.CUEBALLOUT) {
            this.world.removeBody(this._cueBall.cueBallBody);
            this.cueBallState = game.CueBallState.CUEBALLVISIBLE;
            this.cueState = game.CueState.CUEON;
        }
        this.cueBallState == game.CueBallState.CUEBALLVISIBLE && (this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchEvent, this),
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEvent, this),
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEvent, this)),
            this.cueBallState == game.CueBallState.CUEBALLMOVE;

        if (this.cueState != game.CueState.CUEON) {
            if (this._cueBall.cueBallBody.sleepState == p2.Body.SLEEPING) {
                this.stage.addChild(this._cue = new game.Cue(this._cueBall.cueBallBody.position[0], this._cueBall.cueBallBody.position[1]));
                this.cueState = game.CueState.CUEON;
                this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchEvent, this);
                this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEvent, this);
                this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEvent, this);
            }
            else {
                this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchEvent, this);
                this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEvent, this);
                this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEvent, this);
            }
        }
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
