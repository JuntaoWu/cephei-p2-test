var GameScene = function(e) {
    function t() {
        var t = e.call(this) || this;
        return t.cueBallState = CueBallState.CUEBALLSTOP,
        t.cueState = CueState.CUEOFF,
        t.GameInit(),
        t
    }
    return __extends(t, e),
    t.prototype.GameInit = function() {
        this.touchEnabled = !0,
        this.stageW = egret.MainContext.instance.stage.stageWidth,
        this.stageH = egret.MainContext.instance.stage.stageHeight,
        this.CreateWorld(),
        this.CreateDebugDraw(),
        this.addChild(this._gameBg = new game.GameBackground),
        this.addChild(this._wall = new game.Wall(this.world)),
        this.addChild(this._holes = new game.Holes(this.world)),
        this.addChild(this._cueBall = new game.CueBall(this.world)),
        this.addSound(),
        this.addChild(this._ball = new Balls(this.world)),
        this.createMaterial(),
        this.hitListener(),
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchEvent, this),
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEvent, this),
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEvent, this),
        this.addEventListener(egret.Event.ENTER_FRAME, this.onLoop, this)
    }
    ,
    t.prototype.CreateWorld = function() {
        this.world = new p2.World({
            gravity: [0, 0]
        }),
        this.world.sleepMode = p2.World.BODY_SLEEPING
    }
    ,
    t.prototype.CreateDebugDraw = function() {
        var e = new egret.Sprite;
        this.addChild(e),
        this.debugDraw = new p2DebugDraw(this.world),
        this.debugDraw.setSprite(e)
    }
    ,
    t.prototype.onLoop = function(e) {
        this.world.step(.1),
        this.debugDraw.drawDebug();
        for (var t = 0; t < this.world.bodies.length; t++) {
            var i = this.world.bodies[t]
              , o = i.displays[0];
            o && (o.x = i.position[0],
            o.y = i.position[1])
        }
        (this._cueBall.cueBallBody.position[0] < 0 || this._cueBall.cueBallBody.position[0] > 800) && (this.cueBallState = CueBallState.CUEBALLOUT),
        (this._cueBall.cueBallBody.position[1] < 0 || this._cueBall.cueBallBody.position[1] > 640) && (this.cueBallState = CueBallState.CUEBALLOUT),
        this.cueBallState == CueBallState.CUEBALLOUT && (this.world.removeBody(this._cueBall.cueBallBody),
        this.cueBallState = CueBallState.CUEBALLVISIBLE,
        this.cueState = CueState.CUEON,
        this._showText.showText.text = "用力过猛 请点击屏幕重新放置白球",
        this._showText.showText.x = this.stageW / 2 - this._showText.showText.width / 2),
        this.cueBallState == CueBallState.CUEBALLVISIBLE && (this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchEvent, this),
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEvent, this),
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEvent, this)),
        this.cueBallState == CueBallState.CUEBALLMOVE,
        this.cueState != CueState.CUEON && (this._cueBall.cueBallBody.sleepState == p2.Body.SLEEPING ? (this._showText.showText.text = "可以开球",
        this._showText.showText.x = this.stageW / 2 - this._showText.showText.width / 2,
        this.addChild(this._cue = new Cue(this._cueBall.cueBallBody.position[0],this._cueBall.cueBallBody.position[1])),
        this.cueState = CueState.CUEON,
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchEvent, this),
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEvent, this),
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEvent, this)) : (this._showText.showText.text = "",
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchEvent, this),
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEvent, this),
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchEvent, this)))
    }
    ,
    t.prototype.touchEvent = function(e) {
        var t = this;
        switch (e.type) {
        case egret.TouchEvent.TOUCH_BEGIN:
            this.cueBallState == CueBallState.CUEBALLVISIBLE && (this.addChild(this._cueBall = new CueBall(this.world)),
            this.cueState == CueState.CUEOFF,
            this._cueBall.cueBallBody.sleepState = p2.Body.SLEEPY,
            this.addChild(this._cue = new Cue(this._cueBall.cueBallBody.position[0],this._cueBall.cueBallBody.position[1])),
            this.createMaterial());
            var i = e.stageX - this._cue.cueBmp.x
              , o = e.stageY - this._cue.cueBmp.y;
            this._cue.cueBmp.rotation = 180 * Math.atan2(o, i) / Math.PI,
            this.mouseStart = new Array(this._cueBall.cueBallBody.position[0],this._cueBall.cueBallBody.position[1]);
            break;
        case egret.TouchEvent.TOUCH_END:
            if (this.cueBallState == CueBallState.CUEBALLVISIBLE)
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
    ,
    t.prototype.createMaterial = function() {
        var e = new p2.Material(0)
          , t = new p2.Material(0)
          , i = new p2.Material(0)
          , o = new p2.ContactMaterial(e,t)
          , a = new p2.ContactMaterial(e,i)
          , s = new p2.ContactMaterial(t,i);
        o.restitution = 1,
        a.restitution = .8,
        s.restitution = .8,
        this._cueBall.cueBallShape.material = e,
        this._wall.upOneWall.material = t,
        this._wall.upTwoWall.material = t,
        this._wall.downOneWall.material = t,
        this._wall.downTwoWall.material = t,
        this._wall.leftWall.material = t,
        this._wall.rightWall.material = t;
        for (var l = 0; l < this._ball.ballShapes.length; l++) {
            var r = this._ball.ballShapes[l];
            r.material = i
        }
        this.world.addContactMaterial(o),
        this.world.addContactMaterial(a),
        this.world.addContactMaterial(s)
    }
    ,
    t.prototype.hitListener = function() {
        var e = this;
        this.world.on("endContact", function(t) {
            for (var i = 0; i < e._holes.Holes.length; i++) {
                var o = e._holes.Holes[i];
                if (t.bodyA === o || t.bodyB === o) {
                    (t.bodyA === e._cueBall.cueBallBody || t.bodyB === e._cueBall.cueBallBody) && (e.world.removeBody(e._cueBall.cueBallBody),
                    e._cueBall.cueBallRemoveBmp(),
                    e.cueBallState = CueBallState.CUEBALLVISIBLE,
                    e.cueState = CueState.CUEON,
                    e._showText.showText.text = "白球入洞 请点击屏幕重新放置白球",
                    e._showText.showText.x = e.stageW / 2 - e._showText.showText.width / 2);
                    for (var i = 0; i < e._ball.ballBody.length; i++) {
                        var a = e._ball.ballBody[i];
                        e._ball.ballBmps[i];
                        (t.bodyA === a || t.bodyB === a) && (e.ballHitSound.play(0, 1),
                        e.world.removeBody(a),
                        e._ball.removeBallBmp(i))
                    }
                    e.pocketSound.play(0, 1)
                }
            }
            for (var i = 0; i < e._ball.ballBody.length; i++) {
                var a = e._ball.ballBody[i];
                (t.bodyA === a || t.bodyB === a) && e.ballHitSound.play(0, 1)
            }
        })
    }
    ,
    t.prototype.addSound = function() {
        this.cueHitSound = RES.getRes("cueHit_mp3"),
        this.ballHitSound = RES.getRes("ballHit_mp3"),
        this.pocketSound = RES.getRes("pocket_mp3")
    }
    ,
    t
}(egret.DisplayObjectContainer);
__reflect(GameScene.prototype, "GameScene");

