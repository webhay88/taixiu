window.__require=function t(i,e,n){function o(a,c){if(!e[a]){if(!i[a]){var r=a.split("/");if(r=r[r.length-1],!i[r]){var u="function"==typeof __require&&__require;if(!c&&u)return u(r,!0);if(s)return s(r,!0);throw new Error("Cannot find module '"+a+"'")}a=r}var h=e[a]={exports:{}};i[a][0].call(h.exports,function(t){return o(i[a][1][t]||t)},h,h.exports,t,i,e,n)}return e[a].exports}for(var s="function"==typeof __require&&__require,a=0;a<n.length;a++)o(n[a]);return o}({HotUpdateModule:[function(t,i){"use strict";cc._RF.push(i,"1355b12LSNDRoLBi/wy9wU2","HotUpdateModule"),cc.Class({extends:cc.Component,properties:{manifestUrl:cc.Asset,versionLabel:{default:null,type:cc.Label},_updating:!1,_canRetry:!1,_storagePath:""},onLoad:function(){cc.sys.isNative&&(this._storagePath=(jsb.fileUtils?jsb.fileUtils.getWritablePath():"/")+"client",this.versionCompareHandle=function(t,i){for(var e=t.split("."),n=i.split("."),o=0;o<e.length;++o){var s=parseInt(e[o]),a=parseInt(n[o]||0);if(s!==a)return s-a}return n.length>e.length?-1:0},this._am=new jsb.AssetsManager(this.manifestUrl.nativeUrl,this._storagePath,this.versionCompareHandle),this._am.setVerifyCallback(function(){return!0}),this.versionLabel&&(this.versionLabel.string="src:"+this._am.getLocalManifest().getVersion()),cc.sys.os,cc.sys.OS_ANDROID,this._am.setMaxConcurrentTask(16))},onDestroy:function(){cc.sys.isNative&&(this._am.setEventCallback(null),this._am=null)},showLog:function(t){cc.log("[HotUpdateModule][showLog]----"+t)},retry:function(){!this._updating&&this._canRetry&&(this._canRetry=!1,this._am.downloadFailedAssets())},updateCallback:function(t){var i=!1,e=!1;switch(t.getEventCode()){case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:this.showLog("The local manifest file was not found, and the hot update was skipped."),e=!0;break;case jsb.EventAssetsManager.UPDATE_PROGRESSION:var n=t.getPercent();if(isNaN(n))return;var o=t.getMessage();this.disPatchRateEvent(n,o),this.showLog("updateCallback Update progress:"+n+", msg: "+o);break;case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:this.showLog("Failed to download manifest file, skip hot update."),e=!0;break;case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:this.showLog("Already the latest version."),e=!0;break;case jsb.EventAssetsManager.UPDATE_FINISHED:this.showLog("The update is over."+t.getMessage()),this.disPatchRateEvent(1),i=!0;break;case jsb.EventAssetsManager.UPDATE_FAILED:this.showLog("Update error."+t.getMessage()),this._updating=!1,this._canRetry=!0,this._failCount++,this.retry();break;case jsb.EventAssetsManager.ERROR_UPDATING:this.showLog("Error during update:"+t.getAssetId()+", "+t.getMessage());break;case jsb.EventAssetsManager.ERROR_DECOMPRESS:this.showLog("unzip error")}if(e&&(this._am.setEventCallback(null),this._updating=!1),i){this._am.setEventCallback(null);var s=jsb.fileUtils.getSearchPaths(),a=this._am.getLocalManifest().getSearchPaths();Array.prototype.unshift.apply(s,a),cc.sys.localStorage.setItem("HotUpdateSearchPaths",JSON.stringify(s)),jsb.fileUtils.setSearchPaths(s),cc.audioEngine.stopAll(),setTimeout(function(){cc.game.restart()},100)}},hotUpdate:function(){if(this._am&&!this._updating){if(this._am.setEventCallback(this.updateCallback.bind(this)),this._am.getState()===jsb.AssetsManager.State.UNINITED){var t=this.manifestUrl.nativeUrl;cc.assetManager.md5Pipe&&(t=cc.assetManager.md5Pipe.transformURL(t)),this._am.loadLocalManifest(t)}this._failCount=0,this._am.update(),this._updating=!0}},checkCallback:function(t){switch(t.getEventCode()){case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:this.showLog("The local manifest file was not found, and the hot update was skipped."),this.hotUpdateFinish(!0);break;case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:this.showLog("Failed to download manifest file, skip hot update."),this.hotUpdateFinish(!1);break;case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:this.showLog("updated."),this.hotUpdateFinish(!0);break;case jsb.EventAssetsManager.NEW_VERSION_FOUND:return this.showLog("There is a new version, need to update"),this._updating=!1,void this.hotUpdate();case jsb.EventAssetsManager.UPDATE_PROGRESSION:var i=t.getPercent();if(isNaN(i))return;var e=t.getMessage();return void this.showLog("checkCallback Update progress:"+i+", msg: "+e);default:return void console.log("event.getEventCode():"+t.getEventCode())}this._am.setEventCallback(null),this._updating=!1},checkUpdate:function(){if(this._updating)cc.log("Checking for updates...");else{if(this._am.getState()===jsb.AssetsManager.State.UNINITED){var t=this.manifestUrl.nativeUrl;cc.assetManager.md5Pipe&&(t=cc.assetManager.md5Pipe.transformURL(t)),this._am.loadLocalManifest(t)}this._am.getLocalManifest()&&this._am.getLocalManifest().isLoaded()?(this._am.setEventCallback(this.checkCallback.bind(this)),this._am.checkUpdate(),this._updating=!0,this.disPatchRateEvent(.01)):this.showLog("Failed to load manifest file")}},hotUpdateFinish:function(t){cc.director.emit("HotUpdateFinish",t)},disPatchRateEvent:function(t){t>1&&(t=1),cc.director.emit("HotUpdateRate",t)}}),cc._RF.pop()},{}],LoginView:[function(t,i){"use strict";cc._RF.push(i,"279d8WtB4RHzak/MgK2/4ZW","LoginView"),cc.Class({extends:cc.Component,properties:{menuNode:{default:null,type:cc.Node},labelTips:{default:null,type:cc.Label}},onLoad:function(){this.menuNode.active=!0},onDestroy:function(){},onEnable:function(){cc.director.on("HotUpdateFinish",this.onHotUpdateFinish,this),cc.director.on("HotUpdateRate",this.onHotUpdateRate,this)},onDisable:function(){cc.director.off("HotUpdateFinish",this.onHotUpdateFinish,this),cc.director.off("HotUpdateRate",this.onHotUpdateRate,this)},checkVersion:function(){},onUpdateFinish:function(){this.menuNode.active=!0,this.labelTips.string=""},onHotUpdateFinish:function(){this.onUpdateFinish()},onHotUpdateRate:function(t){var i=t;i>1&&(i=1),this._updatePercent=i,this.labelTips.string="\u0110ANG TI\u1ebeN H\xc0NH C\u1eacP NH\u1eacT T\xc0I NGUY\xcaN GAME, TI\u1ebeN \u0110\u1ed8 C\u1eacP NH\u1eacT "+parseInt(1e4*i)/100+"%"},onBtnStartGame:function(){cc.director.loadScene("GameScence")},onBtnBill:function(){cc.director.loadScene("Game")}}),cc._RF.pop()},{}],"audio-manager":[function(t,i){"use strict";cc._RF.push(i,"a5358v+LMRMCKIcjoasrMOD","audio-manager");var e=cc.Class({extends:cc.Component,properties:{coinsWin:{default:null,type:cc.AudioClip},coinsInsert:{default:null,type:cc.AudioClip},diceSound:{default:null,type:cc.AudioClip},timerSound:{default:null,type:cc.AudioClip},bgSound:{default:null,type:cc.AudioClip}},statics:{instance:null},playbgSound:function(){cc.audioEngine.playMusic(this.bgSound,!1)},playCoinsWin:function(){cc.audioEngine.playMusic(this.coinsWin,!1)},playCoinsInsert:function(){cc.audioEngine.playEffect(this.coinsInsert,!1)},playDiceSound:function(){cc.audioEngine.playEffect(this.diceSound,!1)},playTimeSound:function(){cc.audioEngine.playEffect(this.timerSound,!1)},playStop:function(){},onLoad:function(){e.instance=this}});cc._RF.pop()},{}],coinAction:[function(t,i){"use strict";function e(t,i){var e;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(e=n(t))||i&&t&&"number"==typeof t.length){e&&(t=e);var o=0;return function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(e=t[Symbol.iterator]()).next.bind(e)}function n(t,i){if(t){if("string"==typeof t)return o(t,i);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?o(t,i):void 0}}function o(t,i){(null==i||i>t.length)&&(i=t.length);for(var e=0,n=new Array(i);e<i;e++)n[e]=t[e];return n}cc._RF.push(i,"a32bb/iX2dPhavykvjiovIR","coinAction");var s=cc.Class({extends:cc.Component,properties:{},onLoad:function(){s.instance=this},start:function(){},coinMoveForWin:function(t){for(var i,n=e(t);!(i=n()).done;){var o=i.value;cc.tween(o).repeat(1,cc.tween().to(2,{position:cc.v2(614.477,-800)})).start()}},coinMoveForLoss:function(t){for(var i,n=e(t);!(i=n()).done;){var o=i.value;cc.tween(o).repeat(1,cc.tween().to(2,{position:cc.v2(1915.195,-800)})).start()}},taiClearCoin:function(t,i,e,n){var o=this,s=this.resultBetTaiXiu(-200,150),a=this.resultBetTaiXiu(-100,100);t.runAction(cc.sequence(cc.moveTo(.1,cc.v2(e.x+s,e.y-a)),cc.callFunc(function(){var e=cc.instantiate(t);e.setPosition(t.position),o.node.addChild(e),n.push(e),t.setPosition(i)})))},xiuClearCoin:function(t,i,e,n){var o=this,s=this.resultBetTaiXiu(-150,150),a=this.resultBetTaiXiu(-100,100);t.runAction(cc.sequence(cc.moveTo(.1,cc.v2(e.x+s,e.y-a)),cc.callFunc(function(){var e=cc.instantiate(t);e.setPosition(t.position),o.node.addChild(e),n.push(e),t.setPosition(i)})))},resultBetTaiXiu:function(t,i){return Math.floor(Math.random()*(i-t+1))+t}});cc._RF.pop()},{}],coinStyle:[function(t,i){"use strict";cc._RF.push(i,"a55adyXfNtAHK5NjaGbz+/d","coinStyle");var e=cc.Class({extends:cc.Component,properties:{},onLoad:function(){e.instance=this},start:function(){},styleCoinFour:function(t,i,e){t[3].opacity=0;var n=cc.instantiate(i[0]);n.setPosition(t[3].position),this.node.addChild(n),t[3]=n,t[3].setPosition(e)},styleCoinFive:function(t,i,e){t[4].opacity=0;var n=cc.instantiate(i[0]);n.setPosition(t[4].position),this.node.addChild(n),t[4]=n,t[4].setPosition(e)},styleCoinSix:function(t,i,e){t[5].opacity=0;var n=cc.instantiate(i[0]);n.setPosition(this.coinArray[5].position),this.node.addChild(n),t[5]=n,t[5].setPosition(e)}});cc._RF.pop()},{}],coinSwitchlight:[function(t,i){"use strict";cc._RF.push(i,"ed0d5SvKslBv76fEcnatrGn","coinSwitchlight");var e=cc.Class({extends:cc.Component,properties:{},onLoad:function(){e.instance=this},coinLight:function(t,i,e){t[3].opacity=0;var n=cc.instantiate(i[1]);n.setPosition(t[3].position),this.node.addChild(n),t[3]=n,t[3].setPosition(e)},coinSwitchLight:function(t,i,e){t[4].opacity=0;var n=cc.instantiate(i[1]);n.setPosition(t[4].position),this.node.addChild(n),t[4]=n,t[4].setPosition(e)},coinLightSwitch:function(t,i,e){t[5].opacity=0;var n=cc.instantiate(i[1]);n.setPosition(t[5].position),this.node.addChild(n),t[5]=n,t[5].setPosition(e)},start:function(){}});cc._RF.pop()},{}],coinSwitch:[function(t,i){"use strict";cc._RF.push(i,"d2206MgwYFFH43Rc4zJJVVU","coinSwitch");var e=cc.Class({extends:cc.Component,properties:{},onLoad:function(){e.instance=this},coinBet:function(t,i,e){t[0].opacity=0;var n=cc.instantiate(i[1]);n.setPosition(t[0].position),this.node.addChild(n),t[0]=n,t[0].setPosition(e)},coinSwitch:function(t,i,e){t[1].opacity=0;var n=cc.instantiate(i[1]);n.setPosition(t[1].position),this.node.addChild(n),t[1]=n,t[1].setPosition(e)},coinBetSwitch:function(t,i,e){t[2].opacity=0;var n=cc.instantiate(i[1]);n.setPosition(t[2].position),this.node.addChild(n),t[2]=n,t[2].setPosition(e)},start:function(){}});cc._RF.pop()},{}],game:[function(t,i){"use strict";cc._RF.push(i,"7130eyumnpLaJWgrpVBQo3h","game");var e=t("audio-manager"),n=t("coinAction"),o=t("shakeCub"),s=t("coinSwitch"),a=t("coinSwitchlight"),c=t("resultCubBet"),r=t("normalCoin"),u=t("coinStyle");cc.Class({extends:cc.Component,properties:{coin1:{default:[],type:[cc.Prefab]},coin2:{default:[],type:[cc.Prefab]},coin3:{default:[],type:[cc.Prefab]},coin4:{default:[],type:[cc.Prefab]},coin5:{default:[],type:[cc.Prefab]},coin6:{default:[],type:[cc.Prefab]},coinArray:{default:[],type:[cc.Node]},coinmoveArray:{default:[],type:[cc.Node]},valuecoin1:{default:!0,visible:!1,type:cc.Boolean},valuecoin2:{default:!0,visible:!1,type:cc.Boolean},valuecoin3:{default:!0,visible:!1,type:cc.Boolean},valuecoin4:{default:!0,visible:!1,type:cc.Boolean},valuecoin5:{default:!0,visible:!1,type:cc.Boolean},valuecoin6:{default:!0,visible:!1,type:cc.Boolean},taiNode:{default:null,type:cc.Node},xiaNode:{default:null,type:cc.Node},taiNodestop:{default:null,type:cc.Node},xiaNodestop:{default:null,type:cc.Node},arrayTaiNode:{default:[],visible:!1,type:[cc.Node]},arrayXuiNode:{default:[],visible:!1,type:[cc.Node]},valuecretedite:{default:0,type:cc.Integer},creditLabel:{default:null,type:cc.Label},taiLabel:{default:null,type:cc.Label},xiuLabel:{default:null,type:cc.Label},taivalue:{default:0,visible:!1,type:cc.Integer},xiuvalue:{default:0,visible:!1,type:cc.Integer},cubArray:{default:[],type:[cc.Node]},timeLabel:{default:null,type:cc.Label},timecount:{default:0,visible:!1,type:cc.Integer},stopscub:{default:[],type:[cc.Prefab]},totalValuesDice:{default:0,visible:!1,type:cc.Integer},valueWin:{default:null,visible:!1,type:cc.Integer},labelWin:{default:null,type:cc.Label},refnode:{default:null,type:cc.Node},exitnode:{default:null,type:cc.Node},Nodetaiwin:{default:null,type:cc.Node},NodeXiuwin:{default:null,type:cc.Node}},statics:{defaultSprCoin1:null,defaultSprCoin2:null,defaultSprCoin3:null,defaultSprCoin4:null,defaultSprCoin5:null,defaultSprCoin6:null},onLoad:function(){this.allButtonFun(),this.timeToBet()},timeToBet:function(){this.timecount=20,this.schedule(function(){this.valueWin=0,this.timecount>0&&(this.timeLabel.string=""+this.timecount,this.labelWin.string=this.valueWin+" K",e.instance.playTimeSound()),-1==this.timecount&&(this.cubArray[0].opacity=0,this.cubArray[1].opacity=0,this.cubArray[2].opacity=0,this.timeLabel.string="GO",this.cub()),this.timecount<0&&this.timecount>-5&&e.instance.playDiceSound(),-7==this.timecount&&(this.totalfun(),this.moveCoin(),this.cubArray[0].opacity=255,this.cubArray[1].opacity=255,this.cubArray[2].opacity=255),-10==this.timecount&&(this.NodeXiuwin.opacity=0,this.Nodetaiwin.opacity=0,o.instance.clearArrayCoin(this.arrayTaiNode,this.arrayXuiNode),this.timecount=20),this.timecount--},1)},totalfun:function(){this.totalValuesDice<=10?(this.NodeXiuwin.opacity=255,this.Nodetaiwin.opacity=0,this.valueWin=2*this.xiuvalue,this.valuecretedite=this.valuecretedite+this.valueWin,this.labelWin.string=this.valueWin+" K",this.creditLabel.string=this.valuecretedite+" K",n.instance.coinMoveForWin(this.arrayXuiNode),n.instance.coinMoveForLoss(this.arrayTaiNode)):(this.Nodetaiwin.opacity=255,this.NodeXiuwin.opacity=0,this.valueWin=2*this.taivalue,this.valuecretedite=this.valuecretedite+this.valueWin,this.labelWin.string=this.valueWin+" K",this.creditLabel.string=this.valuecretedite+" K",n.instance.coinMoveForLoss(this.arrayXuiNode),n.instance.coinMoveForWin(this.arrayTaiNode))},coin1function:function(){1==this.valuecoin1&&o.instance.betCoinSwitch(this.coinArray[0],this.coin1,this.defaultSprCoin1)},coin2function:function(){1==this.valuecoin2&&o.instance.betCoinSwitch(this.coinArray[1],this.coin2,this.defaultSprCoin2)},coin3function:function(){1==this.valuecoin3&&o.instance.betCoinSwitch(this.coinArray[2],this.coin3,this.defaultSprCoin3)},coin4function:function(){1==this.valuecoin4&&o.instance.betCoinSwitch(this.coinArray[3],this.coin4,this.defaultSprCoin4)},coin5function:function(){1==this.valuecoin5&&o.instance.betCoinSwitch(this.coinArray[4],this.coin5,this.defaultSprCoin5)},coin6function:function(){1==this.valuecoin6&&o.instance.betCoinSwitch(this.coinArray[5],this.coin6,this.defaultSprCoin6)},coin1Bet:function(){1==this.valuecoin1?(s.instance.coinBet(this.coinArray,this.coin1,this.defaultSprCoin1),this.valuecoin1=!1,this.valuecoin2=!0,this.valuecoin3=!0,this.valuecoin4=!0,this.valuecoin5=!0,this.valuecoin6=!0,this.coin2function(),this.coin3function(),this.coin4function(),this.coin5function(),this.coin6function()):(r.instance.coinNormalOne(this.coinArray,this.coin1,this.defaultSprCoin1),this.valuecoin1=!0)},coin2Bet:function(){1==this.valuecoin2?(s.instance.coinSwitch(this.coinArray,this.coin2,this.defaultSprCoin2),this.valuecoin2=!1,this.valuecoin1=!0,this.valuecoin3=!0,this.valuecoin4=!0,this.valuecoin5=!0,this.valuecoin6=!0,this.coin1function(),this.coin3function(),this.coin4function(),this.coin5function(),this.coin6function()):(this.valuecoin2=!0,r.instance.coinNormalTwo(this.coinArray,this.coin2,this.defaultSprCoin2))},coin3Bet:function(){1==this.valuecoin3?(s.instance.coinBetSwitch(this.coinArray,this.coin3,this.defaultSprCoin3),this.valuecoin3=!1,this.valuecoin1=!0,this.valuecoin2=!0,this.valuecoin4=!0,this.valuecoin5=!0,this.valuecoin6=!0,this.coin1function(),this.coin2function(),this.coin4function(),this.coin5function(),this.coin6function()):(r.instance.coinNormalThree(this.coinArray,this.coin3,this.defaultSprCoin3),this.valuecoin3=!0)},coin4Bet:function(){1==this.valuecoin4?(a.instance.coinLight(this.coinArray,this.coin4,this.defaultSprCoin4),this.valuecoin4=!1,this.valuecoin1=!0,this.valuecoin2=!0,this.valuecoin3=!0,this.valuecoin5=!0,this.valuecoin6=!0,this.coin1function(),this.coin2function(),this.coin3function(),this.coin5function(),this.coin6function()):(u.instance.styleCoinFour(this.coinArray,this.coin4,this.defaultSprCoin4),this.valuecoin4=!0)},coin5Bet:function(){1==this.valuecoin5?(a.instance.coinSwitchLight(this.coinArray,this.coin5,this.defaultSprCoin5),this.valuecoin5=!1,this.valuecoin1=!0,this.valuecoin2=!0,this.valuecoin3=!0,this.valuecoin4=!0,this.valuecoin6=!0,this.coin1function(),this.coin2function(),this.coin3function(),this.coin4function(),this.coin6function()):(u.instance.styleCoinFive(this.coinArray,this.coin5,this.defaultSprCoin5),this.valuecoin5=!0)},coin6Bet:function(){1==this.valuecoin6?(a.instance.coinLightSwitch(this.coinArray,this.coin6,this.defaultSprCoin6),this.valuecoin6=!1,this.valuecoin1=!0,this.valuecoin2=!0,this.valuecoin3=!0,this.valuecoin4=!0,this.valuecoin5=!0,this.coin1function(),this.coin2function(),this.coin3function(),this.coin4function(),this.coin5function()):(u.instance.styleCoinSix(this.coinArray,this.coin6,this.defaultSprCoin6),this.valuecoin6=!0)},allButtonFun:function(){this.buttonanimation(this.taiNode),this.buttonanimation(this.xiaNode),this.buttonanimation(this.refnode),this.buttonanimation(this.exitnode),this.buttonanimation(this.coinArray[0]),this.buttonanimation(this.coinArray[1]),this.buttonanimation(this.coinArray[2]),this.buttonanimation(this.coinArray[3]),this.buttonanimation(this.coinArray[4]),this.buttonanimation(this.coinArray[5]),this.defaultSprCoin1=this.coinArray[0].position,this.defaultSprCoin2=this.coinArray[1].position,this.defaultSprCoin3=this.coinArray[2].position,this.defaultSprCoin4=this.coinArray[3].position,this.defaultSprCoin5=this.coinArray[4].position,this.defaultSprCoin6=this.coinArray[5].position,this.coinArray[0].on(cc.Node.EventType.TOUCH_START,this.coin1Bet,this),this.coinArray[1].on(cc.Node.EventType.TOUCH_START,this.coin2Bet,this),this.coinArray[2].on(cc.Node.EventType.TOUCH_START,this.coin3Bet,this),this.coinArray[3].on(cc.Node.EventType.TOUCH_START,this.coin4Bet,this),this.coinArray[4].on(cc.Node.EventType.TOUCH_START,this.coin5Bet,this),this.coinArray[5].on(cc.Node.EventType.TOUCH_START,this.coin6Bet,this),this.taiNode.on(cc.Node.EventType.TOUCH_START,this.taiButton,this),this.xiaNode.on(cc.Node.EventType.TOUCH_START,this.XuiButton,this),this.exitnode.on(cc.Node.EventType.TOUCH_START,this.exitFun,this),this.refnode.on(cc.Node.EventType.TOUCH_START,this.refreshScence,this)},taiButton:function(){this.timecount<=0||(0==this.valuecoin1&&(e.instance.playCoinsInsert(),this.valuecretedite>=1&&(n.instance.taiClearCoin(this.coinmoveArray[0],this.defaultSprCoin1,this.taiNodestop,this.arrayTaiNode),this.valuecretedite-=1,this.taivalue+=1,this.taiLabel.string=this.taivalue+"K",this.creditLabel.string=this.valuecretedite+"K")),0==this.valuecoin2&&this.valuecretedite>=5&&(e.instance.playCoinsInsert(),n.instance.taiClearCoin(this.coinmoveArray[1],this.defaultSprCoin2,this.taiNodestop,this.arrayTaiNode),this.valuecretedite-=5,this.taivalue+=5,this.taiLabel.string=this.taivalue+"K",this.creditLabel.string=this.valuecretedite+"K"),0==this.valuecoin3&&this.valuecretedite>=10&&(e.instance.playCoinsInsert(),n.instance.taiClearCoin(this.coinmoveArray[2],this.defaultSprCoin3,this.taiNodestop,this.arrayTaiNode),this.valuecretedite-=10,this.taivalue+=10,this.taiLabel.string=this.taivalue+"K",this.creditLabel.string=this.valuecretedite+"K"),0==this.valuecoin4&&this.valuecretedite>=20&&(e.instance.playCoinsInsert(),n.instance.taiClearCoin(this.coinmoveArray[3],this.defaultSprCoin4,this.taiNodestop,this.arrayTaiNode),this.valuecretedite-=20,this.taivalue+=20,this.taiLabel.string=this.taivalue+"K",this.creditLabel.string=this.valuecretedite+"K"),0==this.valuecoin5&&this.valuecretedite>=50&&(e.instance.playCoinsInsert(),n.instance.taiClearCoin(this.coinmoveArray[4],this.defaultSprCoin5,this.taiNodestop,this.arrayTaiNode),this.valuecretedite-=50,this.taivalue+=50,this.taiLabel.string=this.taivalue+"K",this.creditLabel.string=this.valuecretedite+"K"),0==this.valuecoin6&&this.valuecretedite>=100&&(e.instance.playCoinsInsert(),n.instance.taiClearCoin(this.coinmoveArray[5],this.defaultSprCoin6,this.taiNodestop,this.arrayTaiNode),this.valuecretedite-=100,this.taivalue+=100,this.taiLabel.string=this.taivalue+"K",this.creditLabel.string=this.valuecretedite+"K"))},XuiButton:function(){this.timecount<=0||(0==this.valuecoin1&&(e.instance.playCoinsInsert(),this.valuecretedite>=1&&(n.instance.xiuClearCoin(this.coinmoveArray[0],this.defaultSprCoin1,this.xiaNodestop,this.arrayXuiNode),this.valuecretedite-=1,this.xiuvalue+=1,this.xiuLabel.string=this.xiuvalue+"K",this.creditLabel.string=this.valuecretedite+"K",console.log(" check value :  ------- : "+this.xiuvalue))),0==this.valuecoin2&&this.valuecretedite>=5&&(e.instance.playCoinsInsert(),n.instance.xiuClearCoin(this.coinmoveArray[1],this.defaultSprCoin2,this.xiaNodestop,this.arrayXuiNode),this.valuecretedite-=5,this.xiuvalue+=5,this.xiuLabel.string=this.xiuvalue+"K",this.creditLabel.string=this.valuecretedite+"K",console.log(" check value :  ------- : "+this.xiuvalue)),0==this.valuecoin3&&this.valuecretedite>=10&&(e.instance.playCoinsInsert(),n.instance.xiuClearCoin(this.coinmoveArray[2],this.defaultSprCoin3,this.xiaNodestop,this.arrayXuiNode),this.valuecretedite-=10,this.xiuvalue+=10,this.xiuLabel.string=this.xiuvalue+"K",this.creditLabel.string=this.valuecretedite+"K",console.log(" check value :  ------- : "+this.xiuvalue)),0==this.valuecoin4&&this.valuecretedite>=20&&(e.instance.playCoinsInsert(),n.instance.xiuClearCoin(this.coinmoveArray[3],this.defaultSprCoin4,this.xiaNodestop,this.arrayXuiNode),this.valuecretedite-=20,this.xiuvalue+=20,this.xiuLabel.string=this.xiuvalue+"K",this.creditLabel.string=this.valuecretedite+"K",console.log(" check value :  ------- : "+this.xiuvalue)),0==this.valuecoin5&&this.valuecretedite>=50&&(e.instance.playCoinsInsert(),n.instance.xiuClearCoin(this.coinmoveArray[4],this.defaultSprCoin5,this.xiaNodestop,this.arrayXuiNode),this.valuecretedite-=50,this.xiuvalue+=50,this.xiuLabel.string=this.xiuvalue+"K",this.creditLabel.string=this.valuecretedite+"K"),0==this.valuecoin6&&this.valuecretedite>=100&&(e.instance.playCoinsInsert(),n.instance.xiuClearCoin(this.coinmoveArray[5],this.defaultSprCoin6,this.xiaNodestop,this.arrayXuiNode),this.valuecretedite-=100,this.xiuvalue+=100,this.xiuLabel.string=this.xiuvalue+"K",this.creditLabel.string=this.valuecretedite+"K"))},cub:function(){var t=n.instance.resultBetTaiXiu(0,5),i=n.instance.resultBetTaiXiu(0,5),e=n.instance.resultBetTaiXiu(0,5),s=cc.instantiate(this.stopscub[e]);this.node.addChild(s),s.setPosition(cc.v2(this.cubArray[2].position)),this.cubArray[2]=s,o.instance.shakeCub3(this.cubArray[2]);var a=cc.instantiate(this.stopscub[t]);this.node.addChild(a),a.setPosition(cc.v2(this.cubArray[0].position)),this.cubArray[0]=a,c.instance.cubResultShake(this.cubArray[0]);var r=cc.instantiate(this.stopscub[i]);this.node.addChild(r),r.setPosition(cc.v2(this.cubArray[1].position)),this.cubArray[1]=r,c.instance.cub2(this.cubArray[1]);var u,h,l;u=0==t?1:1==t?2:2==t?3:3==t?4:4==t?5:6,h=0==i?1:1==i?2:2==i?3:3==i?4:4==i?5:6,l=0==e?1:1==e?2:2==e?3:3==e?4:4==e?5:6,this.totalValuesDice=u+h+l},moveCoin:function(){this.taivalue=0,this.xiuvalue=0,this.taiLabel.string="0 K",this.xiuLabel.string="0 K"},refreshScence:function(){cc.director.loadScene("GameScence")},exitFun:function(){cc.game.end()},buttonanimation:function(t){var i=t.addComponent(cc.Button);i.transition=cc.Button.Transition.SCALE,i.duration=.1,i.zoomScale=1.1},start:function(){this.valuecretedite=2e3,this.creditLabel.string=this.valuecretedite+" K",this.coin1function(),this.coin2function(),this.coin3function(),this.coin4function(),this.coin5function(),this.coin6function()},update:function(){}}),cc._RF.pop()},{"audio-manager":"audio-manager",coinAction:"coinAction",coinStyle:"coinStyle",coinSwitch:"coinSwitch",coinSwitchlight:"coinSwitchlight",normalCoin:"normalCoin",resultCubBet:"resultCubBet",shakeCub:"shakeCub"}],normalCoin:[function(t,i){"use strict";cc._RF.push(i,"790c7io4AlEw5AqGD/a3k72","normalCoin");var e=cc.Class({extends:cc.Component,properties:{},onLoad:function(){e.instance=this},start:function(){},coinNormalOne:function(t,i,e){t[0].opacity=0;var n=cc.instantiate(i[0]);n.setPosition(t[0].position),this.node.addChild(n),t[0]=n,t[0].setPosition(e)},coinNormalTwo:function(t,i,e){this.coinArray[1].opacity=0;var n=cc.instantiate(i[0]);n.setPosition(t[1].position),this.node.addChild(n),t[1]=n,t[1].setPosition(e)},coinNormalThree:function(t,i,e){t[2].opacity=0;var n=cc.instantiate(i[0]);n.setPosition(t[2].position),this.node.addChild(n),t[2]=n,t[2].setPosition(e)}});cc._RF.pop()},{}],resultCubBet:[function(t,i){"use strict";cc._RF.push(i,"24f5eavLZJBd4YyK1GkM3EC","resultCubBet");var e=cc.Class({extends:cc.Component,properties:{},onLoad:function(){e.instance=this},start:function(){},cubResultShake:function(t){var i=t.x,e=t.y;cc.tween(t).repeat(7,cc.tween().to(.2,{position:cc.v2(i+48,e+60),angle:360},{easing:"easeOutCubic"}).call(function(){}).to(.1,{position:cc.v2(i+80,e+140),angle:360},{easing:"easeOutCubic"}).call(function(){}).to(.1,{position:cc.v2(i-10,e+80),angle:360},{easing:"easeOutCubic"}).call(function(){}).to(.1,{position:cc.v2(i,e),angle:0},{easing:"easeOutCubic"})).start()},cub2:function(t){var i=t.x,e=t.y;cc.tween(t).repeat(7,cc.tween().to(.2,{position:cc.v2(i-80,e+140),rotation:360},{easing:"easeOutCubic"}).call(function(){}).to(.1,{position:cc.v2(i-80,e+140),rotation:360},{easing:"easeOutCubic"}).call(function(){}).to(.1,{position:cc.v2(i+10,e+80),rotation:360},{easing:"easeOutCubic"}).call(function(){}).to(.1,{position:cc.v2(i,e),rotation:0},{easing:"easeOutCubic"})).start()}});cc._RF.pop()},{}],shakeCub:[function(t,i){"use strict";function e(t,i){var e;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(e=n(t))||i&&t&&"number"==typeof t.length){e&&(t=e);var o=0;return function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(e=t[Symbol.iterator]()).next.bind(e)}function n(t,i){if(t){if("string"==typeof t)return o(t,i);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?o(t,i):void 0}}function o(t,i){(null==i||i>t.length)&&(i=t.length);for(var e=0,n=new Array(i);e<i;e++)n[e]=t[e];return n}cc._RF.push(i,"e4c53voogBIaqcyX1swoQOs","shakeCub");var s=cc.Class({extends:cc.Component,properties:{},onLoad:function(){s.instance=this},start:function(){},shakeCub3:function(t){var i=t.x,e=t.y;cc.tween(t).repeat(7,cc.tween().to(.2,{position:cc.v2(i-40,e+120),rotation:360},{easing:"easeOutCubic"}).call(function(){}).to(.1,{position:cc.v2(i-10,e+120),rotation:360},{easing:"easeOutCubic"}).call(function(){}).to(.1,{position:cc.v2(i+24,e+34),rotation:360},{easing:"easeOutCubic"}).call(function(){}).to(.1,{position:cc.v2(i+40,e+10),rotation:0},{easing:"easeOutCubic"}).call(function(){}).to(.1,{position:cc.v2(i,e),rotation:0},{easing:"easeOutCubic"})).start()},betCoinSwitch:function(t,i,e){t.opacity=0;var n=cc.instantiate(i[0]);n.setPosition(t.position),this.node.addChild(n),(t=n).setPosition(e)},clearArrayCoin:function(t,i){for(var n,o=e(t);!(n=o()).done;)n.value.destroy();for(var s,a=e(i);!(s=a()).done;)s.value.destroy()}});cc._RF.pop()},{}],start:[function(t,i){"use strict";cc._RF.push(i,"0b8d77FjlVACYXZo2WK+PRY","start"),cc.Class({extends:cc.Component,properties:{},start:function(){},loadUI:function(){cc.director.loadScene("GameScence")}}),cc._RF.pop()},{}]},{},["audio-manager","coinAction","coinStyle","coinSwitch","coinSwitchlight","game","HotUpdateModule","LoginView","normalCoin","resultCubBet","shakeCub","start"]);